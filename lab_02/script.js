// DOM ELEMENTS DECLARATIONS:
const sliderInner = document.querySelector('.slider-inner');
const sliderNavBtns = document.querySelectorAll('.slider-nav button');

// NAVIGATE ARROW BUTTONS:
const prevBtn = document.querySelector('.btn-prev');
const nextBtn = document.querySelector('.btn-next');

// NAVIGATE STATE BUTTON:
const stateBtn = document.querySelector('.btn-state');

// SLIDER STATE:
let isRunning = false;
let currentSlide = 1;

// SLIDER LOOP:
let sliderInterval;

function setSliderInterval() {
    sliderInterval = setInterval(() => {
        nextSlide();
    }, 5_000);
}

// INITIALIZE SLIDER:
sliderInner.classList.add(`slide-${currentSlide}`);
document.querySelector(`.btn-${currentSlide}`).classList.add("btn-active");
toggleSliderPause();

function nextSlide(){
    isRunning = true;
    sliderInner.classList.remove(`slide-${currentSlide}`);
    currentSlide++;
    if (currentSlide > 5) currentSlide = 1;
    sliderInner.classList.add(`slide-${currentSlide}`);
    const animationName = `slide-${currentSlide}`;
    sliderInner.style.animationName = animationName;
    setActiveButton();
}

function setActiveButton(){
    sliderNavBtns.forEach(e => {
        e.classList.remove("btn-active");
    })
    document.querySelector(`.btn-${currentSlide}`).classList.add("btn-active");
}

sliderNavBtns.forEach((button, index) => {
    button.addEventListener('click', () => {
        const position = index + 1;
        setSlide(position);
    });
});

function setSlide(selectedSlide){
    currentSlide = selectedSlide;

    // SET SLIDE:
    sliderInner.classList.forEach(className => {
        if (className !== 'slider-inner') sliderInner.classList.remove(className);
    });
    sliderInner.classList.add(`slide-${currentSlide}`);
    setActiveButton();

    // CLEAR CURRENT ANIMATION STATE:
    clearInterval(sliderInterval);
    sliderInner.style.animationName = '';

    // REFRESH ANIMATION:
    sliderInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// PREVIOUS AND NEXT NAVIGATION BUTTONS LOGIC:
prevBtn.addEventListener('click', () => {
    if(currentSlide === 1) {
        setSlide(5);
    }
    else{
        const newSlideIndex = currentSlide - 1;
        setSlide(newSlideIndex);
    }
});

nextBtn.addEventListener('click', () => {
    if(currentSlide === 5) {
        setSlide(1);
    }
    else{
        const newSlideIndex = currentSlide + 1;
        setSlide(newSlideIndex);
    }
});

// PLAY / PAUSE - SLIDER LOGIC HANDLE:
stateBtn.addEventListener('click', () => toggleSliderPause());

function toggleSliderPause() {
    isRunning = !isRunning;
    const stateBtnIcon = stateBtn.querySelector('.fa-solid');
    const sliderNavContainer = document.querySelector('.slider-nav');
    const sliderNavArrowsContainer = document.querySelector('.slider-nav-arrows');
    if(!isRunning){
        stateBtnIcon.classList.remove("fa-pause");
        stateBtnIcon.classList.add("fa-play");
        clearInterval(sliderInterval);
        sliderInner.style.animationName = '';
        sliderNavContainer.classList.add("nav-hidden");
        sliderNavArrowsContainer.classList.add("nav-hidden");
    }
    else{
        stateBtnIcon.classList.remove("fa-play");
        stateBtnIcon.classList.add("fa-pause");
        sliderNavContainer.classList.remove("nav-hidden");
        sliderNavArrowsContainer.classList.remove("nav-hidden");
        setSliderInterval();
    }
}

// LIGHTBOX LOGIC:
const sliderImages = sliderInner.querySelectorAll('.slider-item');
const lightboxWrapper = document.querySelector('.lightbox-wrapper');

sliderImages.forEach(sliderItem => {
    sliderItem.addEventListener('click', (e) => {
        const selectedItem = e.target;
        lightboxWrapper.innerHTML = "";
        
        selectedItem.childNodes.forEach(child => {
            if (child.tagName === 'IMG') {
                toggleSliderPause();
                lightboxWrapper.appendChild(child.cloneNode(true));
                lightboxWrapper.classList.toggle('lightbox-hidden');
            }
        });
    });
});

lightboxWrapper.addEventListener("click", (e) => {
    e.target.classList.add('lightbox-hidden');
})