import React, { forwardRef } from "react";
import "./resModal.css";
import '@fortawesome/fontawesome-free/css/all.css';
const resModal = (props, ref) => {
  console.log(Object.keys(ref.current)[0]);
  console.log(Object.values(ref.current)[0]);

  var ressort = [];
  for (let i = 0; i < Object.keys(ref.current).length; i++) {
    let name = Object.keys(ref.current)[i];
    ressort.push({ [name]: Object.values(ref.current)[i] });
  }
  const first = ressort.shift();
  console.log(first)
  ressort.sort((a, b) => {
    console.log(Object.keys(a)[0]);
    console.log(Object.values(a)[0]);
    console.log('----')
    
    return Object.values(a)[0] - Object.values(b)[0];
  });

  const { open, close } = props;
  return (
    <div className={open ? "bg" : ""}>
      <div>
        {open ? (

          <div class="card1 one">
            <div class="header">
        
              <i class="arrow fas fa-chevron-left hi" onClick={close}></i>
              <h3 class="title">게임 결과</h3>
              <div></div>
            </div>
        
            <div class="profile">

              <div class="person first">
                <div class="num">1</div>
                <i class="fas fa-caret-up"></i>
                <img src="https://previews.123rf.com/images/vitamind/vitamind1307/vitamind130700015/20752709-금메달-아이콘.jpg" alt="" class="photo" />
                <p class="link">{Object.keys(first)}</p>
                <p class="points">{Object.values(first)}</p>
              </div>
          </div>
          {ressort.map((res, index) => (
  
            
            <div class="rest">
            <div class="others flex">
              <div class="rank">
                <i class="fas fa-caret-up"></i>
                <p class="num">{index+2}</p>
              </div>
              <div class="info flex">
                <br></br>
                <div class="link">{Object.keys(res)[0]}</div>
                <div class="points">{Object.values(res)[0]}</div>
              </div>
            </div>
          </div>
          ))}

          
        </div>
        ) : null}
      </div>
    </div>
  );
};

export default forwardRef(resModal);
