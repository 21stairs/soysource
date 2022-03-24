import React from "react";
import { Link } from "react-router-dom";
import "./roomCreate.scss";
import firepadRef, { firebase } from "../../server/firebase"

const roomCreate = () => {
  return (
    <div>
      <div className="room">
        <Link to="/meet/">
          <button>방 만들기</button>
        </Link>

        <Link to="/meet/">
          <button onClick={test}>방 참가하기</button>
        </Link>
      </div>
    </div>
  );
};

const insertRoomToRTDB = () => {
  const roomenter = prompt("방 이름 입력");
  const roomRef = firepadRef.child("Room")
  roomRef.set(roomenter)
};

export default roomCreate;
