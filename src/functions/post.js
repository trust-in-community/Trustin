import Firebase from "../config/fbConfig";
import {uploadFiles} from "./files";

export const createProduct = (product, files) => {
    if(Firebase.auth().currentUser) {
        return new Promise((resolve, reject) => {
            Firebase.firestore().collection("posts").add(product).then(ref => {
                uploadFiles(files, files.map(file => `/posts/${ref.id}/${file.name}`)).then(urls => {
                    Firebase.firestore().collection("posts").doc(ref.id).update({urls: urls}).then(() => {
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }
}

export const updateProduct = (id, product) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("posts").doc(id).update(product);
    }
}

export const deleteProduct = (id) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("posts").doc(id).delete();
    }
}


export const savePost = (id) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return Firebase.firestore().collection("users").doc(currentUser.uid).collection("saved").doc(id).set({
            date: new Date()
        });
    }
}

export const unsavePost = (id) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return Firebase.firestore().collection("users").doc(currentUser.uid).collection("saved").doc(id).delete();
    }
}


export const addReview = (uid, review) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return Firebase.firestore().collection("users").doc(uid).collection("reviews").doc(currentUser.uid).set(review);
    }
}


export const getTags = () => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("tags").get().then(snapshot => {
            const tags = [];
            snapshot.forEach((doc, i) => {
                tags.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(tags);
        }).catch(err => {
            reject(err);
        })
    });
}

export const getProducts = (startAfter = null, topic = null, name = null, uid = null ) => {
    return new Promise((resolve, reject) => {
        let ref = Firebase.firestore().collection("posts")
        if(name){
            ref = ref.orderBy("title").startAt(name).endAt(name+"\uf8ff")
        } else {
            ref = ref.orderBy("createdAt", "desc")
        }
        if(topic){
            ref = ref.where("topic", "==", topic);
        }
        if(uid){
            ref = ref.where("author.uid", "==", uid);
        }
        if(startAfter){
            ref = ref.startAfter(startAfter);
        }
        ref.limit(20).get().then(snapshot => {
            const products = [];
            snapshot.forEach((doc, i) => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(products);
        }).catch(err => {
            reject(err);
        });
    });
}


export const getProduct = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("posts").doc(id).get().then(doc => {
            resolve({
                id: doc.id,
                ...doc.data()
            });
        }).catch(err => {
            reject(err);
        })
    });
}

export const isSaved = (id) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return new Promise((resolve, reject) => {
            Firebase.firestore().collection("users").doc(currentUser.uid).collection("saved").doc(id).get().then(doc => {
                resolve(doc.data() ? true : false);
            }).catch(err => {
                reject(err);
            })
        });
    }
}


