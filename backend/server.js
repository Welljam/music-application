const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('hello from nodejs');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 3001;

// // Serve static files from the React app's build folder
// app.use(express.static(path.join(__dirname, 'build')));

// // Handle GET requests to the root route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
