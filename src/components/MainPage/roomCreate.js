import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  return (
    <div>
      <div className="room">
        <Link to="/meet/">
          <button>방 만들기</button>
        </Link>
        <button onClick={test}>방 참가하기</button>
      </div>
    </div>
  );
};

export default RoomCreate;
