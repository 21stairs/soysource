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
  console.log("(firebase.js) roomId is true");
  firepadRef = firepadRef.child(roomId);
} else {
  console.log("(firebase.js) roomId is false");
  console.log("초기화 실행");
  firepadRef = firepadRef.push();
}

//URL 치지 않고 들어올시 처리
export const getMetting = (number) => {
  console.log("(firebase.js) getMetting - number : ", number);
  if (number) {
    console.log("(firebase.js) number is true");
    firepadRef = firebase.database().ref(number);
    window.history.replaceState(null, "Meet", "?id=" + number);
  } else {
    console.log("(firebase.js) number is false");
    window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);
  }
  return firepadRef;
};

function setFirepadRef(newFirepadRef){
  firepadRef = newFirepadRef
}

export {setFirepadRef}
export default firepadRef;