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

  console.log("===================== ", !!currentUser, " =====================")

  
  roomRef.child("isChangeReadyState");

  useEffect( async() => {

    // console.log("participantKey 값 : ", participantKey)

    // Who_ready()

    // console.log(participantKey)
    // console.log(curentIndex)
    // console.log(participantKey[curentIndex-1])
    // console.log(userRef)
    // console.log(userRef2)
    // console.log(currentParticipant)
    // console.log(currentUser)
    
    //파이어베이스의 값이 변한 경우 동작
    userRef.on('child_changed', async(data) => {
      // const data = snapshot.val();
      // console.log(data.val())
      const v = await data.val();
      console.log("child_changed의 data.val() : ",v);
      if (v == undefined && v == "" && res == "") {
        console.log("child_changed의 data.val() : ",v);
        console.log("값이 없거나 존재하지 않습니다");
      } else {
        setRes(v)
        console.log("child_changed의 data.val() 값을 res에 넣음 : ",res)
        console.log("child_changed의 data.val() : ",v);
        
      }      
      roomRef.child("isChangeReadyState").on('value',(data) => {
        console.log("roomRef의 data.val() : ",data.val())
        console.log("participantKey[curentIndex-1]의 값 : ",participantKey[curentIndex-1])
        if (data.val() == participantKey[curentIndex-1]) {
          console.log("res 값 : ",res);
          setIsReadyCheck(res)
          console.log("isReadyCheck 값 : ",isReadyCheck);
        }
      })
    });


    if (userRef.key == "undefined") {
      // console.log("값이 없거나 확인되지 않습니다")
    } else {
      // console.log("본인의 화면이 맞나요? : ", currentUser)
      if (!currentUser) {
        // console.log(curentIndex , participantKey[curentIndex-1])
        userRef.on('value', (snapshot) => {
          // console.log("본인의 화면이 아닌경우 : ", snapshot.val())
          const data = snapshot.val();
          // console.log("본인의 화면이 아닌경우 : ", data)
          // console.log("본인의 화면이 아닌경우 : ", data.isReady);
        });
      } else {
        // console.log(curentIndex, participantKey[curentIndex - 1])
        userRef.on('value', (snapshot) => {
          // console.log("본인의 화면인 경우 : ", snapshot.val())
          const data = snapshot.val();
          // console.log("본인의 화면인 경우 : ", data)
          // console.log("본인의 화면인 경우 : ", data.isReady);
        });
      }
    }

    // userRef2.on('child_changed', (data) => {
    //   console.log('변한 값의 위치' + data.key);
    //   setChanged_loc(data.key)
    // });

    // userRef.on('value', (snapshot) => {
    //   const data = snapshot.val().isReady;
    //   console.log(data)

    //   console.log(' 시작전 데이터 값 읽기' + data);
    //   if (data === "") {

    //     console.log('데이터 값 is null');
    //   }
    //   else {
    //     if (participantKey[curentIndex - 1] === changed_loc) {
    //       setIsReadyCheck(data)
    //     }
    //     console.log('데이터 값 읽기' + data);
    //   }
    // });


  });





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
        <img className="ready" onClick={On_ready} src={!isReadyCheck ? Ready : Not_ready} />
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
