import Board from './board.js';
import Modal from './modal.js';
import Pieces from './pieces.js';

export default class Game {

    constructor(width, height, size) {

        this.width = width;
        this.height = height;
        this.size = size;
        
        this.board = new Board(this);
        this.modal = new Modal(this);
        this.pieces = new Pieces(this, this.board, this.modal);
        
        this.paused = false; // Variable si se ha indicado si el juego esta pausado o no
        this.timer = false; // Variable para almacenar el identificador del temporizador
        this.gameOver = false;

        this.puntos = 0;

        this.board.canva();
        this.board.inicialitzeBoard();
        this.boardColors = Array.from({ length: this.height}, () => Array(this.width).fill('#2f2f2f'));

        this.board.draw();
        this.pieces.drawPiece();

        this.audio = new Audio("../song/song.mp3");

        this.eventsAdded = false;
    }

    comenzarJuego() {

        if(!this.gameOver && !this.paused && !this.eventsAdded) {
            document.addEventListener('keydown', this.pieces.movePiece.bind(this.pieces));

            this.upKeyPress = false;

            document.addEventListener('keydown', this.keyPressDown.bind(this));
            document.addEventListener('keyup', this.keyPressUp.bind(this));

            this.eventsAdded = true;
        }
    }

    keyPressDown() {
        this.upKeyPress = true;
    }

    keyPressUp() {
        this.upKeyPress = false;
    } 

    timeoutMoveDown() {
        if (!this.timer) {
            this.timer = setTimeout(() => {
                if (!this.paused && !this.gameOver) {
                    let x = this.pieces.positionPiece.x;
                    let y = this.pieces.positionPiece.y + 1;
                    if (!this.pieces.collision(x, y)) {
                        this.pieces.positionPiece.x = x;
                        this.pieces.positionPiece.y = y;
                        this.puntos++;
                        let score = document.getElementById('puntuacion');
                        score.innerHTML = this.puntos;
                        this.board.draw();
                        this.pieces.drawPiece();
                        this.timeoutMoveDown();
                    } else {
                        this.pieces.soltarPiece(x, y - 1);
                        if (this.pieces.positionPiece.y === 0) {
                            if (!JSON.parse(localStorage.getItem('puntuacion')) || this.puntos >= JSON.parse(localStorage.getItem('puntuacion'))?.puntos) {
                                
                                this.gameOver = true;
                                this.modal.openModalScore();
                            } else {
                                
                            window.location.reload();
                            }
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

let juego = new Game(15, 18, 30);

document.getElementById("start").addEventListener("click", () => {

    juego.modal.resume();

    juego.timeoutMoveDown();

    document.getElementById("pausar").removeAttribute("disabled");

    juego.audio.play();

});

document.getElementById("pausar").addEventListener("click", () => {
    juego.modal.pause();

    juego.audio.pause();
})
// Agregar evento input al campo de entrada 'name'
document.getElementById('name').addEventListener('input', () => {
    juego.modal.registrar_puntuacion(); // Verifica la longitud del nombre en tiempo real
});

if (JSON.parse(localStorage.getItem('puntuacion'))) {
    document.getElementById('record-punts').innerHTML = JSON.parse(localStorage.getItem('puntuacion')).puntos;
}