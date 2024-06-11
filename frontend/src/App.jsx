import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';
import Repeat from '@material-ui/icons/Repeat';
import Shuffle from '@material-ui/icons/Shuffle';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import "./App.css";
import React, { useEffect, useState, useRef } from 'react';
import { audios } from './audioData';

export default function App() {
  return <SoundBox />;
}

function SoundBox() {
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

  const handleNextSong = () => {
    setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % audios.length);
  };

  const handlePreviousSong = () => {
    setCurrentAudioIndex((prevIndex) => (prevIndex - 1 + audios.length) % audios.length);
  };

  const selectedAudio = audios[currentAudioIndex];
  const progressBarRef = useRef();
  const audioRef = useRef(null);

  return (
    <div className="sound-box">
      <Image image={selectedAudio.image} onNextClick={handleNextSong} onPreviousClick={handlePreviousSong} />
      <SongInformation name={selectedAudio.name} creator={selectedAudio.creator} />
      <CurrentTimeIndicator progressBarRef={progressBarRef}/>
      <MediaControls music={selectedAudio.music} audioRef={audioRef}/>
    </div>
  );
}

function Image({ image, onNextClick, onPreviousClick }) {
  return (
    <div className="skip-media">
      <SkipPreviousSong onPreviousClick={onPreviousClick} />
      <img className="music-image" src={image} alt="Album Cover" />
      <SkipNextSong onNextClick={onNextClick} />
    </div>
  );
}

function SkipNextSong({ onNextClick }) {
  return (
    <div className="skip-next" onClick={onNextClick}>
      <SkipNext style={{ fontSize: '5rem' }} />
    </div>
  );
}

function SkipPreviousSong({ onPreviousClick }) {
  return (
    <div className="skip-previous" onClick={onPreviousClick}>
      <SkipPrevious style={{ fontSize: '5rem' }} />
    </div>
  );
}

function SongInformation({ name, creator }) {
  return (
    <div className="song-info">
      <h4>{name}</h4>
      <h4>{creator}</h4>
    </div>
  );
}

function CurrentTimeIndicator({progressBarRef}) {
  
  const handleProgressChange = () => {
    console.log(progressBarRef.current.value);
  }

  return(
    <div className="progress">
      <span className="time current" >0:00</span>
      <input 
      type="range" 
      ref={progressBarRef} 
      defaultValue="0" 
      onChange={handleProgressChange}
      />
      <span className ="time">04:10</span>
    </div>
  );

  // return (
  //   <hr />
  // );
}

function MediaControls({ music, audioRef }) {
  const [isPlaying, setIsPlaying] = useState(false);
  // const audioRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, music]);

  return (
    <div className="media-control">
      <audio ref={audioRef} src={music} loop></audio>

      <div className="shuffle-control">
        <Shuffle style={{ fontSize: '3.5rem' }} />
      </div>

      {isPlaying ? (
        <div className="pause-play-control">
          <PauseCircleFilled onClick={togglePlay} style={{ fontSize: '7rem' }} />
        </div>
      ) : (
        <div className="pause-play-control">
          <PlayCircleFilled onClick={togglePlay} style={{ fontSize: '7rem' }} />
        </div>
      )}

      <div className="replay-control">
        <Repeat style={{ fontSize: '3.5rem' }} />
      </div>
    </div>
  );
}
