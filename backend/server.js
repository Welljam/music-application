const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const audioData = path.join(__dirname, 'addedAudioData.js');

app.use(cors());
app.use(express.json());

function readSongsFromFile(){
    try{
        const data = fs.readFileSync(audioData, 'utf-8');
        return JSON.parse(data);
    } catch(err){
        return [];
    }
}

function writeSongsToFile(songs){
    fs.writeFileSync(audioData, JSON.stringify(songs, null, 2), 'utf-8');
}

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

app.get('/songs', (req, res) => {
    const songs = readSongsFromFile();
    res.json(songs);
});

app.post('/add-song', (req, res) => {
    const newSong = req.body;
    console.log("Received new song data:", newSong);

    //read existing songs
    const songs = readSongsFromFile();

    //add new song to json
    songs.push(newSong);

    //write the updated json to the file
    writeSongsToFile(songs);

    res.status(200).json({ message: "Song data received" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
