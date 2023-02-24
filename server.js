const express = require('express');
const path = require('path');
const PORT = 3002;
const app = express();
const fs = require('fs');
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







app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);