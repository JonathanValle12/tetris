import Board from './board.js';
import Modal from './modal.js';
import Pieces from './pieces.js';

export default class Game {

    constructor(width, height, size) {

        this.width = width;
        this.height = height;
        this.size = size;
        
        // Instancias de clases
        this.board = new Board(this);
        this.modal = new Modal(this);
        this.pieces = new Pieces(this, this.board, this.modal);
        
        this.paused = false; // Variable si se ha indicado si el juego esta pausado o no
        this.timer = false; // Variable para almacenar el identificador del temporizador
        this.gameOver = false;

        this.puntos = 0;

        // Inicialización del tablero y piezas
        this.board.canva();
        this.board.inicialitzeBoard();
        this.boardColors = Array.from({ length: this.height}, () => Array(this.width).fill('#2f2f2f'));

        this.board.draw();
        this.pieces.drawPiece();

        // Reproducción de música
        this.audio = new Audio("../song/song.mp3");

        this.eventsAdded = false;
    }

    comenzarJuego() {

        // Evento de teclado si el juego no ha terminado, no está pausado y los eventos áun no se han añadido
        if(!this.gameOver && !this.paused && !this.eventsAdded) {
            document.addEventListener('keydown', this.pieces.movePiece.bind(this.pieces));

            this.upKeyPress = false;

            document.addEventListener('keydown', this.keyPressDown.bind(this));
            document.addEventListener('keyup', this.keyPressUp.bind(this));

            this.eventsAdded = true;
        }
    }

    // Función para manejar la tecla presionada
    keyPressDown() {
        this.upKeyPress = true;
    }

    // Función para manejar la tecla liberada
    keyPressUp() {
        this.upKeyPress = false;
    } 

    // Función para mover automáticamente las piezas hacia abajo
    timeoutMoveDown() {
        if (!this.timer) {
            // Establece un temporizador para el movimiento automático
            this.timer = setTimeout(() => {
                // Verificar si el juego no está pausado ni ha terminado
                if (!this.paused && !this.gameOver) {
                    let x = this.pieces.positionPiece.x;
                    let y = this.pieces.positionPiece.y + 1;
                    // Verificar si no hay colisión con otra pieza
                    if (!this.pieces.collision(x, y)) {
                        this.pieces.positionPiece.x = x;
                        this.pieces.positionPiece.y = y;
                        this.puntos++;
                        let score = document.getElementById('puntuacion');
                        score.innerHTML = this.puntos;
                        this.board.draw();
                        this.pieces.drawPiece();
                        // Continua el movimiento hacia abajo
                        this.timeoutMoveDown();
                    } else {
                        // Si hay colisión, suelta la pieza y maneja la situación
                        this.pieces.soltarPiece(x, y - 1);
                        if (this.pieces.positionPiece.y === 0) {
                            // Si la pieza alcanza la parte superior, verifica puntuación
                            if (!JSON.parse(localStorage.getItem('puntuacion')) || this.puntos >= JSON.parse(localStorage.getItem('puntuacion'))?.puntos) {
                                
                                this.gameOver = true;
                                this.modal.openModalScore();
                            } else {
                                
                            window.location.reload();
                            }
                            // Reiniciar el tablero y las piezas
                            this.board.inicialitzeBoard();
                            this.board.draw();
                            this.pieces.drawPiece();
                            this.pieces.positionPiece.x = 5;
                            this.pieces.positionPiece.y = 0;
                        } else {
                            this.gameOver = true;
                            this.modal.openModalScore();
                        }
                    }
                    // Restablece el temporizador
                    this.timer = false;
                    // Verificar si el juego está aún en curso antes de llamar a timeoutMoveDown()
                    if (!this.gameOver) {
                        this.timeoutMoveDown();
                    }
                }
            }, 1500);
        }
    }
    
}

// Instanciar nuevo juego con las dimensiones y tamaño
let juego = new Game(15, 18, 30);

// Evento click para inciar el juego
document.getElementById("start").addEventListener("click", () => {

    juego.modal.resume(); // Resumen del juego desde el modal

    juego.timeoutMoveDown(); // Comienza el movimiento automática hacia abajo de las piezas

    document.getElementById("pausar").removeAttribute("disabled"); // Habilitar el boton de pausa

    juego.audio.play(); // Reproducción de música

});

// Evento click para pausar el juego
document.getElementById("pausar").addEventListener("click", () => {
    juego.modal.pause(); // Pausar el juego desde el modal

    juego.audio.pause(); // Pausa la música
})

// Agregar evento input al campo de entrada 'name'
document.getElementById('name').addEventListener('input', () => {
    juego.modal.registrar_puntuacion(); // Verifica la longitud del nombre en tiempo real
});

if (JSON.parse(localStorage.getItem('puntuacion'))) {
    document.getElementById('record-punts').innerHTML = JSON.parse(localStorage.getItem('puntuacion')).puntos;
}