import MainScreen from "../MainScreen/MainScreen.component";
import firepadRef, { db } from "../../server/firebase";
// import { useLocation } from "react-router-dom";

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
        // 유저 디바이스 정보 설정
        const defaultPreference = {
          audio: true,
          video: false,
          screen: false,
        };
        // participantRef는 firepadRef.child("participants") 을 가리키고 여기에 userStatusRef에 담음
        const userStatusRef = participantRef.push({
          userName,
          preferences: defaultPreference,
        });
        // setUser를 통해서 해당 유저의 정보를 userStatusRef에 저장된 객체를 값으로 set
        props.setUser({
          [userStatusRef.key]: { name: userName, ...defaultPreference },
        });
        // 연결 제거
        userStatusRef.onDisconnect().remove();
      }
    });
  }, []);
  const connectedRef = db.database().ref(".info/connected");
  const participantRef = firepadRef.child("participants");

  const isUserSet = !!props.user;
  const isStreamSet = !!props.stream;

  useEffect(() => {
    if (isStreamSet && isUserSet) {
      //자식 노드 추가가 감지 되면 실행
      participantRef.on("child_added", (snap) => {
        const preferenceUpdateEvent = participantRef
          .child(snap.key)
          .child("preferences");
        //자식 노드의 값이 변경 감지 후 실행
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
      //자식 노드가 삭제 되면 감지 후 실행
      participantRef.on("child_removed", (snap) => {
        props.removeParticipant(snap.key);
      });
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
