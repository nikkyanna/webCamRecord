import "firebase/storage";
import "firebase/firestore";

import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAjTwow88GD-sd8zxje_ykFCRIFPcNhi54",
  authDomain: "web-cam-demo.firebaseapp.com",
  databaseURL: "https://web-cam-demo.firebaseio.com",
  projectId: "web-cam-demo",
  storageBucket: "web-cam-demo.appspot.com",
  messagingSenderId: "1025469341633",
  appId: "1:1025469341633:web:533b1479d36fa3a3d45940",
};

firebase.initializeApp(firebaseConfig);

export default firebase;