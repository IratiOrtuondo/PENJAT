const categoryWords = {
    comida: ['manzana', 'banana', 'pizza', 'hamburguesa', 'tacos'],
    animales: ['elefante', 'gato', 'perro', 'tigre', 'tortuga'],
    tecnologia: ['computadora', 'internet', 'teclado', 'pantalla', 'programacion']
};

let selectedCategory = '';
let selectedWord = '';
let guessedWord = [];
let wrongGuesses = 0;
let gameEnded = false;

const wordDisplay = document.getElementById('word');
const message = document.getElementById('message');
const wrongLettersDisplay = document.getElementById('wrong-letters');
const lettersContainer = document.getElementById('letters-container');
const restartButton = document.getElementById('restart-button');
const categorySelect = document.getElementById('category-select');
const startGameButton = document.getElementById('start-game-button');
const categoryContainer = document.querySelector('.category-container');
const gameContent = document.querySelector('.game-content');
const canvas = document.getElementById('figure-container');
const ctx = canvas.getContext('2d'); //canvas: Es un lienzo en blanco en tu página web, donde puedes dibujar cosas (como dibujos, formas, líneas, etc.)dibujos en 2 dimensiones (2D).
// Audios
const correct = new Audio('correct.mp3');
const winAudio = new Audio('victory.mp3');
const loseAudio = new Audio('defeat.mp3');

// Dibuja la estructura inicial y partes del cuerpo
function drawStructure() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000'; //color
    ctx.beginPath();
    ctx.moveTo(50, 350);
    ctx.lineTo(250, 350);
    ctx.moveTo(100, 350);
    ctx.lineTo(100, 50);
    ctx.lineTo(200, 50);
    ctx.lineTo(200, 100);
    ctx.stroke();
}

function drawHead() { 
    ctx.font = '40px Arial'; // Tamaño y fuente
    ctx.textAlign = 'center'; // Centra el texto horizontalmente
    ctx.textBaseline = 'middle'; // Centra el texto verticalmente
    ctx.fillText('😟', 200, 130); 
}
function drawSkull() { 
    ctx.clearRect(160, 100, 80, 80);
    ctx.font = '40px Arial'; // Tamaño y fuente
    ctx.textAlign = 'center'; // Centra el texto horizontalmente
    ctx.fillText('💀', 200, 130); 
}
function drawBody() { ctx.moveTo(200, 150); ctx.lineTo(200, 250); ctx.stroke(); }
function drawLeftArm() { ctx.moveTo(200, 180); ctx.lineTo(160, 220); ctx.stroke(); }
function drawRightArm() { ctx.moveTo(200, 180); ctx.lineTo(240, 220); ctx.stroke(); }
function drawLeftLeg() { ctx.moveTo(200, 250); ctx.lineTo(160, 300); ctx.stroke(); }
function drawRightLeg() { ctx.moveTo(200, 250); ctx.lineTo(240, 300); ctx.stroke(); }

const drawSteps = [drawStructure, drawHead, drawBody, drawLeftArm, drawRightArm, drawLeftLeg, drawRightLeg];

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateHangmanCanvas() {
    if (wrongGuesses === drawSteps.length - 1) {
        drawSkull();// Dibuja la calavera en el último error
        drawSteps[wrongGuesses]()
    } else if (wrongGuesses < drawSteps.length) {
        drawSteps[wrongGuesses](); // Dibuja las partes normales
    }
}

function stopAllAudios() {
    [correct, winAudio, loseAudio].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function generateLetterButtons() {
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'letter-btn';
        button.addEventListener('click', () => handleLetterInput(letter, button));
        lettersContainer.appendChild(button);
    });
}
function resetButtons() {
    document.querySelectorAll('.letter-btn').forEach((button) => {
        button.disabled = false;
    });
}
function endGame() {
    document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = true);
}

function initGame() {
    resetCanvas();
    stopAllAudios();
    wrongGuesses = 0;
    gameEnded = false;
    const words = categoryWords[selectedCategory];
    selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    guessedWord = Array(selectedWord.length).fill('_');
    wordDisplay.textContent = guessedWord.join(' ');
    wrongLettersDisplay.textContent = 'Letras incorrectas: ';
    message.textContent = '';
    if (lettersContainer.childElementCount > 0) {
        resetButtons();
    } else {
        generateLetterButtons();
    }
    gameContent.style.display = 'block';
    categoryContainer.style.display = 'none';
}

function handleLetterInput(letter, button) {
    if (gameEnded) return;

    if (button) button.disabled = true;

    if (selectedWord.includes(letter)) {
        selectedWord.split('').forEach((char, index) => {  //!
            if (char === letter) 
                guessedWord[index] = letter;
        });
        wordDisplay.textContent = guessedWord.join(' ');

        if (!guessedWord.includes('_')) {
            gameEnded = true;
            message.textContent = '🎉 ¡Ganaste! 🎉';
            winAudio.play();
            lanzarConfeti();
            endGame();
            
        }
        else {
            // Suena correct solo si no ha ganado aún
            correct.currentTime = 0;
            correct.play();
        }
    } else {
        updateHangmanCanvas();
        wrongGuesses++;
        wrongLettersDisplay.textContent += `${letter} `;

        if (wrongGuesses === drawSteps.length) {
            gameEnded = true;
            message.textContent = `❌ Perdiste. La palabra era: ${selectedWord}`;
            loseAudio.play();
            endGame();
        }
    }
}

startGameButton.addEventListener('click', () => {
    selectedCategory = categorySelect.value;
    initGame();
});

restartButton.addEventListener('click', () => {
    resetCanvas();
    stopAllAudios();
    gameContent.style.display = 'none';
    categoryContainer.style.display = 'block';
});

document.addEventListener('keydown', (event) => {
    if (gameEnded) return;

    const letter = event.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
        const button = Array.from(document.querySelectorAll('.letter-btn')).find(btn => btn.textContent === letter);
        if (button && !button.disabled) handleLetterInput(letter, button);
    }
});
function lanzarConfeti() {
    const duration = 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 10,
            angle: Math.random() * 360, //aleatorio (de 0° a 360°) para dispersar los confetis en diferentes direcciones
           
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
    
}







