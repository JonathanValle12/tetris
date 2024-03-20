
class Game {

    constructor(width, height, size) {

        this.width = width;
        this.height = height;
        this.size = size;
        
        this.paused = false; // Variable si se ha indicado si el juego esta pausado o no
        this.timer = false; // Variable para almacenar el identificador del temporizador
        this.gameOver = false;

        this.positionPiece = { x: 6, y: 0 };
        this.puntos = 0;

        this.canva();
        this.inicialitzeBoard();
        this.boardColors = Array.from({ length: this.height}, () => Array(this.width).fill('#2f2f2f'));

        this.currentPieces = this.getRandomPieces();
        this.draw();
        this.drawPiece();
        
    }

    comenzarJuego() {

        if(!this.gameOver && !this.paused) {
            document.addEventListener('keydown', this.movePiece.bind(this));

            this.upKeyPress = false;

            document.addEventListener('keydown', this.keyPressDown.bind(this));
            document.addEventListener('keyup', this.keyPressUp.bind(this));
        }
    }

    keyPressDown() {
        this.upKeyPress = true;
    }

    keyPressUp() {
        this.upKeyPress = false;
    } 
    getRandomPieces() {
        const pieces = [
            { type: 'red', piece: [[1, 1], [1, 1]] },
            { type: 'blue', piece: [[1, 1, 1, 1]] },
            { type: 'orange', piece: [[1, 0], [1, 1], [1, 0]] },
            { type: 'yellow', piece: [[1, 1, 1], [0, 0, 1]] }
        ]

        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];

        this.currentPieceType = randomPiece.type;

