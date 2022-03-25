import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./roomCreate.scss";
import firepadRef, { getMetting } from "../../server/firebase";

const RoomCreate = () => {
  const id = useRef();
  const navigate = useNavigate();
  const test = () => {
    id.current = prompt("방 번호 입력");
    console.log(id.current);
    navigate("/meet/");
    getMetting(id.current);

    // navigate("/meet/", {
    //   state: {
    //     number: id.current,
    //   },
    // });
  };
  const insertRoomToRTDB = () => {
    // const roomenter = prompt("방 이름 입력");
    // const roomRef = firepadRef.child("Room");
    // roomRef.set(roomenter);
    navigate("/meet/");
    getMetting();
  };

  return (
    <div>
      <div className="room">
        <button onClick={insertRoomToRTDB}>방 만들기</button>

        <button onClick={test}>방 참가하기</button>
      </div>
    </div>
  );
};

export default RoomCreate;
