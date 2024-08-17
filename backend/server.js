const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

app.get('/songs', (req, res) => {
    res.send('song information');
});

app.post('/add-song', (req, res) => {
    const newSong = req.body;
    console.log("Received new song data:", newSong);
    res.status(200).json({ message: "Song data received" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
