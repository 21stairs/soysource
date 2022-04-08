# 간장공장공장장 👋

<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"/><img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=FFF" alt="Firebase" style="zoom:100%;" /><img src="https://img.shields.io/badge/WEBRTC-57BCAD?style=for-the-badge&logo=WEBRTC&logoColor=FFF" alt="WebRTC" />

[![GitLab](https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white)](https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white)[![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)[![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)[![Discord](https://img.shields.io/badge/Discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://img.shields.io/badge/Discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)[![img](https://img.shields.io/badge/Mattermost-blue)](https://img.shields.io/badge/Mattermost-blue)[![img](https://img.shields.io/badge/Webex-darkblue)](https://img.shields.io/badge/Webex-darkblue)

-----------

<img src=".\public\작은간장공장공장장.png" alt="간장공장공장장.png" style="zoom:100%;" />





- ### 🤔 프로젝트 배경 및 의도

  - 🧉 [간장공장공장장 Homepage](https://j6d203.p.ssafy.io)
  - **<span style="color:red">대학 친구 없어요...</span>**
  - 코로나의 확산으로 많은 교육 및 모임이 비대면으로 실시되고 있습니다. 많은 사람들이 비대면 환경에서 함께 수업을 듣는 친구들과 친해지기 **어려움**을 느끼고 있습니다. 코로나 19의 장기화로 생긴 우울감, 무기력증이라는 의미의 [`코로나 블루`](https://terms.naver.com/entry.naver?docId=5931743&cid=43667&categoryId=43667)라는 단어 또한 생길 정도로 사회적으로 대두되고 있고, 실제 코로나 이후 우울증 관련 검색어가 유의하게 증가되었다는 연구논문도 발표됐습니다.
  - 저희 팀 또한 SSAFY에서 비대면 수업을 듣고 있으며 친구들과 친해지지 못한 아쉬움을 가지고 있었습니다.
  - 이에 웹 화상 게임을 통해 자연스럽게 다가가고 적응할 수 있도록 돕는 프로그램을 제작하고자 했습니다.
  



- ### 📅 프로젝트 기간

  - 2022.02.28 ~ 2022.04.08




- ### 🚅 핵심 기능 💨

  - Web RTC
    - 비대면 환경에서 같이 있는듯한 화상 기반의 플랫폼을 구현합니다.
  - Speech To Text
    - 마이크로 입력된 음성을 텍스트로 바꿔 잰말놀이의 인식률을 체크합니다.




- ### 🛠 기술 스택

  ###### [ Frontend, WebRTC ]

  - React
  - Redux
  - Sass
  - Firebase

  ###### [ devOps ]

  - Jenkins
  - AWS EC2
  - Nginx

  ###### [ AI (음성인식🔊) ]

  - ~~kospeech~~  
    - End to End 한국어 Speech To Text 오픈소스
    - 1000시간의 음성데이터로 19epoch(약 200시간) 학습 후 CER 0.22로 목표했던 인식률이 나오지 않아 `파기`
    - [학습 과정](https://2106.notion.site/kospeech-473ecc9d75554c31af6190208c8842e4)
  - react-hook-speech-to-text
  
  ###### [ team cooperation ]
  
  - GitLab
  - Jira
  - Notion





- ### 🗂 시스템 아키텍쳐

  ![아키텍처](.\public\아키텍처.png)



- ### ⭐ 주요 기능

  - #### 1. 방 생성하기

    - 닉네임, 게임 라운드 설정하기
    
    ![roomcreate](public\roomcreate.gif)
  	
  	- 링크 복사
  	
    ![linkpaste](.\public\linkpaste.gif)
  
  
  - #### 2. 게임 모드 선택
  
    - **조준영 모드**  (현재 디폴트)
  
      ```
      * 잰말놀이 걸린 시간 체크
      
      * 정답시 +소요 시간(초), 오답시 +100초
      
      * 모든 라운드가 진행된 후 누적 시간을 합하여 순위 지정
      ```
  
    - **윤승일 모드** (개발 전)
  
      ```
      * 문장 별로 지정된 제한시간 내에 발음해야하며 인식률 70% 이상인지 체크
      
      * 위의 조건을 만족하면 해당 플레이어는 생존, 그렇지 않은 경우 탈락
      
      * 인원수 체크
      
      	1명 이하 : 게임종료
      
      	2명이상 : 다음라운드 진행, 모든 문장의 제한시간을 n초 줄인다 
      		(단, 최소시간 밑으로는 불가능)
      ```
  
  - #### 3. 게임 시작
  
    - 모든 참가자 준비 완료되면 호스트가 게임 시작을 합니다.
  
      ![ready](.\public\ready.gif)
  
  - #### 4. 게임 진행
  
    - 플레이어 순서대로 게임보이 하단에 닉네임이 보입니다.
  
    - 시작 버튼을 누르면 타이머와 음성인식이 시작됨. 문장이 끝난 후 종료 버튼을 누르면 소요 시간과 음성인식 인식률을 반환합니다.
  
      ![gameboyready](.\public\gameboyready.gif)
  
  - #### 5. 결과 화면
  
    - 모든 라운드가 진행된 후 소요시간을 합하여 랭킹을 반환한다
    
      ![result](.\public\result.png)
  
  
  
- ### 👨‍👩‍👦‍👦 팀원 소개
  ```
  👦 최성석 : 팀장 / WebRTC
  
  😮 윤승일 : Frontend
  
  😎 이승관 : Frontend
  
  🧔 임기태 : Frontend
  
  🧑 정경훈 : WebRTC
  
  🤔 조준영 : AI
  ```



- ### ☎ 문의

  tjdtjr234@gmail.com

