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

// ... (garder le début du code jusqu'à const words = {...})

const subjectWords = {
    banana: ["banana", "fruit", "yellow", "peel", "tropical", "sweet", "vitamins","bunch", "peel"],
    apple: ["apple", "fruit", "red", "juicy", "orchard", "crunchy", "healthy","sweet", "tree", "juice", "cider"],
    papaya: ["papaya", "fruit", "tropical", "orange", "seeds", "sweet", "vitamins","juicy"],
    lemon: ["lemon", "citrus", "yellow", "sour", "juice", "vitamin C", "zest"],
    beanie: ["beanie", "hat", "wool", "warm", "winter", "knit", "headwear","cozy", "head"],
    heels: ["heels", "shoes", "high","pump", "stile", "lady", "fashion", "elegant", "women", "leather"],
    hoodie: ["hoodie", "sweatshirt", "hood", "casual", "warm", "cotton", "streetwear"],
    burger: ["burger", "sandwich","patty", "bun","grill", "beef", "cheese", "lettuce", "fast food", "bun"],
    fries: ["fries","snack", "potato", "chips", "crispy", "salty", "fast food", "ketchup"],
    bread: ["bread", "loaf", "baked", "flour", "yeast", "toast", "bakery","bake", "wheat", "dough"],
    car: ["car", "vehicle", "drive", "engine", "wheels", "speed", "automobile","auto", "drive","motor"],
    airplane: ["airplane", "flight", "wings", "pilot", "travel", "sky", "jet", "fly", "air"],
    moto: ["moto", "motorcycle", "bike", "ride", "helmet", "speed", "engine","race", "turbo"],
    house: ["house", "home", "roof", "door", "garden", "living", "building","brick", "villa"],
    mall: ["mall", "shopping", "stores", "center", "clothes", "food court", "escalator","shop", "store", "plaza", "sales", "retail"],
    museum: ["museum", "art", "exhibition", "history", "gallery", "paintings", "sculpture","exhibit","relic"]
};

const getRandomWord = (mode) => {
    const subject = localStorage.getItem('selectedSubject') || "default";
    
    let wordList = [];
    
    // Si le sujet existe, filtrer les mots selon la longueur
    if (subjectWords[subject]) {
        wordList = subjectWords[subject].filter(word => {
            if (mode === "easy") return word.length <= 5;
            if (mode === "medium") return word.length <= 8;
            if (mode === "hard") return word.length <= 12;
            return true;
        });
    }
    
    // Si on a trouvé des mots correspondants
    if (wordList.length > 0) {
        return wordList[Math.floor(Math.random() * wordList.length)];
    }
    
    // Fallback aux mots par défaut si aucun mot ne correspond
    console.warn(`Aucun mot de taille appropriée pour ${subject} en mode ${mode}`);
    const defaultWords = {
        easy: ["cat", "dog", "sun"],
        medium: ["banana", "orange", "purple"],
        hard: ["elephant", "watermelon", "adventure"]
    };
    return defaultWords[mode][Math.floor(Math.random() * defaultWords[mode].length)];
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    previousWordTime = null;
    correctWords = 0;
    totalWordsTyped = 0;
    currentCharIndex = 0; // Nouvelle variable pour suivre la position du curseur

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.style.position = "relative";
        span.textContent = word + " ";
        if (index === 0) {
            span.style.color = "#F6C28B";
            // Initialisation avec le curseur sous le premier caractère
            span.innerHTML = word.split('').map((char, i) => 
                `<span class="char" data-index="${i}" style="position: relative;">
                    ${char}
                    ${i === 0 ? '<span class="cursor" style="position: absolute; bottom: -2px; left: 0; width: 100%; height: 1px; background-color: #F6C28B;"></span>' : ''}
                </span>`
            ).join('') + " ";
        }
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = "";
    console.log("Démarrage du test avec sujet:", window.selectedSubject);
};

// Variables globales
let correctWords = 0;
let totalWordsTyped = 0;
let previousWordTime = null;
let currentCharIndex = 0;

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
    if (!previousWordTime) previousWordTime = startTime;
};

