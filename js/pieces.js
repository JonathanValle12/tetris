
class Pieces {
    constructor(game, board, modal) {

        this.game = game;
        this.board = board;
        this.modal = modal;
        
        this.positionPiece = { x: 6, y: 0 };
        this.currentPieces = this.getRandomPieces();
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

        this.drawShadow();
    }

    movePiece(event) {
        if (!this.game.gameOver) {
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
                    pieceY++
                    if (this.collision(pieceX, pieceY)) {
                        pieceY--
                    }
                    this.game.puntos++;

                    let score = document.getElementById('puntuacion');

                    score.innerHTML = this.game.puntos;

                    if (event.key == 'ArrowDown' && this.collision(pieceX, pieceY + 1)) {
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
                    let newY = pieceY;
                    while (!this.collision(pieceX, newY + 1)) {
                        newY++;
                    }
                    if (newY !== pieceY) {
                        console.log(pieceY);
                        this.soltarPiece(pieceX, newY);
                        pieceX = Math.floor(Math.random() * this.game.width / 2);
                        pieceY = 0;

                        this.game.puntos += 34;

                        let score2 = document.getElementById('puntuacion');

                        score2.innerHTML = this.game.puntos;
                    }

                    if (newY === 0) {
                        console.log(JSON.parse(localStorage.getItem('puntuacion'))?.puntos);

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

            this.board.draw();
            this.drawPiece();
        }
    }

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
        this.board.limpiarFila();
        this.currentPieces = this.getRandomPieces();
    }

    drawShadow() {
        let cellSize = Math.min(this.board.canvas.width / this.game.width, this.board.canvas.height / this.game.height);
        let shadowX = this.positionPiece.x;
        let shadowY = this.positionPiece.y;

        while (!this.collision(shadowX, shadowY + 1)) {
            shadowY++;
        }

        this.board.context.fillStyle = 'rgba(0, 0, 0, .5)';

        this.currentPieces.piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) {
                    let shadowPosX = (shadowX + x) * cellSize;
                    let shadowPosY = (shadowY + y) * cellSize;

                    this.board.context.fillRect(shadowPosX, shadowPosY, cellSize, cellSize);
                }
            })
        })
    }

    collision(x, y) {

        return this.currentPieces.piece.some((row, rowIndex) => {
            return row.some((value, colIndex) => {

                if (value) {
                    const boardX = x + colIndex;
                    const boardY = y + rowIndex;

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