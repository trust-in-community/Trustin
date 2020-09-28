import Firebase from "../config/fbConfig";
import {deleteFiles, uploadFiles} from "./files";


export const createTag = (tag) => {
    if(Firebase.auth().currentUser){
        return Firebase.firestore().collection("tags").add(tag);
    }
}

export const deleteTag = (id) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("tags").doc(id).delete();
    }
}

export const get = (callback) => {
    Firebase.firestore().collection("tags").get().then((snapshot) => {
        const tags = [];
        snapshot.forEach(doc => {
            tags.push({
                id: doc.id,
                ...doc.data()
            })
        })
        callback(tags);
    });
}


export const getRequests = (startAfter = null) => {
    return new Promise((resolve, reject) => {
        let ref = Firebase.firestore().collection("users").orderBy("createdAt", "desc").where("status", "==",  "pending");
        if(startAfter){
            ref = ref.startAfter(startAfter)
        }
        ref.onSnapshot(snapshot => {
            const users = [];
            snapshot.forEach((doc, i) => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(users);
        })
    });
}


export const getItems = () => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("items").onSnapshot(snapshot => {
            const items = [];
            snapshot.forEach((doc, i) => {
                items.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(items);
        })
    });
}




export const respondRequest = (id, response) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("users").doc(id).update({status: response});
    }
}

export const createTopic = (topic) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("topics").add(topic);
    }
}


export const deleteTopic = (id) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("topics").doc(id).delete();
    }
}


export const updateAdmin = (type, data) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("admin").doc(type).set(data, {merge: true});
    }
}

export const getAdmin = () => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("admin").get().then(snapshot => {
            const data = {};
            snapshot.forEach((doc, i) => {
                data[doc.id] = doc.data();
            });
            resolve(data);
        });
    })
}

export const createItem = (item, files) => {
    if(Firebase.auth().currentUser) {
        return new Promise((resolve, reject) => {
            Firebase.firestore().collection("items").add(item).then(ref => {
                uploadFiles(files, files.map(file => `/items/${ref.id}/${file.name}`)).then(urls => {
                    Firebase.firestore().collection("items").doc(ref.id).update({urls: urls}).then(() => {
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

export const updateItem = (id, item) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("items").doc(id).update(item);
    }
}

export const deleteItem = (id) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("items").doc(id).delete();
    }
}


export const getItem = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("items").doc(id).get().then(doc => {
            resolve({
                id: doc.id,
                ...doc.data()
            });
        }).catch(err => {
            reject(err);
        })
    });
}
