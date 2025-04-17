/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
const urlParams = new URLSearchParams(window.location.search);
const subjectFromURL = urlParams.get('subject');
const subject = subjectFromURL || localStorage.getItem('selectedSubject') || "default";

let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

const getFilteredSubjectWords = (mode) => {
    const subject = localStorage.getItem('selectedSubject') || "default";
    
    // Liste complète des mots par sujet (peu importe leur longueur)
    const subjectWords = {
        // Fruits
        banana: ["banana", "fruit", "yellow", "peel", "tropical", "sweet", "vitamins"],
        apple: ["apple", "fruit", "red", "juicy", "orchard", "crunchy", "healthy"],
        papaya: ["papaya", "fruit", "tropical", "orange", "seeds", "sweet", "vitamins"],
        lemon: ["lemon", "citrus", "yellow", "sour", "juice", "vitamin C", "zest"],
        
        // Vêtements
        beanie: ["beanie", "hat", "wool", "warm", "winter", "knit", "headwear"],
        heels: ["heels", "shoes", "high", "fashion", "elegant", "women", "leather"],
        hoodie: ["hoodie", "sweatshirt", "hood", "casual", "warm", "cotton", "streetwear"],
        
        // Nourriture
        burger: ["burger", "sandwich", "beef", "cheese", "lettuce", "fast food", "bun"],
        fries: ["fries", "potato", "chips", "crispy", "salty", "fast food", "ketchup"],
        bread: ["bread", "loaf", "baked", "flour", "yeast", "toast", "bakery"],
        
        // Transports
        car: ["car", "vehicle", "drive", "engine", "wheels", "speed", "automobile"],
        airplane: ["airplane", "flight", "wings", "pilot", "travel", "sky", "jet"],
        moto: ["moto", "motorcycle", "bike", "ride", "helmet", "speed", "engine"],
        
        // Lieux
        house: ["house", "home", "roof", "door", "garden", "living", "building"],
        mall: ["mall", "shopping", "stores", "center", "clothes", "food court", "escalator"],
        museum: ["museum", "art", "exhibition", "history", "gallery", "paintings", "sculpture"]
    };

    const words = subjectWords[subject] || subjectWords.default;

    // Filtre les mots selon la longueur du mode
    return words.filter(word => {
        if (mode === "easy") return word.length <= 5;
        if (mode === "medium") return word.length <= 8;
        if (mode === "hard") return word.length <= 12;
        return true; // Si mode inconnu
    });
};

const categories = {
    fruits: ["banana", "apple", "papaya", "lemon"],
    clothes: ["beanie", "heels", "hoodie"],
    foods: ["burger", "fries", "bread"],
    transports: ["car", "airplane", "moto"],
    places: ["house", "mall", "museum"]
};

// Puis dans getRandomWord(), vous pouvez faire :
if (categories.fruits.includes(subject)) {
    // Utiliser des mots génériques de fruits
    const allFruitWords = categories.fruits.flatMap(fruit => subjectWords[fruit]);
    return allFruitWords[Math.floor(Math.random() * allFruitWords.length)];
}

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    console.log("Current subject:", subject); // Utilisez subject directement
    
    let wordList;
    if (subject && subject !== "null" && subject !== "default") {
        wordList = getFilteredSubjectWords(mode);
    } else {
        wordList = words[mode];
    }
    
    if (!wordList || wordList.length === 0) {
        console.warn("Aucun mot disponible - utilisation des mots par défaut");
        wordList = words[mode] || ["default"];
    }
    
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = "";

    console.log("Démarrage du test avec sujet:", window.selectedSubject);
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = (wordsToType[currentWordIndex].length / inputField.value.length) * 100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;

            const { wpm, accuracy } = getCurrentStats();
            results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
        }
    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();
