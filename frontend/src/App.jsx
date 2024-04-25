
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled'
import Repeat from '@material-ui/icons/Repeat'
import Shuffle from '@material-ui/icons/Shuffle'
import "./App.css"



export default function App(){
  return SoundBox();
}

function SoundBox(){
  return(
    <div className = "sound-box">
    <Image />
    <SongInformation />
    {/* <CurrentTimeIndicator /> */}
    <MediaControls />

  </div>
  )
}

function Image(){
  return(
    <img className = "music-image" src="https://www.nme.com/wp-content/uploads/2016/09/62_radiohead-1.jpg" alt="Album Cover" />
  );

}

function SongInformation(){
  return <>
    <div className = "song-info">
      <label htmlFor="">In Rainbows</label>
      <label htmlFor="">Radiohead</label>
    </div>
  </>

}

function CurrentTimeIndicator(){
  return

  //how to make a currentimeindicator in javascript
}

function MediaControls(){
  return(
    <>
    <div className = "media-control">
      <div className = "shuffle-control">
        <Shuffle style = {{fontSize: '3.5rem'}}/>
      </div>
      <div className = "pause-control">
        <PauseCircleFilled style = {{fontSize: '5rem'}}/>
      </div>
      <div className = "replay-control">
        <Repeat style = {{fontSize: '3.5rem'}}/>
      </div>
    </div>
    </>
  );

}