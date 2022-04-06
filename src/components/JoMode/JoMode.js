import React, { useRef, useState, useEffect } from "react";
import "./JoMode.css";
import JoModeData from "./JoModeData";
import "../btn.css";
import useSpeechToText from "react-hook-speech-to-text";
import firepadRef, { db} from "../../server/firebase";
import { rId } from "../MainPage/roomCreate";

/*
1. 문장이 주어진다.
2. 버튼을 눌러 문장을 녹음 한다. wav파일로만
3. 녹음본을 텍스트로 변환해서 체크
4. 정답률을 넘었는지 체크, 타이머는 시작버튼을 누르고부터 돌고, 종료 버튼 클릭시 타이머도 종료. (프론트에서 처리해주는게 좋을듯, 시각적으로 보이면 좋을듯)
5. 걸린 시간 체크
6. 정답률을 넘긴것중 시간 순으로 순위를 매김.
7. 3, 5, 7 라운드 수 지정해서 누적 시간을 매겨 순위 지정.
*/
const JoMode = () => {
  var roomRef = useRef(); // 참가자가 참가한 방의 위치
  const countRef = useRef(null);
  const [Count, setCount] = useState(0); //타이머 결과 값
  const [Problem, setProblem] = useState("시작"); //문제
  const [accuracy, setAccuracy] = useState("");
  const [currentSentence, setCurrentSentence] = useState("");
  const [isFail, setIsFail] = useState("");
  const [speakedSentence, setSpeakedSentence] = useState("");
  const [time, setTime] = useState("");
  const [isRecording, setIsRecording] = useState(null)

  useEffect( () => {
    initGame();
    addListeners();
  }, []);

  /**
     * [게임 초기화]
     * 1. Mode 를 '조준영모드' 으로 설정
     * 2. 참가자라면, 참가한 방의 위치를 설정
     */
  function initGame() {
    // 이거 왜 3번 불리는지 질문
    console.log("-initGame-");

    if (rId) {
      // 방 참가하기로 드갔으면...
      roomRef.current = db.database().ref(rId);
    } else {
      roomRef.current = firepadRef;
    }
    console.log("roomRef : ", roomRef.current);
    roomRef.current.child("gameMode").set("Jo");
    roomRef.current.child("currentSentence").set("문제");
    roomRef.current.child("speakedSentence").set("");
    roomRef.current.child("time").set(0);
    roomRef.current.child("accuracy").set("Rate");
    roomRef.current.child("isFail").set("성공or실패");
  }

  /**
   * [리스너 달아주기]
   * 1. html 엘리먼트 ID로 가져오기(ID 이름은 DB랑 같음)
   * 2. 값 변할때, 값 가져오기
   * 3. 가져온 값으로 텍스트 변경
   */
  function addListeners() {
    roomRef.current.child("accuracy").on("value", (snap) => {
      setAccuracy(snap.val());
      console.log("accuracy : ", snap.val());
    });
    roomRef.current.child("currentSentence").on("value", (snap) => {
      setCurrentSentence(snap.val());
      console.log("currentSentence : ", snap.val());
    });
    roomRef.current.child("isFail").on("value", (snap) => {
      setIsFail(snap.val());
      console.log("isFail : ", snap.val());
    });
    roomRef.current.child("speakedSentence").on("value", (snap) => {
      setSpeakedSentence(snap.val());
      console.log("speakedSentence : ", snap.val());
    });
    roomRef.current.child("time").on("value", (snap) => {
      setTime(snap.val());
      console.log("time : ", snap.val());
    });
  }

  const startHandler = () => {
    console.log("(JoMode.js startHandler) roomRef : ", roomRef.current);
    onFlip(); //중복 클릭 방지
    startSpeechToText();
    setCount(0);
    clearInterval(countRef.current);
    countRef.current = setInterval(() => setCount((c) => c + 1), 100); // 주구장창
    SetProblem();
    setIsRecording(true)
  };

  const stopHandler = async() => {
    console.log("멈춰!");
    console.log("(JoMode.js stopHandler) roomRef : ", roomRef.current); // 왜 여기서 부르면 undefined 되는지?
    onFlip(); //중복 클릭 방지
    stopSpeechToText();
    clearInterval(countRef.current);
    countRef.current = null;
    setProblem((c) => (c = <h1>{Count}ms</h1>));
    roomRef.current.child("time").set(Count);
    if(interimResult!=null)
      roomRef.current.child("speakedSentence").set(interimResult);
    SetRate(Problem);
    setIsRecording(false)
  };

  const SetProblem = () => {
    console.log("(JoMode.js setProblem) roomRef : ", roomRef.current);
    var rand = Math.floor(Math.random() * 33);
    const sentence = JoModeData.JoModeData[rand];
    setProblem((c) => (c = sentence));
    roomRef.current.child("currentSentence").set(sentence);
  };

  const SetRate = (problem) => {
    console.log("(JoMode.js setRate) roomRef : ", roomRef.current);
    var recoderProblem = interimResult; //녹음된 문자

    if (recoderProblem !== undefined) {
      //공백 제거
      problem.replace(/ /g, "");
      recoderProblem.replace(/ /g, "");

      //비교를 위해 배열로 만들어 준다.
      const proArr = problem.split("");
      const recArr = recoderProblem.split("");
      var total = proArr.length;
      var same = 0;
      for (let i = 0; i < proArr.length; i++) {
        for (let j = 0; j < recArr.length; j++) {
          if (proArr[i] === recArr[j] && recArr[j] != null) {
            proArr[i] = null;
            recArr[j] = null;
            same++;
          }
        }
      }
      var avg = ((same / total) * 100).toFixed(2);

      roomRef.current.child("accuracy").set(avg)
        
      if (avg > 70) {
        roomRef.current.child("isFail").set("성공");
      } else {
        roomRef.current.child("isFail").set("실패");
      }
        
    
    } else {
      avg = 0;
      console.log(avg);
      roomRef.current.child("accuracy").set(avg)
      roomRef.current.child("isFail").set("실패");
    }
  };


  //Start와 Stop 중복 클릭 방지를 위한 함수
  const [flipped, setFlipped] = React.useState(true);
  const onFlip = () => {
    setFlipped((current) => !current);
  };



  /*녹음 ---------------------------------------------------- */
  const { error, interimResult,  startSpeechToText, stopSpeechToText } =
    useSpeechToText({
      continuous: true,
      useLegacyResults: false,
    });
  if (error) return <p>Chrome에서 실행 부탁드립니다!!!!🤷 </p>;
  return (
    <div className="gameboy">
      <div className="top">
        <div className="onoff">
          <span className="arrow-left"></span>
          <span className="onoff-label">on/off</span>
          <span className="arrow-right"></span>
        </div>
      </div>
      <div className="gameboy-component">
        <div className="screen">
          {isRecording ? 
          <div className="screen__item"> {currentSentence}</div>
          :
          <div className="screen__item">
            <p>정확도 : {accuracy}%</p>
            <p>{time/10}초</p>
            <p>{isFail}</p>
            <p>{interimResult}</p>
            {/* {speakedSentence} */}
          </div>
          }
        </div>
        <div className="controls">
          <div className="logo">
            <div className="logo-text"></div>
            <div className="logo-gameboy"></div>
          </div>
          <div className="inputs">
            <div className="dpad">
              <div className="left-key"></div>
              <div className="up-key"></div>
              <div className="right-key"></div>
              <div className="down-key"></div>
            </div>
            <div className="buttons">
              <div className="button-start" onClick={startHandler}></div>
              <div className="button-end" onClick={stopHandler}></div>
            </div>
            <div className="selections">
              <div className="select"></div>
              <div className="start"></div>
            </div>
          </div>
          <div className="speakers">
            <div className="grill"></div>
            <div className="grill"></div>
            <div className="grill"></div>
            <div className="grill"></div>
            <div className="grill"></div>
            <div className="grill"></div>
          </div>          
        </div>
      </div>
    </div>
  );
};

export default JoMode;