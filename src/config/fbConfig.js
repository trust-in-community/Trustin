import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALXN7y9Eh5bWqT8x8FfjVC_SY1QTsfQio",
    authDomain: "taraz-alumni.firebaseapp.com",
    databaseURL: "https://taraz-alumni.firebaseio.com",
    projectId: "taraz-alumni",
    storageBucket: "taraz-alumni.appspot.com",
    messagingSenderId: "926601079043",
    appId: "1:926601079043:web:53d3cfaa41ce990d616136",
    measurementId: "G-Q9XMRXBEDJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
