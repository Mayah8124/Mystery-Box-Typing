const MAX_TRIES = 5;
let triesUsed = 0;
const subjects = [
    "banana.png", 
    "car.png", 
    "chicken-leg.png", 
    "burger.png", 
    "house.png", 
    "beanie.png", 
    "bread.png"
];

const mysteryBox = document.getElementById("clickable-box");
const instructionText = document.getElementById("instruction-text");
const actionButtons = document.getElementById("action-buttons");
const triesCounter = document.getElementById("remaining-tries");

function revealSubject() {
    mysteryBox.style.pointerEvents = "none";
    mysteryBox.classList.remove("animate-bounce");
    
    triesUsed++;
    mysteryBox.classList.add("opacity-0");

    setTimeout(() => {
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        mysteryBox.src = `assets/images/${randomSubject}`;
        mysteryBox.alt = randomSubject.replace('.png', '');
        mysteryBox.className = "max-h-[30vh] cursor-default transition-opacity duration-300";
        mysteryBox.classList.remove("opacity-0");
        actionButtons.classList.remove("hidden");
        instructionText.textContent = "Subject revealed !";
        if (triesCounter) {
            triesCounter.textContent = MAX_TRIES - triesUsed;
        }
    }, 300);
}

function init() {
}