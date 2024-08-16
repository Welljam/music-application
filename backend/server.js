const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');
const path = require('path');

app.use(express.json());

app.get('/songs', (req, res) => {
    res.send('song information');
});

app.post('/add-song', (req, res) => {
    const newSong = req.body;
    console.log("Received new song data:", newSong)
    
    // const { artist, songID, songName, album, imageUrl } = req.body; 
    // console.log("Received data:", {artist, songID, songName, albumName, imageUrl});

    res.status(200).json({message: "Song data recerived"})
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
