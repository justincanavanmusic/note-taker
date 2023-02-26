const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3002;
// const databaseJSON = require('./db/db.json');
const fs = require('fs');
const uuid = require('./helpers/uuid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//GET request made to /notes endpoint
//sends notes.html from server to the client web browser; then renders the HTML file on the page for user
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

//GET request made to /api/notes endpoint
//reads db.json and creates a string (this is what readFile creates) with all of the data from the page it read. 
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (err, dbJSONString) => {
    if (err) {
      console.error(err)
    }
    // console.log(dbJSONString);
    res.json(JSON.parse(dbJSONString));
    //res.json makes the parsed object a JSON string that makes it readable for the client
  //  console.log(res)
 
  })
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);
    
    const { title, text } = req.body;
    console.log(req.body)
    if (title && text) {
     
        const newNote = {
          title,
          text,
          id: uuid(),
        };
         let dbArray=[];
        //  var dbArray;
//readFile extracts the data from db.json which is in JSON format (string used to represent JS objects)
//we use JSON.parse to convert it into a JS Object

    fs.readFile('./db/db.json', 'utf-8', (err, dbJSONArrayOfObj) => {
      if (err) {
        console.error(err)
      } dbArray = JSON.parse(dbJSONArrayOfObj);

      // console.log(dbJSONArrayOfObj)
   
      dbArray.push(newNote); //pushes each newNote created to dbArray
      // console.log(dbJSONArrayOfObj);  //dbArray is just dbJSONArray.. in JSON Obj Format

      // console.log(dbArray)
      
      const noteString = JSON.stringify(dbArray, null, 2);
      
      //converts the Array of Objects into a string so it can be processed by writeFile.
      console.log(noteString)
      //we use the 2 in the 3rd parameter for spacing/readability purposes

      // console.log(typeof noteString)

      //writes the data from noteString onto the db.json page
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

//incase there is a typo in the endpoint... go back to index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);
//creates a link for me to use
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);