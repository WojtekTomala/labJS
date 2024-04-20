const notes = [];
const addNoteModalWrapper = document.querySelector('.add-note-modal-wrapper');
const openModalBtn = document.querySelector('#open-modal-btn');
const closeModalBtn = document.querySelector('.close-modal-btn');
const noteForm = document.querySelector('#note-form');

openModalBtn.addEventListener('click', () => toggleModalVisibility());
closeModalBtn.addEventListener('click', () => toggleModalVisibility());

function toggleModalVisibility(){
    addNoteModalWrapper.classList.toggle('hidden');
}

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formValues = new FormData(noteForm);
    console.log(formValues);
});

function createNewNote(){
    const newNote = {
        id: notes.length,
        title: '',
        desc: '',
        color: '',
        pin: false,
        createDate: ''
    }
}
