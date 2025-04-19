window.selectedSubject = null;
const MAX_TRIES = 5;
let triesUsed = 0;
const subjects = [
    "banana.png", 
    "car.png",
    "burger.png", 
    "house.png", 
    "beanie.png", 
    "bread.png",
    "airplane.png",
    "apple.png",
    "fries.png",
    "heels.png",
    "hoodie.png",
    "lemon.png",
    "mall.png",
    "moto.png",
    "museum.png",
    "papaya.png"
];

const mysteryBox = document.getElementById("clickable-box");
const instructionText = document.getElementById("instruction-text");
const actionButtons = document.getElementById("action-buttons");
const triesCounter = document.getElementById("remaining-tries");
const playLink = document.getElementById("play-link");

function revealSubject() {
    mysteryBox.style.pointerEvents = "none";
    mysteryBox.classList.remove("animate-bounce");
    
    triesUsed++;
    mysteryBox.classList.add("opacity-0");

    setTimeout(() => {
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        const subjectName = randomSubject.replace('.png', '');
        
        mysteryBox.src = `assets/images/${randomSubject}`;
        mysteryBox.alt = subjectName;

        localStorage.setItem('selectedSubject', subjectName);
        window.selectedSubject = subjectName;
        
        playLink.href = `game.html?subject=${subjectName}`;
        
        mysteryBox.className = "max-h-[30vh] cursor-default transition-opacity duration-300";
        mysteryBox.classList.remove("opacity-0");

        actionButtons.classList.remove("hidden");
        instructionText.textContent = "Subject revealed!";
        
        if (triesCounter) {
            triesCounter.textContent = MAX_TRIES - triesUsed;
        }
    }, 300);
}

function init() {
}