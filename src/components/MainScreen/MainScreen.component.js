import React, { useRef, useEffect } from "react";
import MeetingFooter from "../MeetingFooter/MeetingFooter.component";
import Participants from "../Participants/Participants.component";
import "./MainScreen.css";
import "../btn.css"
import { connect } from "react-redux";
import { setMainStream, updateUser } from "../../store/actioncreator";
import JoMode from '../JoMode/JoMode';
import WinOneMode from '../WinOneMode/WinOneMode';

const MainScreen = (props) => {
  const participantRef = useRef(props.participants);

  const onMicClick = (micEnabled) => {
    if (props.stream) {
      props.stream.getAudioTracks()[0].enabled = micEnabled;
      props.updateUser({ audio: micEnabled });
    }
  };
  const onVideoClick = (videoEnabled) => {
    if (props.stream) {
      props.stream.getVideoTracks()[0].enabled = videoEnabled;
      props.updateUser({ video: videoEnabled });
    }
  };

  useEffect(() => {
    participantRef.current = props.participants;//과연
  }, [props.participants]);

  function Mode(Props) {
    if (Props.mode) {
      return <JoMode />
    } else {
      return <WinOneMode />
    }
  }

  return (
    <div className="wrapper">
      <div className='main-scream-total'>
        <div className="main-screen-left">
          <Participants />
        </div>
        <div className="main-screen-right">
          <Mode mode={true} />
        </div>
      </div>

      <div className="footer">
        <MeetingFooter
          onMicClick={onMicClick}
          onVideoClick={onVideoClick}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    participants: state.participants,
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    updateUser: (user) => dispatch(updateUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
