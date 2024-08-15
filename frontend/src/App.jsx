import PauseCircleFilled from '@mui/icons-material/PauseCircleFilled';
import Repeat from '@mui/icons-material/Repeat';
import Shuffle from '@mui/icons-material/Shuffle';
import SkipNext from '@mui/icons-material/SkipNext';
import SkipPrevious from '@mui/icons-material/SkipPrevious';
import PlayCircleFilled from '@mui/icons-material/PlayCircleFilled';
import Add from '@mui/icons-material/Add';
import "./App.css";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { audios } from './audioData';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack, Button } from '@mui/material';

export default function App() {
  return (
    <div className="display">
      <ButtonFunc />
      <SoundBox />
    </div>
  );
}

function ButtonFunc() {
  const isLargeScreen = useMediaQuery('(min-width:1100px)');
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const functionOpenPopup = () => {
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  

  return (
    <>
      <Button color="grey" variant="contained" className="button" onClick={functionOpenPopup}>
        <Add style={{ fontSize: isLargeScreen ? '3rem' : '2rem' }} />
      </Button>
      <Dialog open={open} onClose={closePopup} fullWidth>
        <DialogTitle>Lägg till en låt</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField variant="outlined" label="Artist" />
            <TextField variant="outlined" label="Låt" />
            <TextField variant="outlined" label="mp3-fil" />
            <div>
              <input
                accept="image/*"
                id="bild-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <label htmlFor="bild-upload">
                <Button variant="outlined" component="span" className="bild-storlek">
                  Bild
                </Button>
              </label>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{ marginTop: '10px', maxWidth: '100%' }}
                />
              )}
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePopup} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
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
