const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');

// GET Route for retrieving all the notes
notes.get('/api/notes', (req, res) => {
    readFromFile('./db/notes.json').then((dataObj) => res.json(JSON.parse(dataObj)));
  });

notes.post('/api/notes', (req, res) => {
    console.log(req.body);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        tip_id: uuid(),
      };
  
      readAndAppend(newNote, './db/notes.json');
      res.json(`Tip added successfully 🚀`);
    } else {
      res.error('Error in adding tip');
    }
  });
  
  module.exports = notes;