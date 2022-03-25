import firebase from "firebase";
import "firebase/database"

var firebaseConfig = {
  apiKey: "AIzaSyAeOZNkWf-ssQHySRTw0JsZcZbBEueYknY", // Add API Key
  databaseURL: "https://webrtc-f81d9-default-rtdb.firebaseio.com", // Add databaseURL
  authDomain: "webrtc-f81d9.firebaseapp.com",
  projectId: "webrtc-f81d9",
  storageBucket: "webrtc-f81d9.appspot.com",
  messagingSenderId: "859269665493",
  appId: "1:859269665493:web:a097b41a7b24a7ca79c85c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase;

var firepadRef = firebase.database().ref();

const urlparams = new URLSearchParams(window.location.search);
const roomId = urlparams.get("id");

if (roomId) {
  console.log("(firebase.js) roomId is True")
  firepadRef = firepadRef.child(roomId);
} else {
  console.log("(firebase.js) roomId is False")
  firepadRef = firepadRef.push();
}

console.log("(firebase.js) firebase is : ", firebase)
console.log("(firebase.js) firepadRef is : ", firepadRef)
console.log("(firebase.js) firepadRef.key is : ", firepadRef.key)

var firepadRefKey = firepadRef.key

export {firebase,firepadRefKey};
export default firepadRef;