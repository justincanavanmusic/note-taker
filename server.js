const express = require('express');
const path = require('path');
const PORT = 3002;
const databaseJSON = require('./db/db.json');
const app = express();
const fs = require('fs');
const uuid = require('./helpers/uuid');
// const db = require(./db/db.json)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// app.get('/notes', (req, res) =>
//   res.sendFile(path.join(__dirname, 'pub'))
// );

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/api/notes', (req, res) => res.json(databaseJSON));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);
    
    const { title, text } = req.body;
    if (title && text) {
     
        const newNote = {
          title,
          text,
          review_id: uuid(),
        };
    }
})

//came from assignment 19
// fs.readFile('./db/db.json', 'utf-8', (err, data) => {
//     // err ? console.log(err) : dbArray = JSON.parse(data);
//     if(err) throw err
// })

 




app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);