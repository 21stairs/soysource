import React from "react";
import "./resModal.css";

const resModal = (props) => {
  const { open, close } = props;
  return (
    <div className={open ? "bg" : ""}>
      <div>
        {open ? (
          <div className="area">
            <button className="close" onClick={close}>
              x
            </button>
            <p>게임 결과</p> <p>모달 내용</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default resModal;
