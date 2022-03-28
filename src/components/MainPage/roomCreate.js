import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./roomCreate.scss";
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
  const insertRoomToRTDB = () => {
    navigate("/meet/");
  };
  return (
      <div class="room">
        <div class="left" onClick={insertRoomToRTDB}>
          <h1>방 생성하기</h1>
        </div>
        <div class="right" onClick={test}>
          <h1>방 입장하기</h1>
        </div>
      </div>
  );
};

export default RoomCreate;
