import Firebase from "../config/fbConfig";
import {uploadFiles} from "./files";

export const createProject = (project, files = []) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("projects").add(project).then(ref => {
            uploadFiles(files, files.map(file => `/projects/${ref.id}/${file.name}`)).then(urls => {
                Firebase.firestore().collection("projects").doc(ref.id).update({ urls: urls }).then(() => {
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

export const updateProject = (id, project) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("projects").doc(id).update(project);
    }
}


export const deleteProject = (id) => {
    return Firebase.firestore().collection("projects").doc(id).delete();
}


export const createStory = (id, story, files = [], completion) => {
    return new Promise((resolve, reject) => {
        uploadFiles(files, files.map(file => `/projects/${id}/story/${file.name}`)).then(urls => {
            story.urls = urls;
            Firebase.firestore().collection("projects").doc(id).collection("story").add(story).then(doc => {
                story.id = doc.id;
                resolve(story);
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}


export const deleteStory = (id, storyId) => {
    return Firebase.firestore().collection("projects").doc(id).collection("story").doc(storyId).delete();
}

export const getComments = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("projects").doc(id).collection("comments").get().then(snapshot => {
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

export const getStory = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("projects").doc(id).collection("story").get().then(snapshot => {
            const stories = [];
            snapshot.forEach((doc, i) => {
                stories.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(stories);
        }).catch(err => {
            reject(err);
        })
    });
}

export const getContributors = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("projects").doc(id).collection("contributors").get().then(snapshot => {
            const contributors = [];
            snapshot.forEach((doc, i) => {
                contributors.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(contributors);
        }).catch(err => {
            reject(err);
        })
    });
}


export const getProjects = (startAfter) => {
    return new Promise((resolve, reject) => {
        let ref = Firebase.firestore().collection("projects").orderBy("deadline", "desc")
        if(startAfter){
            ref = ref.startAfter(startAfter);
        }
        ref.limit(20).get().then(snapshot => {
            const projects = [];
            snapshot.forEach((doc, i) => {
                projects.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(projects);
        }).catch(err => {
            reject(err);
        });
    });
}


export const getProject = (id) => {
    return new Promise((resolve, reject) => {
        Firebase.firestore().collection("projects").doc(id).get().then(doc => {
            console.log(doc.data());
            resolve({
                id: doc.id,
                ...doc.data()
            });
        }).catch(err => {
            reject(err);
        })
    });
}


export const createComment = (id, comment) => {
    if (Firebase.auth().currentUser) {
        return Firebase.firestore().collection("projects").doc(id).collection("comments").add(comment);
    }
}


export const updateComment = (id, body, commentId) => {
    if(Firebase.auth().currentUser) {
        return Firebase.firestore().collection("projects").doc(id).collection("comments").doc(commentId).update({
            body: body
        });
    }
}


export const deleteComment = (id, commentId) => {
    if (Firebase.auth().currentUser) {
        return Firebase.firestore().collection("projects").doc(id).collection("comments").doc(commentId).delete();
    }
}


export const getUpcomingProjects = () => {
    return new Promise((resolve, reject) => {
        let ref = Firebase.firestore().collection("projects").where("deadline", ">", new Date()).limit(3);
        ref.get().then(snapshot => {
            const projects = [];
            snapshot.forEach((doc, i) => {
                projects.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            resolve(projects);
        }).catch(err => {
            reject(err);
        });
    });
}