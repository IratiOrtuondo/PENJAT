const categoryWords = {
    comida: ['manzana', 'banana', 'pizza', 'hamburguesa', 'tacos'],
    animales: ['elefante', 'gato', 'perro', 'tigre', 'tortuga'],
    tecnologia: ['computadora', 'internet', 'teclado', 'pantalla', 'programacion']
};

const wordDisplay = document.getElementById('word');
const message = document.getElementById('message');
const wrongLettersDisplay = document.getElementById('wrong-letters');
const figureContainer = document.getElementById('figure-container');
const lettersContainer = document.getElementById('letters-container');
const restartButton = document.getElementById('restart-button');
const categorySelect = document.getElementById('category-select');
const startGameButton = document.getElementById('start-game-button');
const categoryContainer = document.querySelector('.category-container'); //seleccionar un elemento del DOM
const gameContent = document.querySelector('.game-content');
const loseAudio = new Audio('defeat.mp3');
const winAudio = new Audio('victory.mp3');
const correct = new Audio('correct.mp3');
const maxWrongGuesses = 7;

let selectedCategory = '';
let selectedWord = '';
let guessedWord = [];
let wrongGuesses = 0;

function updateHangmanImage() { //solo crear imagen una vez
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
    
        // Actualiza el src de la imagen directamente
        const img = figureContainer.querySelector('img');
        img.src = hangmanImages[wrongGuesses];

}

function generateLetterButtons() { //una vez generados no volverlo a hacer cada partida solo en la primera

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
     for (const letter of alphabet) {
         const button = document.createElement('button');
         button.textContent = letter;
         button.className = 'letter-btn';
        button.addEventListener('click', () => handleLetterInput(letter, button)); //!
        lettersContainer.appendChild(button);
     }
} 

function resetButtons() {
    document.querySelectorAll('.letter-btn').forEach((button) => {
        button.disabled = false;
    });
}

function stopAllAudios() {
    [winAudio, loseAudio].forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

startGameButton.addEventListener('click', () => {
    selectedCategory = categorySelect.value;
    initGame();
});

function initGame() {
   
    const words = categoryWords[selectedCategory];
    selectedWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    guessedWord = Array(selectedWord.length).fill('_');
    wrongGuesses = 0;
    message.textContent = '';
    wrongLettersDisplay.textContent = 'Letras incorrectas: ';
    wordDisplay.textContent =guessedWord.join(' '); //cadena de texto
    updateHangmanImage(); 
    if (lettersContainer.childElementCount > 0) {
        resetButtons();
    } else {
        generateLetterButtons();
    }
    gameContent.style.display = 'block'; // Muestra el contenido del juego
    categoryContainer.style.display = 'none'; // Oculta la selección de categoría
}

function handleLetterInput(letter, button) {
    if (button) button.disabled = true;

    if (selectedWord.includes(letter)) {
        
        selectedWord.split('').forEach((char, index) => {  //!
            if (char === letter) 
                guessedWord[index] = letter;
        });
        wordDisplay.textContent = guessedWord.join(' ');

        if (!guessedWord.includes('_')) {
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
        
        wrongGuesses++;
        wrongLettersDisplay.textContent += `${letter} `;
        updateHangmanImage();

        if (wrongGuesses === maxWrongGuesses) {
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
            angle: Math.random() * 360, //aleatorio (de 0° a 360°) para dispersar los confetis en diferentes direcciones
           
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
    
}

function endGame() {
    // const buttons = document.querySelectorAll('.letter-btn');
    // for (let i = 0; i < buttons.length; i++) {
    //     buttons[i].disabled = true; // Deshabilita cada botón
    // }
     document.querySelectorAll('.letter-btn').forEach(btn => (btn.disabled = true)); //con callback

}

restartButton.addEventListener('click', () => {
    stopAllAudios(); // Detiene cualquier música en curso al reiniciar
    gameContent.style.display = 'none'; // Oculta el contenido del juego
    categoryContainer.style.display = 'block'; // Muestra la selección de categoría
});

// Permite escribir letras con el teclado
document.addEventListener('keydown', event => { // document, captura eventos globales en la página Este manejador capturará la tecla presionada sin importar dónde esté el usuario l objeto document te permite acceder y manipular cualquier parte de la página
    const letter = event.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) { 
        const button = Array.from(document.querySelectorAll('.letter-btn')).find(btn => btn.textContent === letter); //para poder usar el find
        if (button && !button.disabled) handleLetterInput(letter, button);
    }
});

// Oculta el contenido del juego al cargar
gameContent.style.display = 'none';
