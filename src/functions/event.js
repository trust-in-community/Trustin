import Firebase from "../config/fbConfig";
import {deleteFiles, uploadFiles} from "./files";

export const createEvent = (event) => {
    return Firebase.firestore().collection("events").add(event);
}


export const uploadEventImages = (event, files) => {
    return new Promise((resolve, reject) => {
        uploadFiles(files, files.map(file => `/news/${event.id}/${file.name}`)).then(urls => {
            event.urls.push(...urls);
            Firebase.firestore().collection("events").doc(event.id).update({ urls: event.urls }).then(() => {
                resolve(event);
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

export const updateEvent = (id, event) => {
    return Firebase.firestore().collection("events").doc(id).update(event);
}


export const deleteEvent = (id) => {
    return Firebase.firestore().collection("events").doc(id).delete();
}


export const joinEvent = (id) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return Firebase.firestore().collection("events").doc(id).collection("members").doc(currentUser.uid).set({
            uid: currentUser.uid,
            avatar: currentUser.photoURL,
            name: currentUser.displayName,
        });
    }
}

export const leaveEvent = (id) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return Firebase.firestore().collection("events").doc(id).collection("members").doc(currentUser.uid).delete();
    }
}


export const createComment = (id, comment) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("events").doc(id).collection("comments").add(comment);
    }
}


export const updateComment = (id, body, commentId) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("events").doc(id).collection("comments").doc(commentId).update({
            body: body
        });
    }
}


export const deleteComment = (id, commentId) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("events").doc(id).collection("comments").doc(commentId).delete();
    }
}


export const getEvent = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("events").doc(id).get().then(doc => {
            resolve({
                id: doc.id,
                ...doc.data()
            });
        }).catch(err => {
            reject(err);
        })
    });
}

export const getEvents = (startAfter = null, topic = null) => {
    return new Promise((resolve, reject) => {
        let ref = Firebase.firestore().collection("events").orderBy("date", "desc")
        if(topic){
            ref = ref.where("topic", "==", topic);
        }
        if(startAfter){
            ref = ref.startAfter(startAfter);
        }
        ref.limit(20).get().then(snapshot => {
            const events = [];
            snapshot.forEach((doc, i) => {
                events.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(events);
        }).catch(err => {
            reject(err);
        });
    });
}


export const getMonthsEvents = (date) => {
    return new Promise((resolve, reject) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let ref = Firebase.firestore().collection("events").where("date", ">", start).where("date", "<", end)
        ref.get().then(snapshot => {
            const events = [];
            snapshot.forEach((doc, i) => {
                events.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(events);
        }).catch(err => {
            reject(err);
        });
    });
}


export const getComments = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("events").doc(id).collection("comments").get().then(snapshot => {
            const comments = [];
            snapshot.forEach((doc, i) => {
                comments.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(comments);
        }).catch(err => {
            reject(err);
        })
    });
}


export const getMembers = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("events").doc(id).collection("members").get().then(snapshot => {
            const members = [];
            snapshot.forEach((doc, i) => {
                members.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(members);
        }).catch(err => {
            reject(err);
        })
    });
}

export const isJoined = (id) => {
    if(Firebase.auth().currentUser) {
        const currentUser = Firebase.auth().currentUser;
        return new Promise((resolve, reject) => {
            if (currentUser && currentUser.uid) {
                Firebase.firestore().collection("events").doc(id).collection("members").doc(currentUser.uid).get().then(doc => {
                    resolve(doc.data() ? true : false);
                }).catch(err => {
                    reject(err);
                })
            } else {
                reject({message: "User not found"});
            }
        });
    }
}


export const getTopics = () => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("topics").get().then(snapshot => {
            const topics = [];
            snapshot.forEach((doc, i) => {
                topics.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(topics);
        }).catch(err => {
            reject(err);
        })
    });
}
