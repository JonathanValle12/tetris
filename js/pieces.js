
class Pieces {
    constructor(game, board, modal) {

        this.game = game; // Referencia al juego
        this.board = board; // Referencia al tablero
        this.modal = modal; // Referencia al modal
        
        this.positionPiece = { x: 6, y: 0 }; // Posición inicial de la pieza
        this.currentPieces = this.getRandomPieces(); // Pieza actual
    }

    // Obtiene una pieza aleatoria del conjunto predefinido
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

    // Dibuja la pieza actual en el tablero
    drawPiece() {
        let convert = Math.min(this.board.canvas.width / this.game.width, this.board.canvas.height / this.game.height);

        this.board.context.fillStyle = this.currentPieces.type;

        this.currentPieces.piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) {
                    let posX = (this.positionPiece.x + x) * convert;
                    let posY = (this.positionPiece.y + y) * convert;

                    this.board.context.fillRect(posX, posY, convert, convert);

                    this.board.context.strokeStyle = 'rgba(0, 0, 0, .5)';
                    this.board.context.strokeRect(posX, posY, convert, convert);
                }
            })
        })

        this.drawShadow(); // Dibuja la sombra de la pieza
    }

    // Maneja el movimiento de la pieza según las teclas presionadas
    movePiece(event) {
        if (!this.game.gameOver) {
            let pieceX = this.positionPiece.x;
            let pieceY = this.positionPiece.y;

            switch (event.code) {
                case "ArrowLeft":
                    // Mueve la pieza hacia la izquierda si no hay colisión
                    pieceX--
                    if (this.collision(pieceX, pieceY)) {
                        pieceX++
                    }
                    break;
                case "ArrowRight":
                    // Mueve la pieza hacia la derecha si no hay colision
                    pieceX++
                    if (this.collision(pieceX, pieceY)) {
                        pieceX--
                    }
                    break;
                case "ArrowUp":
                    // Rota la pieza si no hay colisión
                    if (!this.game.upKeyPress) {
                        let rotatePiece = this.currentPieces.piece[0].map((_, i) => this.currentPieces.piece.map(row => row[i]).reverse());
                        this.game.upKeyPress = false;

                        let previousPiece = this.currentPieces.piece;

                        this.currentPieces.piece = rotatePiece;

                        if (this.collision(pieceX, pieceY)) {
                            this.currentPieces.piece = previousPiece;
                        }
                    }
                    break
                case "ArrowDown":
                    // Mueve la pieza hacia abajo si no hay colisión
                    pieceY++
                    if (this.collision(pieceX, pieceY)) {
                        pieceY--
                    }
                    this.game.puntos++; // Incrementa los puntos del juego

                    let score = document.getElementById('puntuacion');

                    score.innerHTML = this.game.puntos; // Actualiza la puntuación en el marcador

                    if (event.key == 'ArrowDown' && this.collision(pieceX, pieceY + 1)) {
                        // Suelta la pieza si llega al fondo del tablero
                        this.soltarPiece(pieceX, pieceY);
                        pieceX = Math.floor(Math.random() * this.game.width / 2);
                        pieceY = 0;

                        if (this.collision(pieceX, pieceY)) {
                            if (JSON.parse(localStorage.getItem('puntuacion'))) {
                                this.modal.openModalScore();
                            }
                        }
                    }

                    break;
                case 'Space':
                    // Suelta la pieza hasta el fondo del tablero
                    let newY = pieceY;
                    while (!this.collision(pieceX, newY + 1)) {
                        newY++;
                    }
                    if (newY !== pieceY) {
                        this.soltarPiece(pieceX, newY);
                        pieceX = Math.floor(Math.random() * this.game.width / 2);
                        pieceY = 0;

                        this.game.puntos += 34;

                        let score2 = document.getElementById('puntuacion');

                        score2.innerHTML = this.game.puntos;
                    }

                    if (newY === 0) {
                        // Finaliza el juego si la pieza alcanza la parte superior del tablero
                        if (!JSON.parse(localStorage.getItem('puntuacion')) || this.game.puntos >= JSON.parse(localStorage.getItem('puntuacion'))?.puntos) {
                            this.gameOver = true;
                            this.modal.openModalScore();
                        } else {
                            window.location.reload();
                        }
                    }
                    break;
            }

            this.positionPiece.x = pieceX;
            this.positionPiece.y = pieceY;

            this.board.draw(); // Redibuja el tablero
            this.drawPiece(); // Dibuja la pieza actual
        }
    }

    // Suelta la pieza en la posición especifica
    soltarPiece(x, y) {

        this.currentPieces.piece.forEach((row, yIndex) => {
            row.forEach((value, xIndex) => {
                if (value) {

                    this.game.boardColors[y + yIndex][x + xIndex] = this.currentPieces.type;
                    this.board.context.fillStyle = this.currentPieces.type;
                    if (y + yIndex >= 0 && y + yIndex < this.game.height && x + xIndex >= 0 && x + xIndex < this.game.width) {
                        this.board.board[y + yIndex][x + xIndex] = 1;
                    }
                }
            })
        })
        this.board.limpiarFila(); // Limpia las filas completas del tablero
        this.currentPieces = this.getRandomPieces(); // Obtiene una nueva pieza aleatoria
    }

    // Dibuja la sombra de la pieza
    drawShadow() {
        let cellSize = Math.min(this.board.canvas.width / this.game.width, this.board.canvas.height / this.game.height);
        let shadowX = this.positionPiece.x;
        let shadowY = this.positionPiece.y;

        // Busca la posición Y de la sombra
        while (!this.collision(shadowX, shadowY + 1)) {
            shadowY++;
        }

        // Dibuja la sombra de la pieza en el tablero
        this.board.context.fillStyle = 'rgba(0, 0, 0, .5)'; // Establece el color de la sombra

        this.currentPieces.piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) {
                    let shadowPosX = (shadowX + x) * cellSize; // Posición X de la celda
                    let shadowPosY = (shadowY + y) * cellSize; // Posición Y de la celda

                    this.board.context.fillRect(shadowPosX, shadowPosY, cellSize, cellSize);
                }
            })
        })
    }

    // Verifica si hay colisión entre la pieza y el tablero en la posición especifica
    collision(x, y) {

        return this.currentPieces.piece.some((row, rowIndex) => {
            return row.some((value, colIndex) => {

                if (value) {
                    const boardX = x + colIndex;
                    const boardY = y + rowIndex;

                    // Verifica si la posición está fuera del tablero o si no hay colisión con una pieza existente en el tablero
                    if (boardX < 0 || boardX >= this.game.width || boardY >= this.game.height) {
                        return true;
                    }
                    if (boardY >= 0 && value == 1 && this.board.board[boardY][boardX] == 1) {
                        return true;
                    }

                    return false;
                }
            })
        })
    }
}

export default Pieces;