import Firebase from "../config/fbConfig";
import {deleteFiles, uploadFiles} from "./files";


export const createMessage = (id, message, files) => {
    if(Firebase.auth().currentUser) {
        return new Promise((resolve, reject) => {
            Firebase.firestore().collection("chats").doc(id).collection("messages").add(message).then(ref => {
                uploadFiles(files, files.map(file => `/chats/${id}/messages/${ref.id}/${file.name}`)).then(urls => {
                    ref.update({urls: urls}).then((doc) => {
                        resolve({
                            urls: urls,
                            id: ref.id
                        });
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


export const updateMessage = (id, messageId, message) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("chats").doc(id).collection("messages").doc(messageId).update(message);
    }
}


export const deleteMessage = (id, messageId) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("chats").doc(id).collection("messages").doc(messageId).delete();
    }
}


export const searchPeople = (startAfter  = null, name = null) => {
    return new Promise((resolve, reject) => {
        let ref = Firebase.firestore().collection("users").orderBy("info.name").startAt(name).endAt(name+"\uf8ff");
        if(startAfter){
            ref = ref.startAfter(startAfter);
        }
        ref.limit(20).get().then(snapshot => {
            const users = [];
            snapshot.forEach((doc, i) => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(users);
        }).catch(err => {
            reject(err);
        });
    });
}


export const getChats = (startAfter = null) => {
    if(Firebase.auth().currentUser) {
        return new Promise((resolve, reject) => {
            const currentUser = Firebase.auth().currentUser;
            let ref = Firebase.firestore().collection("chats").orderBy("updatedAt", "desc").where("members", "array-contains", currentUser.uid);
            if (startAfter) {
                ref = ref.startAfter(startAfter)
            }
            ref.onSnapshot(snapshot => {
                const chats = [];
                snapshot.forEach((doc, i) => {
                    chats.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                resolve(chats);
            })
        });
    }
}


export const getMessages = (id, startAfter = null) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return new Promise((resolve, reject) => {
            if (startAfter) {
                let ref = Firebase.firestore().collection("chats").doc(id).collection("messages").orderBy("createdAt", "desc");
                if (startAfter) {
                    ref = ref.startAfter(startAfter)
                }
                ref.limit(20).get().then(snapshot => {
                    const messages = [];
                    snapshot.forEach((doc, i) => {
                        messages.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    });
                    resolve(messages);
                }).catch(err => {
                    reject(err);
                });
            } else {
                const secondUid = id.replace(currentUser.uid, "");
                let ref = Firebase.firestore().collection("chats").doc(id).collection("messages").orderBy("createdAt", "desc");
                ref.limit(20).onSnapshot(snapshot => {
                    const messages = [];
                    snapshot.forEach((doc, i) => {
                        messages.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    });
                    resolve(messages);
                });
            }
        });
    }
}




export const getUser = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("users").doc(id).get().then(doc => {
            resolve({
                id: doc.id,
                ...doc.data()
            });
        }).catch(err => {
            reject(err);
        })
    });
}


export const setSeen = (id) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return Firebase.firestore().collection("chats").doc(id).update({
            ["messages." + currentUser.uid]: 0
        });
    }
}

