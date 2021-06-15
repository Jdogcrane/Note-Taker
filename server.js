const path = require('path');
const fs = require("fs");
const express = require('express');
// third-party unique ID generator
const { v4: uuidv4 } = require('uuid');
// database path
const db = require('./db/db.json');
console.log(db)
// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// pathing for each file
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));
app.get('/api/notes', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    res.json(data);
});
//post and writes
app.post('/api/notes', (req, res) => {
    const body = { ...req.body };
    const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    body.id = uuidv4();
    fs.writeFileSync('./db/db.json', JSON.stringify(data.concat(body), null, 2), 'utf-8');
    res.send(body);
});

// delete notes with correct id
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    const items = data.filter((item) => item.id !== id);
    fs.writeFileSync('./db/db.json', JSON.stringify(items), 'utf-8');
    res.send("success");
})
// console log link for easy testing
app.listen(PORT, () => console.log(`App listening on PORT ${PORT} http://localhost:${PORT}`));