        return randomPiece;
    }

    timeoutMoveDown() {
        if (!this.timer) {
            this.timer = setTimeout(() => {
            
                if (!this.paused && !this.gameOver) {
                    let x = this.positionPiece.x;
                let y = this.positionPiece.y + 1;
    
                if (!this.collision(x, y)) {
                    this.positionPiece.x = x;
                    this.positionPiece.y = y;
    
                    this.puntos++;
    
                    let score = document.getElementById('puntuacion');
    
                    score.innerHTML = this.puntos;

                    this.draw();
                    this.drawPiece();
                    this.timeoutMoveDown();
                } else{
                    this.soltarPiece(x, y - 1);
                    
                    if (this.positionPiece.y === 0) {
                        this.gameOver = true;
                        console.log(JSON.parse(localStorage.getItem('puntuacion'))?.puntos);
                        if (!JSON.parse(localStorage.getItem('puntuacion')) ||this.puntos >= JSON.parse(localStorage.getItem('puntuacion'))?.puntos) {
                            this.openModalScore();
                        }
                        this.inicialitzeBoard();
                        
                        this.draw();
                        this.drawPiece()
                        this.positionPiece.x = 5;
                        this.positionPiece.y = 0;
                    } else {
                        this.positionPiece.x = Math.floor(Math.random() * this.width / 2);
                        this.positionPiece.y = 0;                    
                        this.draw();
                        this.drawPiece();
                        this.timeoutMoveDown();
                    }
                }
                this.timer = false;
                this.timeoutMoveDown();
                }
            }, 1500);
        }
    }

    openModalScore() {

        clearInterval(this.timer);

        let modal_score_save = document.getElementById('modal-score');

        modal_score_save.style.display = 'block';

        let ver_puntuacion = document.getElementById('ver_puntuacion');

        ver_puntuacion.innerHTML = `${this.puntos} puntos`;
    }
    
    pause() {
        this.paused = true;
        clearInterval(this.timer);

        // Ocultar el modal cuando se pausa el juego
        let modal_game = document.getElementById("modal-game");
        modal_game.style.display = 'block'; // Cambia 'block' por 'none' para ocultarlo
    }

    resume() {
        if (this.paused) {
            this.paused = false;
            this.timer = false;
            this.timeoutMoveDown();   
        }
        
            // Ocultar el modal al reanudar el juego
            let modal_game = document.getElementById("modal-game");
            modal_game.style.display = 'none'; 
            
            this.comenzarJuego();
    }

    canva() {

        this.canvas = document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.width = this.size * this.width
        this.canvas.height = this.size * this.height

        this.context.fillStyle = '#3f3f3f'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    inicialitzeBoard() {
        this.board = Array(this.height).fill().map(() => Array(this.width).fill(0));

    }

    draw() {
        this.context.fillStyle = '#3f3f3f';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        let convert = Math.min(this.canvas.width / this.width, this.canvas.height / this.height);

        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) {
                    this.context.fillStyle = this.boardColors[y][x];
                    this.context.fillRect(x * convert, y * convert, convert, convert);
                }

                this.context.strokeStyle = '#000';
                this.context.strokeRect(x * convert, y * convert, convert, convert);
            })
        })
    }

    drawPiece() {
        let convert = Math.min(this.canvas.width / this.width, this.canvas.height / this.height);

        this.context.fillStyle = this.currentPieces.type;
        
        this.currentPieces.piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) {
                    let posX = (this.positionPiece.x + x) * convert;
                    let posY = (this.positionPiece.y + y) * convert;

                    this.context.fillRect(posX, posY, convert, convert);
                    
                    this.context.strokeStyle = 'rgba(0, 0, 0, .5)';
                    this.context.strokeRect(posX, posY, convert, convert);               
                }
                
            })
        })

        this.drawShadow();
    }

    movePiece(event) {
        if (!this.gameOver) {
            let pieceX = this.positionPiece.x;
        let pieceY = this.positionPiece.y;

        switch (event.code) {
            case "ArrowLeft":
                pieceX--
                if (this.collision(pieceX, pieceY)) {
                    pieceX++
                }
                break;
            case "ArrowRight":
                pieceX++
                if (this.collision(pieceX, pieceY)) {
                    pieceX--
                }
                break;
            case "ArrowUp":

                if (!this.upKeyPress) {
                    let rotatePiece = this.currentPieces.piece[0].map((_, i) => this.currentPieces.piece.map(row => row[i]).reverse());
                    this.upKeyPress = false;

                    let previousPiece = this.currentPieces.piece;

                    this.currentPieces.piece = rotatePiece;

                    if (this.collision(pieceX, pieceY)) {
                        this.currentPieces.piece = previousPiece;
                    }
                }
                break
            case "ArrowDown":
                pieceY++
                if (this.collision(pieceX, pieceY)) {
                    pieceY--
                }
                this.puntos++;

                let score = document.getElementById('puntuacion');

                score.innerHTML = this.puntos;  
                
                if (event.key == 'ArrowDown' && this.collision(pieceX, pieceY + 1)) {
                    this.soltarPiece(pieceX, pieceY);
                    pieceX = Math.floor(Math.random() * this.width / 2);
                    pieceY = 0;

                    if (this.collision(pieceX, pieceY)) {
                        if (JSON.parse(localStorage.getItem('puntuacion'))) {
                            this.openModalScore();
                        }
                    }
                }

                break;
            case 'Space':
                let newY = pieceY;
                while (!this.collision(pieceX, newY + 1)) {
                    newY++;
                }
                if (newY !== pieceY) {
                    this.soltarPiece(pieceX, newY);
                    pieceX = Math.floor(Math.random() * this.width / 2);
                    pieceY = 0;
                    this.puntos += 34;

                    let score2 = document.getElementById('puntuacion');
    
                    score2.innerHTML = this.puntos;  
                }

                if (newY === 0) {
                    console.log(JSON.parse(localStorage.getItem('puntuacion'))?.puntos);

                    if (!JSON.parse(localStorage.getItem('puntuacion')) || this.puntos >= JSON.parse(localStorage.getItem('puntuacion'))?.puntos) {
                        this.gameOver = true;
                        this.openModalScore();
                    } else {
                        window.location.reload();
                    }
                }
                break;
        }

        this.positionPiece.x = pieceX;
        this.positionPiece.y = pieceY;

        this.draw();
        this.drawPiece();   
        }
    }

    collision(x, y) {

        return this.currentPieces.piece.some((row, rowIndex) => {
            return row.some((value, colIndex) => {

                if (value) {
                    const boardX = x + colIndex;
                    const boardY = y + rowIndex;

                    if (boardX < 0 || boardX >= this.width || boardY >= this.height) {
                        return true;
                    }
                    if (boardY >= 0 && value == 1 && this.board[boardY][boardX] == 1) {
                        return true;
                    }

                    return false;
                }
            })
        })
    }

    limpiarFila() {
        
        for (let i = this.height - 1; i >= 0; i--) {

            if (this.board[i].every(row => row == 1)) {
                this.board.splice(i, 1);
                this.board.unshift(Array(this.width).fill(0));
            }
        }
    }

    drawShadow() {
        let cellSize = Math.min(this.canvas.width / this.width, this.canvas.height / this.height);
        let shadowX = this.positionPiece.x;
        let shadowY = this.positionPiece.y;

        while (!this.collision(shadowX, shadowY + 1)) {
            shadowY++;
        }

        this.context.fillStyle = 'rgba(0, 0, 0, .5)';

        this.currentPieces.piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) {
                    let shadowPosX = (shadowX + x) * cellSize;
                    let shadowPosY = (shadowY + y) * cellSize;

                    this.context.fillRect(shadowPosX, shadowPosY, cellSize,cellSize);
                }
            })
        })
    }

    soltarPiece(x, y) {
        
        this.currentPieces.piece.forEach((row, yIndex) => {
            row.forEach((value, xIndex) => {
                if (value) {

                    this.boardColors[y + yIndex][x + xIndex] = this.currentPieces.type;
                    this.context.fillStyle = this.currentPieces.type;
                    if (y + yIndex >= 0 && y + yIndex < this.height && x + xIndex >= 0 && x + xIndex < this.width) {
                        this.board[y + yIndex][x + xIndex] = 1;
                    }
                }
            })
        })
        this.limpiarFila();
        this.currentPieces = this.getRandomPieces();
    }  
    
    registrar_puntuacion() {
        let name = document.getElementById('name').value;

        let button = document.getElementById('registrar_save');
        if (name.length >= 3) {
            console.log(name);
            button.classList.add('button_save');

            button.addEventListener('click', () => {
                
                let modal = document.getElementById('modal-score');
        
                let datos = {
                    name: name,
                    puntos: this.puntos
                }
    
                localStorage.setItem('puntuacion', JSON.stringify(datos));
                modal.style.display = 'none';
                window.location.reload();

            })
        } else {
            button.classList.remove('button_save');
        }

    }

}

let juego = new Game(15, 18, 30);

document.getElementById("start").addEventListener("click", () => {

    juego.resume();

    juego.timeoutMoveDown();
    document.getElementById("pausar").removeAttribute("disabled");

});

document.getElementById("pausar").addEventListener("click", () => {
    juego.pause();
})
// Agregar evento input al campo de entrada 'name'
document.getElementById('name').addEventListener('input', () => {
    juego.registrar_puntuacion(); // Verifica la longitud del nombre en tiempo real
});

if (JSON.parse(localStorage.getItem('puntuacion'))) {
    document.getElementById('record-punts').innerHTML = JSON.parse(localStorage.getItem('puntuacion')).puntos;
}
