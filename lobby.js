// CONFIGURATION
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

// ÉLÉMENTS DOM
const mysteryBox = document.getElementById("clickable-box");
const instructionText = document.getElementById("instruction-text");
const actionButtons = document.getElementById("action-buttons");
const triesCounter = document.getElementById("remaining-tries");

// FONCTION PRINCIPALE
function revealSubject() {
    // Désactive le clic après le premier essai
    mysteryBox.style.pointerEvents = "none";
    mysteryBox.classList.remove("animate-bounce"); // Supprime l'animation de bounce
    
    triesUsed++;
    mysteryBox.classList.add("opacity-0");

    setTimeout(() => {
        // Changement du sujet
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        // Remplace l'image existante par la nouvelle image
        mysteryBox.src = `assets/images/${randomSubject}`;
        mysteryBox.alt = randomSubject.replace('.png', '');
        // Ajuste les classes pour le style
        mysteryBox.className = "max-h-[30vh] cursor-default transition-opacity duration-300";
        
        mysteryBox.classList.remove("opacity-0");

        // Affichage des boutons et mise à jour de l'interface
        actionButtons.classList.remove("hidden");
        instructionText.textContent = "Sujet révélé !";
        if (triesCounter) {
            triesCounter.textContent = MAX_TRIES - triesUsed;
        }
    }, 300);
}

// DÉMARRAGE
function init() {
    // Initialisation si nécessaire
}