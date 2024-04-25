
// import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';
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
    <div>
      <h1>
       <PauseCircleFilled />
      </h1>
    </div>
  );


}