import { notification } from "antd";
import React from "react";


// Handle files and return files, urls
export const handleFiles = (files = [], urls = [], index, limit = files.length, completion) => {
    if(index===files.length || index===limit){
        completion(urls);
        return;
    }
    const file = files[index];
    const reader = new FileReader();
    reader.onerror = ((obj) => {
        console.log(obj.target.error)
        handleFiles(files, [...urls], index + 1, limit, completion)
    })
    reader.onload = ((obj) => {
        handleFiles(files, [...urls, obj.target.result], index+1, limit, completion)
    });
    reader.readAsDataURL(file);
}



// Sow notification message
export const showNofication = (t, status, message) => {
    notification.open({
        message: t(status),
        description: t(message),
        placement: "topRight",
        icon: status === "Success" ? <span className="fas fa-check-circle uk-text-success" /> : <span className="fas fa-exclamation-circle uk-text-danger" />
    });
}
