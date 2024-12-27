const categoryWords = {
    comida: ['manzana', 'banana', 'pizza', 'hamburguesa', 'tacos'],
    animales: ['elefante', 'gato', 'perro', 'tigre', 'tortuga'],
    tecnologia: ['computadora', 'internet', 'teclado', 'pantalla', 'programacion']
};

const gameContent = document.querySelector('.game-content');
const categoryContainer = document.querySelector('.category-container');
const wordDisplay = document.getElementById('word');
const message = document.getElementById('message');
const wrongLettersDisplay = document.getElementById('wrong-letters');
const hangmanParts = document.querySelectorAll('.hangman-part');
const lettersContainer = document.getElementById('letters-container');
const wrongLetters = [];
const maxWrongGuesses = hangmanParts.length;
const winAudio = new Audio('victory.mp3');
const loseAudio = new Audio('defeat.mp3');
const correctAudio = new Audio('correct.mp3');

let selectedWord = '';
let guessedWord = [];
let wrongGuesses = 0;


function stopAllAudios() {
    [winAudio, loseAudio, correctAudio].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function lanzarConfeti() {
    const duration = 1 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: Math.random() * 360,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

function generateLetterButtons() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const letter of alphabet) {
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'letter-btn';
        button.addEventListener('click', () => handleLetterInput(letter, button));
        lettersContainer.appendChild(button);
    }
}
function resetButtons() {
    document.querySelectorAll('.letter-btn').forEach((button) => {
        button.disabled = false;
    });
}
document.addEventListener('keydown', event => { // document, captura eventos globales en la página Este manejador capturará la tecla presionada sin importar dónde esté el usuario l objeto document te permite acceder y manipular cualquier parte de la página
    const letter = event.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) { 
        const button = Array.from(document.querySelectorAll('.letter-btn')).find(btn => btn.textContent === letter); //para poder usar el find
        if (button && !button.disabled) handleLetterInput(letter, button);
    }
});

document.getElementById('start-game-button').addEventListener('click', initGame);

document.getElementById('restart-button').addEventListener('click', () => {
    stopAllAudios();
    gameContent.style.display = 'none';
    categoryContainer.style.display = 'block';
});

function endGame() {
    // const buttons = document.querySelectorAll('.letter-btn');
    // for (let i = 0; i < buttons.length; i++) {
    //     buttons[i].disabled = true; // Deshabilita cada botón
    // }
     document.querySelectorAll('.letter-btn').forEach(btn => (btn.disabled = true)); //con callback

}

function initGame() {
    stopAllAudios();

    const category = document.getElementById('category-select').value;
    const words = categoryWords[category];
    selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    guessedWord = Array(selectedWord.length).fill('_');
    wrongGuesses = 0;
    wrongLetters.length = 0;

    wordDisplay.textContent = guessedWord.join(' ');
    message.textContent = '';
    wrongLettersDisplay.textContent = 'Letras incorrectas: ';
    categoryContainer.style.display = 'none';
    gameContent.style.display = 'block';
    hangmanParts.forEach(part => (part.style.visibility = 'hidden')); // Oculta todas las partes
    if (lettersContainer.childElementCount > 0) {
        resetButtons();
    } else {
        generateLetterButtons();
    }
    categoryContainer.style.display = 'none';
   
}

function handleLetterInput(letter, button = null) {
    if (button) button.disabled = true;

    if (wrongLetters.includes(letter) || guessedWord.includes(letter)) return;

    if (selectedWord.includes(letter)) {
        selectedWord.split('').forEach((char, index) => {
            if (char === letter) guessedWord[index] = letter;
        });
        wordDisplay.textContent = guessedWord.join(' ');

        correctAudio.currentTime = 0;
        correctAudio.play();

        if (!guessedWord.includes('_')) {
            message.textContent = '🎉 ¡Ganaste!';
            winAudio.play();
            lanzarConfeti();
            endGame();
        }
    } else {
        if (wrongGuesses < maxWrongGuesses) {
            hangmanParts[wrongGuesses].style.visibility = 'visible';
          

        }
        wrongGuesses++;
        wrongLettersDisplay.textContent += `${letter} `;

        if (wrongGuesses === maxWrongGuesses) {
            message.textContent = `❌ Perdiste. La palabra era: ${selectedWord}`;
            loseAudio.play();
            endGame();
        }
    }
}



