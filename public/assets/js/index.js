let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })


const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    //makes text "read only"
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
    
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Uses the event.target to use the data from whichever list
//JSON.parse formats the data so it a JSON Object as opposed to a json string. Once we parse the data, it is able to display on the page. 
//.parentElement is a DOM property that returns the parent element of the selected element
//.getAttribute returns the value of an elements attribute
//e.target is the <span> element that contains the Note Title displayed on the page
//that span element is targeting the parent element (<li>)

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
  console.log(activeNote)
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

//async tells us that the function is including asynchronous code
//await is used inside the async function to wait for a promise to resolve/reject
// const renderNoteList2 = (notes) => {
//   // console.log(notes)
//   return notes.json();
// }
// renderNoteList2(notes)
// .then(jsonNotesObject => {

// })

// Render the list of note titles
const renderNoteList = async (notes) => {
  // notes is placeholder
  let jsonNotesArrayOfObj = await notes.json();
  console.log(jsonNotesArrayOfObj)

  //noteList is selecting the div container for all list items and the ul that holds each list item
//this clears the list so everytime the array prints, there are no duplicates. when I commented out this code it would print the last added note PLUS all of the array items that were already on the page
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };
//running createLi function.. the 1st parameter (text) is "no saved notes" and the 2nd parameter is saying there is no delBtn
  if (jsonNotesArrayOfObj.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }
//iterating over the Array from the db.json file
//for each object in the array, a list item is created using the createLi function with the text being set to the currentNoteObj's title property
//dataset property sets the value of the data-note attribute and then stringifys it so it can be read
  jsonNotesArrayOfObj.forEach((currentNoteObj) => {
    const li = createLi(currentNoteObj.title);
    // console.log(typeof currentNoteObj);

    li.dataset.note = JSON.stringify(currentNoteObj);
    console.log(li.dataset.note)//prints a separate string representation of the currentNoteObj. since we are in the forEach loop it will print all of the currentNoteObj but separately

    noteListItems.push(li); 
    console.log(li)//prints the entire <li> including its attributes
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes()
.then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
