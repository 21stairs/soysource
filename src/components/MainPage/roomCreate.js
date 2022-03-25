import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./roomCreate.scss";
import firepadRef, { firebase } from "../../server/firebase"

const RoomCreate = () => {
  const id = useRef();
  const navigate = useNavigate();
  const test = () => {
    id.current = prompt("방 번호 입력");
    console.log(id.current);
    navigate("/meet/", {
      state: {
        number: id.current,
      },
    });
  };

  return (
    <div>
      <div className="room">
        <Link to="/meet/">
          <button>방 만들기</button>
        </Link>

        <Link to="/meet/">
          <button onClick={insertRoomToRTDB}>방 참가하기</button>
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
