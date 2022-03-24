import {useRef, useState } from "react";
import "./JoMode.css";

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
  const [Count, setCount] = useState(0);
  const startHandler = () => {
    setCount(0);
    clearInterval(countRef.current);
    countRef.current = setInterval(() => setCount((c) => c + 1), 100);
  };

  const stopHandler = () => {
    clearInterval(countRef.current);
    countRef.current = null; 
  };

  return (
    <div>
      <div>
        <h1 className='problem'>경찰청창살쇠창살</h1>
        <button onClick={startHandler}>시작</button>
        <button onClick={stopHandler}>종료</button>
        <h1>결과는 : { Count }초 입니다!!!</h1>
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