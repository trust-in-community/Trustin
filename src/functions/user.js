import Firebase from "../config/fbConfig";
import i18n  from "i18next"
import vars from "../config/vars.json"

export const signIn = ({ email, password }) => {
    Firebase.auth().languageCode = i18n.language;
    return Firebase.auth().signInWithEmailAndPassword(email, password);
}


export const signOut = () => {
    return Firebase.auth().signOut();
}


export const signUp = (user, password, image) => {
    Firebase.auth().languageCode = i18n.language;
    return new Promise(((resolve, reject) => {
        Firebase.auth().createUserWithEmailAndPassword(user.static.email, password).then((data)=>{
            Firebase.storage().ref("users").child(data.user.uid).put(image).then(() => {
                Firebase.storage().ref("users").child(data.user.uid).getDownloadURL().then((url) => {
                    data.user.updateProfile({
                        displayName: user.info.name,
                        photoURL: url
                    }).then(() => {
                        user.info.avatar = url;
                        Firebase.firestore().collection("users").doc(data.user.uid).set(user).then(() => {
                            data.user.sendEmailVerification().then(() => {
                                resolve()
                            }).catch(err => {
                                reject(err)
                            })
                        }).catch(err => {
                            reject(err)
                        })
                    }).catch(err => {
                        reject(err)
                    });
                }).catch(err => {
                    reject(err)
                });
            }).catch(err => {
                reject(err)
            });
        }).catch(err => {
            reject(err)
        });
    }));
}

export const updatePassword = (password) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return currentUser.updatePassword(password);
    }
}

export const sendPasswordResetEmail = ({ email }) => {
    Firebase.auth().languageCode = i18n.language;
    return Firebase.auth().sendPasswordResetEmail(email);
}


export const handleVerifyEmail = (actionCode) => {
    Firebase.auth().languageCode = i18n.language;
    return Firebase.auth().applyActionCode(actionCode);
}


export const handleResetPasswordCode = (actionCode) => {
    Firebase.auth().languageCode = i18n.language;
    return Firebase.auth().verifyPasswordResetCode(actionCode);
}


export const handleResetPassword = (actionCode, { email, password }) => {
    Firebase.auth().languageCode = i18n.language;
    return new Promise(((resolve, reject) => {
        Firebase.auth().confirmPasswordReset(actionCode, password).then(() => {
            signIn(email, password).then(() => {
                resolve()
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    }))
}

export const updateUser = (uid, user) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("users").doc(uid).update(user);
    }
}

export const updateProfile = (image = null,  user) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return new Promise(((resolve, reject) => {
            if (image) {
                Firebase.storage().ref("users").child(currentUser.uid).put(image).then(() => {
                    Firebase.storage().ref("users").child(currentUser.uid).getDownloadURL().then((url) => {
                        currentUser.updateProfile({
                            displayName: user.info.name,
                            photoURL: url
                        }).then(() => {
                            user.info.avatar = url;
                            Firebase.firestore().collection("users").doc(currentUser.uid).update(user).then(() => {
                                resolve(user);
                            }).catch(err => {
                                reject(err)
                            })
                        }).catch(err => {
                            reject(err)
                        });
                    }).catch(err => {
                        reject(err)
                    });
                }).catch(err => {
                    reject(err)
                });
            } else {
                currentUser.updateProfile({
                    displayName: user.info.name
                }).then(() => {
                    Firebase.firestore().collection("users").doc(currentUser.uid).update(user).then(() => {
                        resolve(user);
                    }).catch(err => {
                        reject(err)
                    })
                }).catch(err => {
                    reject(err)
                });
            }
        }))
    }
}




export const updateCard = (items) => {
    if(Firebase.auth().currentUser) {
        const uid = Firebase.auth().currentUser.uid;
        return Firebase.firestore().collection("card").doc(uid).set({
            items: items
        }, {merge: true});
    }
}

export const getCard = () => {
    if(Firebase.auth().currentUser) {
        const uid = Firebase.auth().currentUser.uid;
        return new Promise((resolve, reject) => {
            Firebase.firestore().collection("card").doc(uid).get().then(doc => {
                resolve({
                    id: doc.id,
                    ...doc.data()
                });
            }).catch(err => {
                reject(err);
            })
        });
    }
}


export const getSaved = () => {
    if(Firebase.auth().currentUser) {
        const uid = Firebase.auth().currentUser.uid;
        return new Promise((resolve, reject) => {
            Firebase.firestore().collection("users").doc(uid).collection("saved").get().then(snapshot => {
                let posts = [];
                snapshot.forEach(doc => {
                    Firebase.firestore().collection("posts").doc(doc.id).get().then(post => {
                        posts.push({
                            ...post.data(),
                            id: post.id
                        });
                        if (posts.length === snapshot.docs.length) {
                            resolve(posts);
                        }
                    })
                });
            }).catch(err => {
                reject(err);
            })
        });
    }
}


export const createOrder = (items, location) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return Firebase.firestore().collection("orders").add({
            items: items,
            state: "pending",
            location: location,
            author: {
                name: currentUser.displayName,
                uid: currentUser.uid,
                avatar: currentUser.photoURL,
            },
            createdAt: new Date()
        });
    }
}

export const updateOrder = (id, order) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("orders").doc(id).update(order);
    }
}

export const getOrders = (startAfter = null) => {
    if(Firebase.auth().currentUser) {
        return new Promise((resolve, reject) => {
            const currentUser = Firebase.auth().currentUser;
            let ref = Firebase.firestore().collection("orders").orderBy("createdAt", "desc");
            if (startAfter) {
                ref = ref.startAfter(startAfter);
            }
            if (vars.admin !== currentUser.uid) {
                ref = ref.where("author.uid", "==", currentUser.uid)
            }

            ref.limit(20).get().then(snapshot => {
                const orders = [];
                snapshot.forEach((doc, i) => {
                    orders.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                resolve(orders);
            }).catch(err => {
                reject(err);
            });
        });
    }
}