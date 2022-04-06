import React, { useRef, useState, useEffect } from "react";
import "./JoMode.css";
import JoModeData from "./JoModeData";
import "../btn.css";
import { connect } from "react-redux";
import useSpeechToText from "react-hook-speech-to-text";
import firepadRef, { db } from "../../server/firebase";
import { rId } from "../MainPage/roomCreate";
import ResModal from "./resModal";
import {
  setMainStream,
  addParticipant,
  setUser,
  removeParticipant,
  updateParticipant,
} from "../../store/actioncreator";

/*
1. 문장이 주어진다.
2. 버튼을 눌러 문장을 녹음 한다. wav파일로만
3. 녹음본을 텍스트로 변환해서 체크
4. 정답률을 넘었는지 체크, 타이머는 시작버튼을 누르고부터 돌고, 종료 버튼 클릭시 타이머도 종료. (프론트에서 처리해주는게 좋을듯, 시각적으로 보이면 좋을듯)
5. 걸린 시간 체크
6. 정답률을 넘긴것중 시간 순으로 순위를 매김.
7. 3, 5, 7 라운드 수 지정해서 누적 시간을 매겨 순위 지정.
*/

let isbegin = false;

const JoMode = (props) => {
  var roomRef = useRef(); // 참가자가 참가한 방의 위치
  const countRef = useRef(null);
  const [Count, setCount] = useState(0); //타이머 결과 값
  const [Problem, setProblem] = useState("시작"); //문제
  const [accuracy, setAccuracy] = useState("");
  const [currentSentence, setCurrentSentence] = useState("");
  const [isFail, setIsFail] = useState("");
  const [speakedSentence, setSpeakedSentence] = useState("");
  const [time, setTime] = useState("");
  const [host, setHost] = useState(false);
  const [gameState, setGameState] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const order = useRef([]);
  const inOrder = useRef();
  const [isOrder, setIsOrder] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const res = useRef();
  const [isRecording, setIsRecording] = useState(null);
  const round = useRef(0);
  const [maxRound, setMaxRound] = useState(-1);

  useEffect(async () => {
    initGame();
    if (!isbegin) {
      isStart();
    }
  }, []);
  useEffect(() => {
    if (gameState === "inGame") {
      getOrder();
      setIsShow(true);
      isbegin = true;
    }
  }, [gameState, accuracy]);
  useEffect(() => {
    addListeners();
  }, [Problem, accuracy, isFail]);

  function askMaxRound(){
    var _v = prompt("최대 라운드 설정","3")
    var _num_v = parseInt(_v)
    setMaxRound(_num_v) 
    return _num_v
  }

  /**
   * [게임 초기화]
   * 1. Mode 를 '조준영모드' 으로 설정
   * 2. 참가자라면, 참가한 방의 위치를 설정
   */
  function initGame() {
    roomRef.current = rId ? db.database().ref(rId) : firepadRef;
    roomRef.current
      .child("state")
      .get()
      .then((snapshot) => {
        // 방 처음 만들때만 실행됨.
        if (!snapshot.exists()) {
          console.log("방 DB 초기화!");
          roomRef.current.child("state").set("wait");
          roomRef.current.child("gameMode").set("jo");
          roomRef.current.child("currentSentence").set("NO_CURRENT_SENTENCE");
          roomRef.current.child("speakedSentence").set("NO_SPEAK_SENTENCE");
          roomRef.current.child("time").set("NO_TIME");
          roomRef.current.child("accuracy").set("NO_ACCURACY");
          roomRef.current.child("isFail").set("NO_IS_FAIL");
          roomRef.current.child("turn").set(0);
          roomRef.current.child("ranking").set("");
          roomRef.current.child("round").set(0);
          roomRef.current.child("maxRound").set(askMaxRound());
          roomRef.current
            .child("participants")
            .child(Object.keys(props.currentUser)[0])
            .child("resultSum")
            .set(0);
        }
      })
      .catch((error) => {
        console.log("에러 : ", error);
      });
  }

  /**
   * [리스너 달아주기]
   * 1. html 엘리먼트 ID로 가져오기(ID 이름은 DB랑 같음)
   * 2. 값 변할때, 값 가져오기
   * 3. 가져온 값으로 텍스트 변경
   * ※ 현재 리스너를 동일한 곳에 계속 달아주고 있어서 낭비긴 함. 하지만 그로인한 버그는 없음.
   */
  function addListeners() {
    roomRef.current.child("accuracy").on("value", (snap) => {
      setAccuracy(snap.val());
    });
    roomRef.current.child("currentSentence").on("value", (snap) => {
      setCurrentSentence(snap.val());
    });
    roomRef.current.child("isFail").on("value", (snap) => {
      setIsFail(snap.val());
    });
    roomRef.current.child("speakedSentence").on("value", (snap) => {
      setSpeakedSentence(snap.val());
    });
    roomRef.current.child("time").on("value", (snap) => {
      setTime(snap.val());
    });
    roomRef.current.child("state").on("value", (snap) => {
      setGameState(snap.val());
    });
  }

  /**
   * [순서 만들기]
   * 1. 방 ref를 참고하여, participants들을 리스트에 담는다.
   * 2. 리스트를 frdb에 넣는다.
   * 3. 각 유저에게 리스트에 해당하는 인덱스를 부여한다.
   */
  function makeOrder() {
    roomRef.current
      .child("state")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          if ("wait" === snapshot.val()) {
            // state가 wait일때만 섞음.
            var list = [];
            for (let i = 0; i < Object.keys(props.participants).length; i++) {
              list.push(Object.keys(props.participants)[i]);
            }
            list.sort(() => Math.random() - 0.5);
            roomRef.current.child("order").set(list);
          }
        }
      })
      .catch((error) => {
        console.log("에러 : ", error);
      });
  }

  /**
   * [점수 계산]
   */
  function sendScoreToDB(_time) {
    var _myName = props.participants[Object.keys(props.currentUser)[0]].name;
    var scoreRef = roomRef.current.child("ranking").child(_myName);
    if (_time === "실패") {
      scoreRef.get().then((snapshot) => {
        if (!snapshot.exists()) {
          scoreRef.set(100);
        } else {
          console.log("유야호");
          var _originalScore = snapshot.val();
          var _newScore = _originalScore + 100;
          scoreRef.set(_newScore);
        }
      });
    } else {
      scoreRef.get().then((snapshot) => {
        if (!snapshot.exists()) {
          console.log("무야호");
          scoreRef.set(_time);
        } else {
          console.log("유야호");
          var _originalScore = snapshot.val();
          var _newScore = _originalScore + _time;
          scoreRef.set(_newScore);
        }
      });
    }
  }

  const isStart = async () => {
    var temp = "temp";
    await roomRef.current
      .child("participants")
      .get()
      .then((snapshot) => {
        return (temp = snapshot);
      });

    if (temp.val()) {
      const getUid = Object.keys(temp.val())[0];
      if (props.currentUser) {
        const userId = Object.keys(props.currentUser)[0];
        if (getUid == userId) {
          setHost(true);
        }
      }
    }
  };

  const getOrder = async () => {
    console.log("순서 받기");
    const userId = Object.keys(props.currentUser)[0];
    await roomRef.current
      .child("round")
      .get()
      .then((snap) => {
        round.current = snap.val();
      });
    console.log("inOrder 체크1", inOrder.current);
    await roomRef.current
      .child("turn")
      .get()
      .then((snap) => {
        inOrder.current = snap.val();
      });
    console.log("inOrder 체크2", inOrder.current);
    //종료 조건을 maxRound로 변경
    if (maxRound.current === round.current) {
      await roomRef.current.update({
        state: "wait",
      });
      await roomRef.current.update({
        turn: 0,
      });
      await roomRef.current.update({
        round: 0,
      });
      round.current = 0;
      //여기서 전부 초기화 갈기자
      setIsOrder(false);
      setIsShow(false);
      isbegin = false;
      console.log(inOrder.current);
      isStart();
      openModal();
      return;
    }
    await roomRef.current
      .child("order")
      .get()
      .then((snapshot) => {
        for (let i = 0; i < Object.keys(snapshot.val()).length; i++) {
          order.current[i] = snapshot.val()[i];
        }
      });
    for (let i = 0; i < Object.keys(props.participants).length; i++) {
      if (
        Object.keys(props.participants)[i] === order.current[inOrder.current]
      ) {
        setOrderName(
          props.participants[Object.keys(props.participants)[i]].name
        );
        setIsOrder(true);
        if (userId === order.current[inOrder.current]) {
          setIsUser(true);
        } else {
          setIsUser(false);
        }
        break;
      }
    }
  };
  const startGame = () => {
    isbegin = true;
    setHost(false);
    setIsShow(true);
    makeOrder();
    roomRef.current
      .child("state")
      .get()
      .then((snapshot) => {
        if ("wait" === snapshot.val()) {
          roomRef.current.child("state").set("inGame");
        }
      })
      .catch((error) => {
        console.log("에러 : ", error);
      });
  };

  const startHandler = () => {
    onFlip(); //중복 클릭 방지
    startSpeechToText();

    setCount(0);
    clearInterval(countRef.current);
    countRef.current = setInterval(() => setCount((c) => c + 1), 100); // 주구장창
    SetProblem();
    setIsRecording(true);
  };

  const stopHandler = async () => {
    onFlip(); //중복 클릭 방지
    stopSpeechToText();
    clearInterval(countRef.current);
    countRef.current = null;
    setProblem((c) => (c = <h1>{Count}ms</h1>));
    roomRef.current.child("time").set(Count);
    if (interimResult != null)
      roomRef.current.child("speakedSentence").set(interimResult);
    SetRate(Problem);
    SetIncrease();
    setIsRecording(false);
  };

  const SetIncrease = async () => {
    const moduler = Object.keys(props.participants).length;
    if (inOrder.current + 1 === moduler) {
      await roomRef.current.update({
        round: round.current + 1,
      });
    }
    await roomRef.current.update({
      turn: (inOrder.current + 1) % moduler,
    });
    inOrder.current = (inOrder.current + 1) % moduler;
  };

  const openModal = async () => {
    //결과 db에서 받아와서 사용하자.
    const restemp = await roomRef.current
      .child("ranking")
      .get()
      .then((snap) => {
        return snap.val();
      });

    console.log(restemp);

    res.current = restemp;

    console.log(res.current);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isModalOpen === true) return setIsModalOpen(false);
  };

  const SetProblem = () => {
    var rand = Math.floor(Math.random() * 33);
    const sentence = JoModeData.JoModeData[rand];
    setProblem((c) => (c = sentence));
    roomRef.current.child("currentSentence").set(sentence);
  };

  const SetRate = async (problem) => {
    var avg;
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
      avg = ((same / total) * 100).toFixed(2);
    } else {
      avg = 0;
    }

    roomRef.current.child("accuracy").set(avg);
    setAccuracy(avg);

    if (avg > 70) {
      roomRef.current.child("isFail").set("성공");
      setIsFail("성공");
      sendScoreToDB(Count);
    } else {
      roomRef.current.child("isFail").set("실패");
      setIsFail("실패");
      sendScoreToDB("실패");
    }
  };

  //Start와 Stop 중복 클릭 방지를 위한 함수
  const [flipped, setFlipped] = React.useState(true);
  const onFlip = () => {
    setFlipped((current) => !current);
  };

  /*녹음 ---------------------------------------------------- */
  const { error, interimResult, startSpeechToText, stopSpeechToText } =
    useSpeechToText({
      continuous: true,
      useLegacyResults: false,
    });
  if (error) return <p>Chrome에서 실행 부탁드립니다!!!!🤷 </p>;
  return (
    <div className="gameboy">
      {isModalOpen && (
        <ResModal open={isModalOpen} close={closeModal} ref={res} />
      )}
      <p id="gameState">gameState : {gameState}</p>
      {/* 게임중, 대기중 */}
      <div className="top">
        <div className="onoff">
          <span className="arrow-left"></span>
          <span className="onoff-label">on/off</span>
          <span className="arrow-right"></span>
        </div>
      </div>
      <div className="gameboy-component">
        <div className="screen">
          {isOrder && <p>{orderName}님 의 차례 입니다!!!!</p>}
          {isOrder && <p>{round.current + 1} 라운드</p>}
          {/* 대기중일땐 안보이고 게임시작하면 보이게끔 */}
          {isRecording ? (
            <div className="screen__item"> {currentSentence}</div>
          ) : (
            <div className="screen__item">
              <p>정확도 : {accuracy}%</p>
              <p>{time / 10}초</p>
              <p>{isFail}</p>
              <p>{interimResult}</p>
              {/* {speakedSentence} */}
            </div>
          )}
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
              {isUser ? (
                <div className="button-start" onClick={startHandler}></div>
              ) : (
                <div className="button-start"></div>
              )}
              {/* 내차례가 아니면 안눌러지게끔 */}
              {isUser ? (
                <div className="button-end" onClick={stopHandler}></div>
              ) : (
                <div className="button-end"></div>
              )}
            </div>
            <div className="selections">
              <div className="select"></div>
              {host ? (
                !isOrder && <div className="start" onClick={startGame}></div>
              ) : (
                <div className="start"></div>
              )}
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

// 넣은 정보가 props에 담김
const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    currentUser: state.currentUser,
    participants: state.participants,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    addParticipant: (user) => dispatch(addParticipant(user)),
    setUser: (user) => dispatch(setUser(user)),
    removeParticipant: (userId) => dispatch(removeParticipant(userId)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JoMode);

/**
 * 지금 해야 되는 것.
 * 1. 방장이 '게임시작' 을 눌럿
 */
