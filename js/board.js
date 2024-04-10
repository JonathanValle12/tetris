
class Board {

    constructor(game) {
        this.game = game;
    }

    canva() {

        this.canvas = document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");

        this.canvas.width = this.game.size * this.game.width
        this.canvas.height = this.game.size * this.game.height

        this.context.fillStyle = '#3f3f3f'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    inicialitzeBoard() {
        this.board = Array(this.game.height).fill().map(() => Array(this.game.width).fill(0));

    }

    draw() {
        this.context.fillStyle = '#3f3f3f';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        let convert = Math.min(this.canvas.width / this.game.width, this.canvas.height / this.game.height);

        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) {
                    this.context.fillStyle = this.game.boardColors[y][x];
                    this.context.fillRect(x * convert, y * convert, convert, convert);
                }

                this.context.strokeStyle = '#000';
                this.context.strokeRect(x * convert, y * convert, convert, convert);
            })
        })
    }

    limpiarFila() {
        
        for (let i = this.game.height - 1; i >= 0; i--) {

            if (this.board[i].every(row => row == 1)) {
                this.board.splice(i, 1);
                this.board.unshift(Array(this.game.width).fill(0));
            }
        }
    }
}

export default Board;