const express = require('express');
const app = express();
const port = 3001;
// import audios from "./frontend/src/audioData.js";

app.get('/', (req, res) => {
    res.send('song information');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
