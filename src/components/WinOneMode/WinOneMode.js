
/*
1. 사용하지 않았던 문장 중 랜덤하게 문장이 주어진다.
2. 버튼을 눌러 문장을 녹음 한다. or 캠
3. 녹음본을 텍스트로 변환
4. **정답률을 넘었는지 and 문장 별로 지정된 제한 시간 내에 마쳤는지** 확인한다.
5. 4의 조건을 만족하면 해당 플레이어는 생존함. 만족 못 했다면 죽는다.
6. 몇 명이 생존했는지 센다.
7. 엔딩
    1. 몰살엔딩 : “정말 못하시네요” 메시지 출력 후 게임 종료
    2. 승리엔딩 : 승자 얼굴 클로즈 업 후 게임 종료 
    3. 다음 라운드 진행 : 모든 문장의 제한시간을 n초 줄인다. 단, 최소 시간 밑으로는 불가능. **go to 1*
*/



import React, { useState, useCallback } from "react";

const WinOneMode = () => {
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
    <>
      <button onClick={onRec ? onRecAudio : offRecAudio}>녹음</button>
      <button onClick={onSubmitAudioFile}>결과 확인</button>
    </>
  );
};

export default WinOneMode;