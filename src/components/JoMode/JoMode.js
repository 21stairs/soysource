import React, { useRef, useState, useCallback, useEffect } from "react";
import "./JoMode.css";
import JoModeData from "./JoModeData";
import "../btn.css";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import useSpeechToText from "react-hook-speech-to-text";
import firepadRef, { db, setFirepadRef } from "../../server/firebase";
import { rId } from "../MainPage/roomCreate";
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
const JoMode = (props) => {
  console.log("(JoMode.js) JoMode")
  var roomRef = useRef(); // 참가자가 참가한 방의 위치
  const countRef = useRef(null);
  const [Count, setCount] = useState(0); //타이머 결과 값
  const [Problem, setProblem] = useState("시작"); //문제
  const [Rate, setRate] = useState(0);
  const [List, setList] = useState([]);
  const [accuracy, setAccuracy] = useState("");
  const [currentSentence, setCurrentSentence] = useState("");
  const [isFail, setIsFail] = useState("");
  const [speakedSentence, setSpeakedSentence] = useState("");
  const [time, setTime] = useState("");

  console.log(props);
  if (props.currentUser) {
    const userId = Object.keys(props.currentUser)[0]; // 현재 클라이언트 사용자 DB에 저장된 고유 ID값
    console.log(
      "현재 클라이언트 사용자 이름 : ",
      props.currentUser[userId].name
    ); // 현재 클라이언트 사용자 이름(닉네임)
    //현재 세션 참가자 인원들은 participant에 저장되어 있음.
    for (let i = 0; i < Object.keys(props.participants).length; i++) {
      // 참가자 목록 뽑기
      console.log("참가자[", i, "] : ", Object.keys(props.participants)[i]);
    }
  }

  /**
   * [순서 만들기]
   * 1. 방 ref를 참고하여, participants들을 리스트에 담는다.
   * 2. 리스트를 frdb에 넣는다.
   * 3. 각 유저에게 리스트에 해당하는 인덱스를 부여한다.
   */
  function makeOrder() {
    var list = []
    for (let i = 0; i < Object.keys(props.participants).length; i++) {
      list.push(Object.keys(props.participants)[i])
    }
    roomRef.current.child("order").set(list);
  }

  useEffect(async () => {
    initGame();
    addListeners();
    makeOrder()
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
    roomRef.current.child("currentSentence").set("fff");
    roomRef.current.child("speakedSentence").set("fff");
    roomRef.current.child("time").set(0);
    roomRef.current.child("accuracy").set("fff");
    roomRef.current.child("isFail").set("fff");
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
  };

  const stopHandler = async () => {
    console.log("멈춰!");
    console.log("(JoMode.js stopHandler) roomRef : ", roomRef.current); // 왜 여기서 부르면 undefined 되는지?
    onFlip(); //중복 클릭 방지
    stopSpeechToText();
    clearInterval(countRef.current);
    countRef.current = null;
    setProblem((c) => (c = <h1>{Count}ms</h1>));
    roomRef.current.child("time").set(Count);
    roomRef.current.child("speakedSentence").set(interimResult);
    SetRate(Problem);
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

      setRate((e) => {
        e = avg;
        roomRef.current.child("accuracy").set(avg);

        if (avg > 70) {
          roomRef.current.child("isFail").set("성공");
        } else {
          roomRef.current.child("isFail").set("실패");
        }
      });
    } else {
      avg = 0;
      console.log(avg);

      setRate((e) => {
        e = avg;
        roomRef.current.child("accuracy").set(avg);

        if (avg > 70) {
          roomRef.current.child("isFail").set("성공");
        } else {
          roomRef.current.child("isFail").set("실패");
        }
      });
    }
  };

  const RankList = useCallback(() => {
    setList((e) => [...e, Count]);
    console.log(List.length);
  }, [Count]);

  //Start와 Stop 중복 클릭 방지를 위한 함수
  const [flipped, setFlipped] = React.useState(true);
  const onFlip = () => {
    setFlipped((current) => !current);
  };

  //{
  //   results.map((result) => (
  //     <li key={result.timestamp}>{result.transcript}</li>
  //   ))
  // }

  /*녹음 ---------------------------------------------------- */
  const { error, interimResult, results, startSpeechToText, stopSpeechToText } =
    useSpeechToText({
      continuous: true,
      useLegacyResults: false,
    });
  if (error) return <p>Chrome에서 실행 부탁드립니다!!!!🤷 </p>;
  return (
    <div>
      <div>
        <button
          className="w-btn w-btn-blue"
          type="button"
          onClick={startHandler}
          disabled={!flipped}
        >
          시작
        </button>
        <button
          className="w-btn w-btn-gra1 w-btn-gra-anim"
          type="button"
          onClick={stopHandler}
          disabled={flipped}
        >
          종료
        </button>
        <h1 className="problem" id="currentSentence">
          {Problem}
          <br />
          {currentSentence}
        </h1>
        <h1 className="rate" id="accuracy">
          인식률 : {Rate}%
          <br />
          accuracy : {accuracy}
        </h1>
        <button onClick={RankList}>리스트에 추가</button>
      </div>

      <div>
        <h1 className="speakedSentence" id="speakedSentence">
          {interimResult}
          {speakedSentence}
        </h1>
        <p>
          {time}
          <br />
          {isFail}
        </p>
      </div>

      <div className="rank" id="isFail">
        <h1>{isFail}</h1>
      </div>
    </div>
  );
};

// 넣은 정보가 props에 담김
const mapStateToProps = (state) => {
  console.log("(JoMode.js) mapStateToProps")
  return {
    stream: state.mainStream,
    currentUser: state.currentUser,
    participants: state.participants,
  };
};

const mapDispatchToProps = (dispatch) => {
  console.log("(JoMode.js) mapDispatchToProps")
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    addParticipant: (user) => dispatch(addParticipant(user)),
    setUser: (user) => dispatch(setUser(user)),
    removeParticipant: (userId) => dispatch(removeParticipant(userId)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JoMode);
