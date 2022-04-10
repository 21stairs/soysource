import React from "react";
import { Link } from "react-router-dom";
import './Home.scss'

const test = () => {
  const CardData = [
    {
      header: 'Web RTC',
      content: '별도의 소프트웨어 없이 음성과 영상 미디어 등의 데이터를 브라우저 끼리 주고 받을 수 있게 만든 기술. 화상으로 서로간의 얼굴을 볼 수 있습니다.',
      src: './videocall.png',
      reverse: false
    },
    {
      header: 'Speech To Text',
      content: '음성을 텍스트로 변환하는 STT 기술로 잰말놀이는 구현했습니다.',
      src: './stt.png',
      reverse: true
    },
    {
      header: 'Ice Breaking',
      content: '그럼 이제 게임을 진행하면서 서로 가까워지세요!!',
      src: './talk.png',
      reverse: false
    }
  ]

  return (
    <div className="container">
      <div className='div-section'>
        <section className='section'>
          <p>ICE BREAKING GAME</p>
          <h1>숨막히는 분위기를</h1>
          <h1>깨부수자!</h1>
          <p>화상 음성인식 게임을 통해 즐겁게</p>
          <p>게임을 하며 사람들과 친해져 봅시다.</p>
          <div className="section--btn">
            <Link to="/room">
              <button>
                  시작하기
              </button>
            </Link>
            <Link to="/room">
              <button>게임실행</button>
            </Link>
          </div>
        </section>
        <section >
          <img src='./gosok.png' />
        </section>
      </div>

      <h2 className="tech">주요 기능</h2>
      {CardData.map((data, index) => {
        return (
          <article {...data} key={index}>
            <div>
              <h1>{data.header}</h1>
              <p>{data.content}</p>
            </div>
            <div>
              <img src={data.src}></img>
            </div>
          </article>
          )
      })}
      <footer>
        <p>Copyright D203</p>
      </footer>
    </div>
  );
};

export default test;
