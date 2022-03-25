import firebase from "firebase";
import "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyAeOZNkWf-ssQHySRTw0JsZcZbBEueYknY", // Add API Key
  databaseURL: "https://webrtc-f81d9-default-rtdb.firebaseio.com", // Add databaseURL
  authDomain: "webrtc-f81d9.firebaseapp.com",
  projectId: "webrtc-f81d9",
  storageBucket: "webrtc-f81d9.appspot.com",
  messagingSenderId: "859269665493",
  appId: "1:859269665493:web:a097b41a7b24a7ca79c85c",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase;

var firepadRef = firebase.database().ref();

export const userName = "temp";
//URL 치고 들어올시 처리
const urlparams = new URLSearchParams(window.location.search);
const roomId = urlparams.get("id");

if (roomId) {
  firepadRef = firepadRef.child(roomId);
}

//URL 치지 않고 들어올시 처리
export function getMetting(number) {
  console.log("in");
  console.log(number);

  if (number) {
    firepadRef = firepadRef.child(number);
    window.history.replaceState(null, "Meet", "?id=" + number);
  } else {
    firepadRef = firepadRef.push();
    window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);
  }
}
export default firepadRef;
