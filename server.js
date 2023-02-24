const express = require('express');
const path = require('path');
const PORT = 3002;
const databaseJSON = require('./db/db.json');
const app = express();
const fs = require('fs');
const uuid = require('./helpers/uuid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// app.get('/api/notes', (req, res) => res.json(databaseJSON));

app.get('/api/notes', (req, res) =>{
  fs.readFile('db.json', 'utf-8', (err, dbJSONString) => {
    if (err) {
      console.error(err)
    }
  })
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);
    
    const { title, text } = req.body;
    if (title && text) {
     
        const newNote = {
          title,
          text,
          review_id: uuid(),
        };
         var dbArray;
//readFile extracts the data from db.json which is in JSON format (string used to represent JS objects)
//we use JSON.parse to convert it into a JS Object which can help us work with the data
    fs.readFile('./db/db.json', 'utf-8', (err, dbJSONArrayOfObj) => {
      err ? console.log(err) : dbArray = JSON.parse(dbJSONArrayOfObj);
   
      dbArray.push(newNote); //pushes each newNote created to dbArray
      // console.log(dbJSONArrayOfObj);  //dbArray is just dbJSONArray.. in JSON Obj Format
      
      const noteString = JSON.stringify(dbArray, null, 2);
      //converts the Array of Objects into a string so it can be processed by writeFile

      fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `New note "${newNote.title}" has been written to JSON file`
          )
    );
      
      const response = {
        status: 'success',
        body: newNote,
      };
  
      // console.log(response);
      res.status(201).json(response);

    });

  } else {
    res.status(500).json("Error in posting new note");
  }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);