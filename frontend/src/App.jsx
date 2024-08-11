import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';
import Repeat from '@material-ui/icons/Repeat';
import Shuffle from '@material-ui/icons/Shuffle';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Add from '@material-ui/icons/Add';
import "./App.css";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { audios } from './audioData';

export default function App() {
  return(
    <div className = "display">
    <Button />
    <SoundBox />
    </div>
  ) 
}

function Button(){
  return(
    <div>
      <button className = "button">
        <Add/>
      </button>
    </div>
  )
}

function SoundBox() {
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const handleNextSong = () => {
    setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % audios.length);
  };

  const handlePreviousSong = () => {
    setCurrentAudioIndex((prevIndex) => (prevIndex - 1 + audios.length) % audios.length);
  };

  const selectedAudio = audios[currentAudioIndex];

  return (
    <div className="sound-box">
      <Image image={selectedAudio.image} onNextClick={handleNextSong} onPreviousClick={handlePreviousSong} />
      <SongInformation name={selectedAudio.name} creator={selectedAudio.creator} />
      <CurrentTimeIndicator progressBarRef={progressBarRef} timeProgress={timeProgress} duration={duration} audioRef={audioRef} />
      <MediaControls music={selectedAudio.music} audioRef={audioRef} setDuration={setDuration} progressBarRef={progressBarRef} duration={duration} setTimeProgress={setTimeProgress} />
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

function CurrentTimeIndicator({ progressBarRef, timeProgress, duration, audioRef }) {

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formattedMinutes}:${formattedSeconds}`;
    }
    return '00:00';
  };

  const handleProgressChange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
  };

  const handleProgressBarClick = (event) => {
    const progressBar = progressBarRef.current;
    const clickPosition = event.nativeEvent.offsetX / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    progressBar.value = newTime;
    audioRef.current.currentTime = newTime;
  };

  return (
    <div className="progress" onClick={handleProgressBarClick}>
      <span className="time">{formatTime(timeProgress)}</span>
      <input
        type="range"
        ref={progressBarRef}
        defaultValue="0"
        onChange={handleProgressChange}
      />
      <span className="time">{formatTime(duration)}</span>
    </div>
  );
}

function MediaControls({ music, audioRef, setDuration, progressBarRef, duration, setTimeProgress }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playAnimationRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  };

  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };

  const updateProgress = useCallback(() => {
    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);
    progressBarRef.current.value = currentTime;
    progressBarRef.current.style.setProperty(
      '--range-progress',
      `${(currentTime / duration) * 100}%`
    );
  }, [duration, setTimeProgress]);

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startAnimation();
    } else {
      audioRef.current.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress();
    }
    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation, updateProgress]);

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
      <audio ref={audioRef} src={music} onLoadedMetadata={onLoadedMetadata} loop></audio>

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
