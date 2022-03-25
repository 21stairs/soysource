import React, {useRef, useState, useCallback } from "react";
import "./JoMode.css";
import JoModeData from './JoModeData';
import "C:/Users/gitae/git/S06P22D203/src/components/button.css";
/*
1. 문장이 주어진다.
2. 버튼을 눌러 문장을 녹음 한다. wav파일로만
3. 녹음본을 텍스트로 변환해서 체크
4. 정답률을 넘었는지 체크, 타이머는 시작버튼을 누르고부터 돌고, 종료 버튼 클릭시 타이머도 종료. (프론트에서 처리해주는게 좋을듯, 시각적으로 보이면 좋을듯)
5. 걸린 시간 체크
6. 정답률을 넘긴것중 시간 순으로 순위를 매김.
7. 3, 5, 7 라운드 수 지정해서 누적 시간을 매겨 순위 지정.
*/
const JoMode=()=> {
  const countRef = useRef(null);
  const [Count, setCount] = useState(0); //타이머 결과 값
  const [Problem, setProblem] = useState("시작"); //문제 
  const [Rate, setRate] = useState(0);
  const startHandler = () => {
    onRecAudio(); //녹음 시작
    setCount(0);
    clearInterval(countRef.current);
    countRef.current = setInterval(() => setCount((c) => c + 1), 100);
    SetProblem();
  };

  const stopHandler = () => {
    offRecAudio(); //녹음 종료
    //onSubmitAudioFile();//녹음된 URL 만들고 console 출력
    clearInterval(countRef.current);
    countRef.current = null;
    setProblem((c) => c = <h1>{Count}ms</h1>);
    
  };

  const SetProblem = () => {
    var rand = Math.floor(Math.random() * 33);
    setProblem((c) => c = JoModeData.JoModeData[rand]);
  };
  
  /*녹음 ---------------------------------------------------- */
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();

  const onRecAudio = () => {
    // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream) {
      // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    // 마이크 사용 권한 획득
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);

      analyser.onaudioprocess = function (e) {
        // 3분(180초) 지나면 자동으로 음성 저장 및 녹음 중지
        if (e.playbackTime > 180) {
          stream.getAudioTracks().forEach(function (track) {
            track.stop();
          });
          mediaRecorder.stop();
          // 메서드가 호출 된 노드 연결 해제
          analyser.disconnect();
          audioCtx.createMediaStreamSource(stream).disconnect();

          mediaRecorder.ondataavailable = function (e) {
            setAudioUrl(e.data);
            setOnRec(true);
          };
        } else {
          setOnRec(false);
        }
      };
    });
  };

  // 사용자가 음성 녹음을 중지했을 때
  const offRecAudio = () => {
    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    media.ondataavailable = function (e) {
      setAudioUrl(e.data);
      setOnRec(true);
    };

    // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    // 미디어 캡처 중지
    media.stop();
    // 메서드가 호출 된 노드 연결 해제
    analyser.disconnect();
    source.disconnect();
  };

  const onSubmitAudioFile = useCallback(() => {
    if (audioUrl) {
      console.log(URL.createObjectURL(audioUrl)); // 출력된 링크에서 녹음된 오디오 확인 가능
    }

    // File 생성자를 사용해 파일로 변환
    const sound = new File([audioUrl], "soundBlob", { lastModified: new Date().getTime(), type: "audio" });
    console.log(sound); // File 정보 출력
  }, [audioUrl]);

  return (
    <div>
      <div>
        <button className="w-btn w-btn-blue" type="button" onClick={startHandler} >시작</button>
        <button className="w-btn w-btn-gra1 w-btn-gra-anim" type="button" onClick={stopHandler}>종료</button>
        <button onClick={onSubmitAudioFile}>제출</button>
        <h1 className='problem'>{Problem}</h1>
        <h1 className='rate'>인식률 : {Rate}</h1>
      </div>

      <div className='rank'>
        <h1>1등 : 누구 몇초</h1>
        <h1>2등 : 누구 몇초</h1>
        <h1>3등 : 누구 몇초</h1>
      </div>
    </div>
  );
}

export default JoMode;