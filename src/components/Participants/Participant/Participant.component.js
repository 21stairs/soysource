import React, { useState, useRef, useEffect } from "react";
import Card from "../../Shared/Card/Card.component";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Participant.css";
import Not_ready from "./minus-button.png"
import Ready from "./accept.png"
import firepadRef, { db } from "../../../server/firebase";
import { rId } from "../../MainPage/roomCreate";

export const Participant = (props) => {
  const {
    curentIndex,
    currentParticipant,
    participantKey,
    Ready_isCheck,
    hideVideo,
    videoRef,
    showAvatar,
    currentUser,
  } = props;
  
  const urlparams = new URLSearchParams(window.location.search);
  const roomId = urlparams.get("id");
  const [isReadyCheck, setIsReadyCheck] = useState("false");
  const [changeUserCheck, setChangeUserCheck] = useState("");
  const [res, setRes] = useState("false");
  const roomRef = db.database().ref(roomId)
  const userRef = db.database().ref(roomId + '/participants/' + participantKey[curentIndex - 1])
  const [cnt, setCnt] = useState("0");
  // console.log("======== ", currentUser, " ========")
  // console.log("======== ", currentUser, " ========")
  
  roomRef.child("isChangeReadyState");

  
  //한번만 실행 되도록
  useEffect(() => {
    
    //참가자 수 만큼 반복 (participantKey : 참가자 수의 키값 배열)
    participantKey.forEach(element => {
      
      if (participantKey[curentIndex - 1] !== element) {
        roomRef.child("participants").child(element).on('value', (snapshot) => {
          console.log("유저 keys : " , element)
          console.log("현재 비디오 창 유저 : " , participantKey[curentIndex-1]) 
          const data = snapshot.val();
          
          console.log(participantKey.length)
          console.log("값 뭐임", data.isReady)
          setIsReadyCheck(data.isReady)

        });
      }
    });

  },[]);

  //Ready 클릭 이벤트
  const On_ready = () => {
    const curUser = firepadRef.child("participants").child(participantKey[0])
    // console.log("실행 1")

    console.log("바뀐 유저의 키값 : ",curUser.key);
    roomRef.update({
      isChangeReadyState: curUser.key,
    });

    setChangeUserCheck(curUser.key)
    // console.log("바뀐 유저의 키값을 changeUserCheck에 넣음 : ",changeUserCheck)

    if (currentUser) {
      if (isReadyCheck) {
        setIsReadyCheck(false);
        // console.log("실행 2-1 : ", curUser)


        curUser.update({
          isReady: false,
        });
        // console.log("실행 2-2 : ", curUser)
      }
      else {
        setIsReadyCheck(true);
        // console.log("실행 3-1 : ", curUser)

        curUser.update({
          isReady: true,
        });
        // console.log("실행 3-2 : ", curUser)
      }
    }
  }


  if (!currentParticipant) return <></>;



  return (
    <div className={`participant ${hideVideo ? "hide" : ""}`}>
      <Card>
        <video
          ref={videoRef}
          className={currentUser ? "your" : "video"}

          id={`participantVideo${curentIndex}`}
          autoPlay
          playsInline
        ></video>
        {!currentParticipant.audio && (
          <FontAwesomeIcon
            className="muted"
            icon={faMicrophoneSlash}
            title="Muted"
          />
        )}
        {showAvatar && (
          <div
            style={{ background: currentParticipant.avatarColor }}
            className="avatar"
          >
            {currentParticipant.name[0]}
          </div>
        )}
        {/* <div onClick={On_ready} > */}
        <img className="ready" onClick={On_ready} src={isReadyCheck ? Ready : Not_ready} />
        {/* <img className="ready_2" src={!!res ? Ready : Not_ready} /> */}
        {/* </div> */}
        <div className="name">
          {currentParticipant.name}

          {currentUser ? "(You)" : ""}
        </div>
      </Card>
    </div>
  );
};
