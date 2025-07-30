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

        this.isPlaying = false;
        this.paused = false; // Variable si se ha indicado si el juego esta pausado o no
        this.timer = false; // Variable para almacenar el identificador del temporizador
        this.gameOver = false;

        this.puntos = 0;

        // Inicialización del tablero y piezas
        this.board.canva();
        this.boardColors = Array.from({ length: this.height }, () => Array(this.width).fill('#2f2f2f'));

        // Reproducción de música
        this.audio = new Audio("../song/song.mp3");

        this.eventsAdded = false;

        this.boundMovePiece = this.pieces.movePiece.bind(this.pieces);
        this.boundKeyDown = this.keyPressDown.bind(this);
        this.boundKeyUp = this.keyPressUp.bind(this);
    }

    comenzarJuego() {
        if (!this.eventsAdded) {
            document.addEventListener('keydown', this.boundMovePiece);
            document.addEventListener('keydown', this.boundKeyDown);
            document.addEventListener('keyup', this.boundKeyUp);
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
                        if (this.pieces.positionPiece.y <= 0) {
                            this.gameOver = true;
                            this.modal.updateModalContent("fin");
                            this.modal.registrar_puntuacion();
                            this.audio.pause();
                            return;
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

    iniciarPartida() {
        this.isPlaying = true;
        this.paused = false;
        this.gameOver = false;
        this.puntos = 0;

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = false;
        }

        if (this.eventsAdded) {
            document.removeEventListener('keydown', this.pieces.movePiece);
            document.removeEventListener('keydown', this.keyPressDown);
            document.removeEventListener('keyup', this.keyPressUp);
            this.eventsAdded = false;
        }

        this.pieces.positionPiece = { x: 6, y: 0 };
        this.pieces.currentPieces = this.pieces.getRandomPieces();

        // Reset de tablero visual
        this.boardColors = Array.from({ length: this.height }, () => Array(this.width).fill('#2f2f2f'));
        this.board.inicialitzeBoard();
        this.board.draw();
        this.pieces.drawPiece();

        // Ocultar menú / Mostrar botón de reiniciar
        document.getElementById('contenedor-menu').style.display = 'none';
        document.getElementById('reiniciar').style.display = 'inline';
        document.getElementById("puntuacion").textContent = "0";

        // Música desde el principio
        this.audio.currentTime = 0;
        this.audio.play();

        // Eventos de teclado y caída automática
        this.comenzarJuego();
        this.timeoutMoveDown();
    }

}

// Instanciar nuevo juego con las dimensiones y tamaño
let juego = new Game(10, 20, 30);

// Evento click para inciar el juego
document.getElementById("start").addEventListener("click", () => {

    juego.iniciarPartida();
});

document.getElementById('reiniciar').addEventListener('click', () => {
    juego.iniciarPartida();
})

// Evento click para pausar el juego
document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "p") {

        if (juego.isPlaying && !juego.gameOver) {
            juego.modal.updateModalContent("pausa");
            juego.modal.pause(); // Pausar el juego desde el modal
        }
    }
})

if (JSON.parse(localStorage.getItem('puntuacion'))) {
    document.getElementById('record-punts').innerHTML = JSON.parse(localStorage.getItem('puntuacion')).puntos;
}