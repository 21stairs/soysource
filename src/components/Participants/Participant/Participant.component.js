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
  const [isReadyCheck, setIsReadyCheck] = useState("");
  const roomRef = db.database().ref(roomId)
  const curUser = roomRef.child("participants")
  
  roomRef.child("isChangeReadyState");

  
  //한번만 실행 되도록
  useEffect(() => {

    // console.log(isReadyCheck)
    
    //여기서 db에 있는 isReady 값을 업데이트 받아야 함
    curUser.on('value',(snapshot) => {
      const data = snapshot.val();
      // console.log("확인 필요", Object.keys(data))
      // console.log(data)
      // if (!!Object.keys(data)) {
        
      // } else {
        for (let index = 0; index < Object.keys(data).length; index++) {
          // const element = Object.keys(data)[index];
          // console.log(data)
          // console.log(Object.entries(data)[index][1].userName)
          // if (!!currentParticipant.name) {
            
          // } else {
            if (Object.entries(data)[index][1].userName == currentParticipant?.name) {
              // console.log(!Object.entries(data)[index][1].isReady)
              setIsReadyCheck(Object.entries(data)[index][1].isReady)
            }
          // }
        // }
      }

      
    })

    // console.log(isReadyCheck)
  },[]);

  //Ready 클릭 이벤트
  const On_ready = () => {

    
    
    if (currentUser) {
      if (isReadyCheck) {
        setIsReadyCheck(false);
        // console.log(participantKey)
        // console.log(curentIndex - 1)
        // console.log(participantKey[curentIndex - 1])
        // console.log(participantKey.length)

        for (let index = 0; index < participantKey.length; index++) {
          const element = participantKey[index];
          // console.log(element)
          curUser.child(element).once('value', (snapshot) => { 
            const data = snapshot.val();
            // console.log(data.userName)
            // console.log()
            // console.log(currentParticipant.name)

            if (data.userName == currentParticipant.name) {
              // console.log("두 값이 일치합니다")
              // console.log("변한 값의 키 값 : ", element)
              curUser.child(element).update({
                isReady: false,
              });
            } else {
              // console.log("두 값이 일치하지 않습니다")
            }
          })
        }
      }
      else {
        setIsReadyCheck(true);
        // console.log(participantKey)
        // console.log(curentIndex - 1)
        // console.log(participantKey[curentIndex - 1])
        for (let index = 0; index < participantKey.length; index++) {
          const element = participantKey[index];
          // console.log(element)
          curUser.child(element).once('value', (snapshot) => { 
            const data = snapshot.val();
            // console.log(data.userName)
            // console.log()
            // console.log(currentParticipant.name)

            if (data.userName == currentParticipant?.name) {
              // console.log("두 값이 일치합니다()")
              // console.log("변한 값의 키 값 : ", element)
              curUser.child(element).update({
                isReady: true,
              });
            } else {
              // console.log("두 값이 일치하지 않습니다")
            }
          })
        }

        // curUser.child(participantKey[0]).update({
        //   isReady: true,
        // });
        // console.log("실행 3-2 : ", curUser)
      }
    }
    curUser.on('value', (snapshot) => {
      const data = snapshot.val();

      // console.log(Object.keys(data).length)
      // for (let index = 0; index < Object.keys(data).length; index++) {
      //   const element = Object.keys(data)[index];
      //   console.log(element)
      //   // curUser.child(element).on('value', (snapshot) => {
      //   //   const data_2 = snapshot.val();
      //   //   console.log(data_2)
      //   // })
      //   // curUser.child(element).update({
      //   //   'isReady': "false"
      //   // })
      // }
    })
  }

  // console.log(isReadyCheck)

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
