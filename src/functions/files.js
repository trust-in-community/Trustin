import Firebase from "../config/fbConfig";
import Compressor from 'compressorjs';


export const uploadFiles = (files, references) => {
    let promises = [];
    files.forEach((file, i) => {
        promises.push(new Promise((resolve, reject) => {
            new Compressor(file, { quality: 0.6, success(result) {
                Firebase.storage().ref().child(references[i]).put(result).then(() => {
                    Firebase.storage().ref().child(references[i]).getDownloadURL().then((url) => {
                        resolve({
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            url: url
                        });
                    }).catch(error => {
                        reject(error);
                    });
                }).catch(error => {
                    reject(error);
                });
            }, error(error) {
                reject(error);
            }})
        }));
    });

    return Promise.all(promises);
}



export const deleteFiles = (references, completion) => {
    if(references.length===0){
        completion("Success", "Successfully deleted files");
        return;
    } else {
        Firebase.storage().ref().child(references[references.length-1]).delete().then(() => {
            references.pop();
            deleteFiles(references, completion);
        }).catch(error => {
            completion("Error", error.message);
        });
    }
}