// Calculate WPM based on completed words only
const calculateWPM = () => {
    if (!startTime || correctWords === 0) return 0;
    
    const minutesElapsed = (Date.now() - startTime) / 60000;
    return (correctWords / 5) / minutesElapsed;
};

// Calculate accuracy based on completed words
const calculateAccuracy = () => {
    if (totalWordsTyped === 0) return 100;
    return (correctWords / totalWordsTyped) * 100;
};

// Update character colors and cursor position
const updateCharacterColors = () => {
    const currentWord = wordsToType[currentWordIndex];
    const typedWord = inputField.value;
    const wordElement = wordDisplay.children[currentWordIndex];
    
    // Create character spans if they don't exist
    if (!wordElement.querySelector('.char')) {
        wordElement.innerHTML = currentWord.split('').map((char, i) => 
            `<span class="char" data-index="${i}">${char}</span>`
        ).join('') + " ";
    }
    
    const chars = wordElement.querySelectorAll('.char');
    
    // Find current cursor position
    let cursorPos = typedWord.length;
    let hasError = false;
    
    // Check for typing errors
    for (let i = 0; i < typedWord.length; i++) {
        if (typedWord[i] !== currentWord[i]) {
            cursorPos = i;
            hasError = true;
            break;
        }
    }
    
    // Update character colors
    for (let i = 0; i < chars.length; i++) {
        if (i < typedWord.length) {
            chars[i].style.color = typedWord[i] === currentWord[i] ? "#F6C28B" : "red";
        } else {
            chars[i].style.color = "#F6C28B";
        }
    }
    
    // Remove any existing cursor
    const existingCursor = document.querySelector('.cursor');
    if (existingCursor) existingCursor.remove();
    
    // Add new cursor at correct position if not at end of word
    if (cursorPos < chars.length) {
        const targetChar = chars[cursorPos];
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.style.cssText = `
            position: absolute;
            bottom: -2px;
            height: 1px;
            background-color: #F6C28B;
            width: ${targetChar.offsetWidth}px;
            left: ${targetChar.offsetLeft}px;
        `;
        
        wordElement.style.position = 'relative';
        wordElement.appendChild(cursor);
    }
    
    currentCharIndex = cursorPos;
};

// Move to the next word on spacebar press
const updateWord = (event) => {
    const currentWord = wordsToType[currentWordIndex];
    const typedWord = inputField.value.trim();
    
    if (event.key === " ") {
        event.preventDefault();
        totalWordsTyped++;
        
        if (typedWord === currentWord) {
            correctWords++;
            const now = Date.now();
            previousWordTime = now;
            
            currentWordIndex++;
            if (currentWordIndex < wordsToType.length) {
                inputField.value = "";
                
                // Update word display
                const wordElements = wordDisplay.children;
                wordElements[currentWordIndex - 1].style.color = "#F6C28B";
                
                // Remove cursor from previous word
                const prevCursor = wordElements[currentWordIndex - 1].querySelector('.cursor');
                if (prevCursor) prevCursor.remove();
                
                // Prepare new word
                wordElements[currentWordIndex].style.color = "#F6C28B";
                wordElements[currentWordIndex].innerHTML = 
                    wordsToType[currentWordIndex].split('').map(char => 
                        `<span class="char">${char}</span>`
                    ).join('') + " ";
            } else {
                // Test completed
                const wpm = calculateWPM().toFixed(2);
                const accuracy = calculateAccuracy().toFixed(2);
                results.textContent = `Test complet! WPM: ${wpm}, Accuracy: ${accuracy}%`;
                inputField.value = "";
                inputField.blur();
                return;
            }
        }
        
        // Update stats
        const wpm = calculateWPM().toFixed(2);
        const accuracy = calculateAccuracy().toFixed(2);
        results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;
    }
};

// Event listeners
inputField.addEventListener('input', () => {
    startTimer();
    updateCharacterColors();
});

inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});

modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();