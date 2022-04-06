import React, { forwardRef } from "react";
import "./resModal.css";

const resModal = (props, ref) => {
  console.log(Object.keys(ref.current)[0]);
  console.log(Object.values(ref.current)[0]);

  var ressort = [];
  for (let i = 0; i < Object.keys(ref.current).length; i++) {
    let name = Object.keys(ref.current)[i];
    ressort.push({ [name]: Object.values(ref.current)[i] });
  }

  ressort.sort((a, b) => {
    console.log(Object.keys(a)[0]);
    console.log(Object.values(a)[0]);
    return Object.values(a)[0] - Object.values(b)[0];
  });

  const { open, close } = props;
  return (
    <div className={open ? "bg" : ""}>
      <div>
        {open ? (
          <div className="area">
            <button className="close" onClick={close}>
              x
            </button>
            <p>게임 결과</p>
            <br />
            {ressort.map((res) => (
              <p>
                이름 : {Object.keys(res)[0]} 시간 : {Object.values(res)[0]}
              </p>
            ))}
            <p></p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default forwardRef(resModal);
