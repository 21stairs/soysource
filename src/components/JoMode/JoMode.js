import React, { useRef, useState, useCallback } from "react";
import "./JoMode.css";
import JoModeData from './JoModeData';
import "../btn.css";
import ReactDOM from "react-dom"
import useSpeechToText from 'react-hook-speech-to-text';
import firepadRef from '../../server/firebase'
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
  const countRef = useRef(null);
  const [Count, setCount] = useState(0); //타이머 결과 값
  const [Problem, setProblem] = useState("시작"); //문제 
  const [Rate, setRate] = useState(0);
  const [List, setList] = useState([]);

  /**
   * [게임 초기화]
   * 1. Mode 를 '조준영모드' 으로 설정
   * 2. 
   */
  function initGame() { // 이거 왜 3번 불리는지 질문
    console.log("firepadRef : ", firepadRef.toString())
    firepadRef.child("gameMode").set("Jo")
  }

  initGame()

  const startHandler = () => {
    onFlip()//중복 클릭 방지
    startSpeechToText();
    setCount(0);
    clearInterval(countRef.current);
    countRef.current = setInterval(() => setCount((c) => c + 1), 100); // 주구장창
    SetProblem();
  };

  const stopHandler = () => {
    onFlip()//중복 클릭 방지
    stopSpeechToText();
    clearInterval(countRef.current);
    countRef.current = null;
    setProblem((c) => c = <h1>{Count}ms</h1>);
    firepadRef.child("time").set(Count)
    firepadRef.child("speakedSentence").set(interimResult)
    SetRate(Problem);
  };

  const SetProblem = () => {
    var rand = Math.floor(Math.random() * 33);
    const sentence = JoModeData.JoModeData[rand]
    setProblem((c) => c = sentence);
    firepadRef.child("currentSentence").set(sentence)
  };

  const SetRate = (problem) => {
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

      setRate((e) => e = avg);
    }
    else {
      avg = 0;
      console.log(avg);

      setRate((e) => e = avg);
    }

  }


  const RankList = useCallback(() => {
    setList((e) => [...e, Count]);
    console.log(List.length);
  }, [Count]);

  const SuccessOrFail = () => {
    if (Rate > 70) {
      return (
        <div>
          <h1>성공</h1>
        </div>
      );
    } else {
      return (
        <div>
          <h1>실패</h1>
        </div>
      );
    }

  }
  //Start와 Stop 중복 클릭 방지를 위한 함수
  const [flipped, setFlipped] = React.useState(true);
  const onFlip = () => {
    setFlipped((current) => !current);
  }

  //{
  //   results.map((result) => (
  //     <li key={result.timestamp}>{result.transcript}</li>
  //   ))
  // }

  /*녹음 ---------------------------------------------------- */
  const {
    error,
    interimResult,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false

  });
  if (error) return <p>Chrome에서 실행 부탁드립니다!!!!🤷‍</p>;
  return (
    <div>
      <div>
        <button className="w-btn w-btn-blue" type="button" onClick={startHandler} disabled={!flipped}>시작</button>
        <button className="w-btn w-btn-gra1 w-btn-gra-anim" type="button" onClick={stopHandler} disabled={flipped}>종료</button>
        <h1 className='problem'>{Problem}</h1>
        <h1 className='rate'>인식률 : {Rate}%</h1>
        <button onClick={RankList}>리스트에 추가</button>
      </div>

      <div>

        <h1>
          {interimResult}
        </h1>
      </div>

      <div className='rank'>
        <h1>
          <SuccessOrFail />
        </h1>
      </div>
    </div>
  );
}
// 힝홍행



export default JoMode;