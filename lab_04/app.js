const notes = JSON.parse(localStorage.getItem('notes')) || [];
const addNoteModalWrapper = document.querySelector('.add-note-modal-wrapper');
const openModalBtn = document.querySelector('#open-modal-btn');
const closeModalBtn = document.querySelector('.close-modal-btn');
const noteForm = document.querySelector('#note-form');
const noteList = document.querySelector('.note-list');
const searchInput = document.querySelector('#search');
const noteRemindList = document.querySelector('.note-remind-list');
const noteDoneList = document.querySelector('.note-done-list');

let isEditMode = false;
let currentEditId = null;

openModalBtn.addEventListener('click', () => toggleModalVisibility());
closeModalBtn.addEventListener('click', () => {
    toggleModalVisibility();
    resetForm();
});

function toggleModalVisibility(){
    addNoteModalWrapper.classList.toggle('hidden');
}

function resetForm() {
    noteForm.reset();
    isEditMode = false;
    currentEditId = null;
}

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(noteForm);
    const formValues = Object.fromEntries(formData.entries());
    if (isEditMode) {
        updateNote(formValues);
    } else {
        createNewNote(formValues);
    }
    noteForm.reset(); 
    toggleModalVisibility();
});

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNewNote({title, description, tags, color, eventDate, pin, remind, done}){
    const newNote = {
        id: notes.length,
        title: title,
        desc: description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        color: color ? color : '#eee',
        pin: pin === "on",
        remind: remind === "on",
        done: done === "on",
        eventDate: eventDate,
        createDate: new Date().toISOString()
    };
    notes.push(newNote);
    saveNotes();
    fetchNotes();
}

function updateNote({title, description, tags, remind, eventDate, color, pin, done}) {
    const note = notes.find(note => note.id === currentEditId);
    if (note) {
        note.title = title;
        note.desc = description;
        note.tags = tags ? tags.split(',').map(tag => tag.trim()) : [];
        note.color = color;
        note.pin = pin === "on";
        note.remind = remind === "on";
        note.done = done === "on",
        note.eventDate = eventDate;
        note.createDate = new Date().toISOString();
        saveNotes();
    }
    fetchNotes();
}

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    fetchNotes(query);
});

function fetchNotes(query = '') {
    noteList.innerHTML = '';
    noteRemindList.innerHTML = '';
    noteDoneList.innerHTML = '';
    const filteredNotes = notes.filter(note => {
        const lowerCaseTitle = note.title.toLowerCase();
        const lowerCaseDesc = note.desc.toLowerCase();
        const lowerCaseTags = note.tags.map(tag => tag.toLowerCase());
        
        return lowerCaseTitle.includes(query) || lowerCaseDesc.includes(query) || lowerCaseTags.some(tag => tag.includes(query));
    });

    filteredNotes.sort((a, b) => b.pin - a.pin);

    filteredNotes.forEach(note => {
        // NOTE CONTAINER:
        const noteContainer = document.createElement('div');
        noteContainer.classList.add('note');
        noteContainer.style.backgroundColor = note.color;
        // NOTE CONTENT:
        const noteContent = document.createElement('div');
        noteContent.classList.add('note-content');
        // NOTE TITLE:
        const noteTitle = document.createElement('h3');
        noteTitle.textContent = `${note.pin ? 'PINNED' : 'NOTE:'} ${note.id + 1}. ${note.title}`;
        noteContent.appendChild(noteTitle);
        // NOTE DESC:
        const noteDesc = document.createElement('p');
        noteDesc.setAttribute('id', 'note-desc');
        noteDesc.textContent = `${note.desc}`;
        noteContent.appendChild(noteDesc);
        // NOTE TAGS:
        const noteTags = document.createElement('div');
        noteTags.classList.add('note-tags');
        note.tags.forEach(tag => {
            const tagItem = document.createElement('span');
            tagItem.textContent = tag;
            noteTags.appendChild(tagItem);
        });
        noteContent.appendChild(noteTags);
        // EDIT NOTE CONTAINER:
        const editNoteContainer = document.createElement('div');
        editNoteContainer.classList.add('edit-note-btn-container');
        // EDIT BTN:
        const editBtn = document.createElement('button');
        const editBtnIcon = document.createElement('i');
        editBtnIcon.classList.add('fas', 'fa-edit');
        editBtn.appendChild(editBtnIcon);
        editBtn.addEventListener('click', () => {
            editNote(note.id);
        });
        // DELETE BTN:
        const deleteBtn = document.createElement('button');
        const deleteBtnIcon = document.createElement('i');
        deleteBtnIcon.classList.add('fas', 'fa-trash-alt');
        deleteBtn.appendChild(deleteBtnIcon);
        deleteBtn.addEventListener('click', () => {
            deleteNote(note.id);
        });
        editNoteContainer.append(editBtn, deleteBtn);
        // ADD BOTH:
        noteContainer.append(noteContent, editNoteContainer);
        const todaysDate = new Date();

        if(note.remind && isSameDate(new Date(note.eventDate), todaysDate)){
            noteRemindList.appendChild(noteContainer);
        }
        else if (note.done) {
            noteDoneList.appendChild(noteContainer);
        }
        else{
            noteList.appendChild(noteContainer);   
        }
    });
}

function editNote(noteId) {
    const note = notes.find(note => note.id === noteId);
    if (note) {
        noteForm.querySelector('[name="title"]').value = note.title;
        noteForm.querySelector('[name="description"]').value = note.desc;
        noteForm.querySelector('[name="tags"]').value = note.tags.join(', ');
        noteForm.querySelector('[name="color"]').value = note.color;
        noteForm.querySelector('[name="pin"]').checked = note.pin;
        noteForm.querySelector('[name="remind"]').checked = note.remind;
        noteForm.querySelector('[name="done"]').checked = note.done;
        noteForm.querySelector('[name="eventDate"]').value = note.eventDate;
        
        isEditMode = true;
        currentEditId = noteId;
        toggleModalVisibility();
    }
}

function deleteNote(noteId) {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex > -1) {
        notes.splice(noteIndex, 1);
        saveNotes();
        fetchNotes();
    }
}

function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

fetchNotes();
