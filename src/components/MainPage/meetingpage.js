import MainScreen from "../MainScreen/MainScreen.component";
import firepadRef, { db } from "../../server/firebase";
import { useLocation } from "react-router-dom";

import React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import {
  setMainStream,
  addParticipant,
  setUser,
  removeParticipant,
  updateParticipant,
} from "../../store/actioncreator";

const Meeting = (props) => {
  const location = useLocation();
  const { number } = location.state || "";
  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    return localStream;
  };
  useEffect(async () => {
    const userName = prompt("닉네임 입력");
    const stream = await getUserStream();
    stream.getVideoTracks()[0].enabled = false;
    props.setMainStream(stream);

    connectedRef.on("value", (snap) => {
      if (snap.val()) {
        const defaultPreference = {
          audio: true,
          video: false,
          screen: false,
        };
        const userStatusRef = participantRef.push({
          userName,
          preferences: defaultPreference,
        });
        props.setUser({
          [userStatusRef.key]: { name: userName, ...defaultPreference },
        });
        userStatusRef.onDisconnect().remove();
      }
    });
  }, []);

  if(number){
    console.log("방 참가하기")
    console.log("입력받은 number : ",number) // 이걸 A라고 하고
    console.log("현재 firepadRef : ", firepadRef) // 이걸 B라고 하면
    console.log("현재 firepadRef.parent : ", firepadRef.parent)
    
  }else{
    console.log("방 생성하기")
  }
  // 해야 할일은...

  // RealtimeDB에서 A의 값을 갖는 것을 가져옴.
  // const S = db.database().ref(number).set("무야호1")
  // write
  // 그 휘하에 참가자 추가.
  const connectedRef = db.database().ref(".info/connected");
  const participantRef = firepadRef.child("participants");
  
  const isUserSet = !!props.user;
  const isStreamSet = !!props.stream;

  useEffect(() => {
    if (isStreamSet && isUserSet) {
      participantRef.on("child_added", (snap) => {
        const preferenceUpdateEvent = participantRef
          .child(snap.key)
          .child("preferences");
        preferenceUpdateEvent.on("child_changed", (preferenceSnap) => {
          props.updateParticipant({
            [snap.key]: {
              [preferenceSnap.key]: preferenceSnap.val(),
            },
          });
        });
        const { userName: name, preferences = {} } = snap.val();
        props.addParticipant({
          [snap.key]: {
            name,
            ...preferences,
          },
        });
      });
      participantRef.on("child_removed", (snap) => {
        props.removeParticipant(snap.key);
      });
    }
    if (number) {
      window.history.replaceState(null, "Meet", "?id=" + number);
    } else {
      window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);
    }
  }, [isStreamSet, isUserSet]);

  return (
    <div>
      <MainScreen />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    user: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    addParticipant: (user) => dispatch(addParticipant(user)),
    setUser: (user) => dispatch(setUser(user)),
    removeParticipant: (userId) => dispatch(removeParticipant(userId)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
