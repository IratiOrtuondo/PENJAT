const categoryWords = {
    comida: ['manzana', 'banana', 'pizza', 'hamburguesa', 'tacos'],
    animales: ['elefante', 'gato', 'perro', 'tigre', 'tortuga'],
    tecnologia: ['computadora', 'internet', 'teclado', 'pantalla', 'programacion']
};

let selectedCategory = '';
let selectedWord = '';
let guessedWord = [];
let wrongGuesses = 0;
const maxWrongGuesses = 7;
let gameEnded = false;

const wordDisplay = document.getElementById('word');
const message = document.getElementById('message');
const wrongLettersDisplay = document.getElementById('wrong-letters');
const figureContainer = document.getElementById('figure-container');
const lettersContainer = document.getElementById('letters-container');
const restartButton = document.getElementById('restart-button');
const categorySelect = document.getElementById('category-select');
const startGameButton = document.getElementById('start-game-button');
const categoryContainer = document.querySelector('.category-container');
const gameContent = document.querySelector('.game-content');
const loseAudio = new Audio('defeat.mp3');
const winAudio = new Audio('victory.mp3');

const hangmanImages = [
    "fig1.JPG",
    "fig2.JPG",
    "fig3.JPG",
    "fig4.JPG",
    "fig5.JPG",
    "fig6.JPG",
    "fig7.JPG",
    "fig8.JPG"
];

function updateHangmanImage() {
    figureContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = hangmanImages[wrongGuesses];
    img.style.margin = "0 auto"; 
    img.style.width = "450px";
    figureContainer.appendChild(img);
}

function generateLetterButtons() {
    lettersContainer.innerHTML = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const letter of alphabet) {
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'letter-btn';
        button.addEventListener('click', () => handleLetterInput(letter, button));
        lettersContainer.appendChild(button);
    }
}

function stopAllAudios() {
    [winAudio, loseAudio].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function initGame() {
    stopAllAudios();
    const words = categoryWords[selectedCategory];
    selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    guessedWord = Array(selectedWord.length).fill('_');
    wrongGuesses = 0;
    gameEnded = false;
    message.textContent = '';
    wrongLettersDisplay.textContent = 'Letras incorrectas: ';
    wordDisplay.textContent =guessedWord.join(' ');
    updateHangmanImage(); 
    generateLetterButtons();
    gameContent.style.display = 'block'; // Muestra el contenido del juego
    categoryContainer.style.display = 'none'; // Oculta la selección de categoría
}

function handleLetterInput(letter, button = null) {
    if (gameEnded) return;
    if (button) button.disabled = true;

    if (selectedWord.includes(letter)) {
        
        selectedWord.split('').forEach((char, index) => {
            if (char === letter) guessedWord[index] = letter;
        });
        wordDisplay.textContent = guessedWord.join(' ');

        if (!guessedWord.includes('_')) {
            gameEnded = true;
            message.textContent = '🎉 ¡Ganaste! 🎉';
            winAudio.play();
            lanzarConfeti();
            endGame();
        }
    } else {
        
        wrongGuesses++;
        wrongLettersDisplay.textContent += `${letter} `;
        updateHangmanImage();

        if (wrongGuesses === maxWrongGuesses) {
            gameEnded = true;
            message.textContent = `❌ Perdiste. La palabra era: ${selectedWord}`;
            loseAudio.play();
            endGame();
        }
    }
}

function lanzarConfeti() {
    const duration = 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 10,
            angle: Math.random() * 360,
           
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
    
}

function endGame() {
    document.querySelectorAll('.letter-btn').forEach(btn => (btn.disabled = true));
}

startGameButton.addEventListener('click', () => {
    selectedCategory = categorySelect.value;
    initGame();
});

restartButton.addEventListener('click', () => {
    stopAllAudios(); // Detiene cualquier música en curso al reiniciar
    gameContent.style.display = 'none'; // Oculta el contenido del juego
    categoryContainer.style.display = 'block'; // Muestra la selección de categoría
    selectedCategory = '';
});

// Permite escribir letras con el teclado
document.addEventListener('keydown', event => {
    const letter = event.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) { 
        const button = Array.from(document.querySelectorAll('.letter-btn')).find(btn => btn.textContent === letter);
        if (button && !button.disabled) handleLetterInput(letter, button);
    }
});

// Oculta el contenido del juego al cargar
gameContent.style.display = 'none';
