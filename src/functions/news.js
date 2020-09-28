import Firebase from "../config/fbConfig";
import {uploadFiles} from "./files";


export const createPost = (post, files = []) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("news").add(post).then(ref => {
            uploadFiles(files, files.map(file => `/news/${ref.id}/${file.name}`)).then(urls => {
                Firebase.firestore().collection("news").doc(ref.id).update({ urls: urls }).then(() => {
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
};


export const updatePost = (id, post) => {
    return Firebase.firestore().collection("news").doc(id).update(post);
}


export const deletePost = (id) => {
    return Firebase.firestore().collection("news").doc(id).delete();
}


export const likePost = (id, like, currentUser) => {
    if(Firebase.auth().currentUser) {
        if (like) {
            return Firebase.firestore().collection("news").doc(id).collection("likes").doc(currentUser.uid).set({
                date: new Date()
            });
        } else {
            return Firebase.firestore().collection("news").doc(id).collection("likes").doc(currentUser.uid).delete();
        }
    }
}


export const createComment = (id, comment) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("news").doc(id).collection("comments").add(comment);
    }
}


export const updateComment = (id, body, commentId) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("news").doc(id).collection("comments").doc(commentId).update({
            body: body
        });
    }
}


export const deleteComment = (id, commentId) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("news").doc(id).collection("comments").doc(commentId).delete();
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


export const getPost = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("news").doc(id).get().then(doc => {
            resolve({
                id: doc.id,
                ...doc.data()
            });
        }).catch(err => {
            reject(err);
        })
    });
}

export const getPosts = (startAfter, topic) => {
    return new Promise((resolve, reject) => {
        let ref = Firebase.firestore().collection("news").orderBy("createdAt", "desc")
        if(topic){
            ref = ref.where("topic", "==", topic);
        }
        if(startAfter){
            ref = ref.startAfter(startAfter);
        }
        ref.limit(20).get().then(snapshot => {
            const news = [];
            snapshot.forEach((doc, i) => {
                news.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(news);
        }).catch(err => {
            reject(err);
        });
    });
}


export const getComments = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("news").doc(id).collection("comments").get().then(snapshot => {
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

export const isLiked = (id, uid) => {
    if(Firebase.auth().currentUser) {
        return new Promise((resolve, reject) => {
            Firebase.firestore().collection("news").doc(id).collection("likes").doc(uid).get().then(snapshot => {
                resolve(snapshot.data() ? true : false);
            }).catch(err => {
                reject(err);
            })
        });
    }
}