import React, { useEffect, useRef } from "react";
import "./Participants.css";
import { connect } from "react-redux";
import { Participant } from "./Participant/Participant.component";
import { db } from '../../server/firebase';

const Participants = (props) => {
  const videoRef = useRef(null);
  let participantKey = Object.keys(props.participants);
 
  let Ready_isCheck = "";
  // let Ready_isCheck = Object.keys(props.participantKey);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
      videoRef.current.muted = true;
    }
  }, [props.currentUser, props.stream]);

  const currentUser = props.currentUser
    ? Object.values(props.currentUser)[0]
    : null;

  let gridCol =
    participantKey.length === 1 ? 1 : participantKey.length <= 3 ? 2 : 3;
  const gridColSize = participantKey.length <= 3 ? 1 : 2;
  let gridRowSize =
    participantKey.length <= 3
      ? participantKey.length
      : Math.ceil(participantKey.length / 2);

  const screenPresenter = participantKey.find((element) => {
    const currentParticipant = props.participants[element];
    return currentParticipant.screen;
  });

  if (screenPresenter) {
    gridCol = 1;
    gridRowSize = 2;
  }
  const participants = participantKey.map((element, index) => {
    const currentParticipant = props.participants[element];
    const isCurrentUser = currentParticipant.currentUser;
    if (isCurrentUser) {
      return null;
    }
    const pc = currentParticipant.peerConnection;
    const remoteStream = new MediaStream();
    let curentIndex = index;
    if (pc) {
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        const videElement = document.getElementById(
          `participantVideo${curentIndex}`
          );
          if (videElement) videElement.srcObject = remoteStream;
        };
       

    return (
      <Participant
        key={curentIndex}
        currentParticipant={currentParticipant}
        participantKey={participantKey}
        Ready_isCheck= {Ready_isCheck}
        curentIndex={curentIndex}
        hideVideo={screenPresenter && screenPresenter !== element}
        showAvatar={
          !currentParticipant.video &&
          !currentParticipant.screen &&
          currentParticipant.name
        }
      />
    );
  });
  return (
    <div
      style={{ 
        "--grid-size": gridCol,
        "--grid-col-size": gridColSize,
        "--grid-row-size": gridRowSize,
      }}
      className={`participants`}
    >
      <Participant
        currentParticipant={currentUser}
        participantKey={participantKey}
        Ready_isCheck= {Ready_isCheck}
        curentIndex={participantKey.length}
        hideVideo={screenPresenter && !currentUser.screen}
        videoRef={videoRef}
        showAvatar={currentUser && !currentUser.video && !currentUser.screen}
        currentUser={true}
    />
      {participants}
      
      
    
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    participants: state.participants,
    currentUser: state.currentUser,
    stream: state.mainStream,
  };
};

export default connect(mapStateToProps)(Participants);
