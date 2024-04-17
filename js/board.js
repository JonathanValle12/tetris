
class Board {

    constructor(game) {
        this.game = game; // Referencia al juego
    }

    // Configuración del lienzo del juego
    canva() {
        // Obtención del lienzo y su contexto
        this.canvas = document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");

        // Establece las dimensiones del lienzo según el tamaño del juego
        this.canvas.width = this.game.size * this.game.width
        this.canvas.height = this.game.size * this.game.height

        // Dibuja un fondo en el lienzo
        this.context.fillStyle = '#3f3f3f'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    // Inicializa el tablero del juego
    inicialitzeBoard() {
        // Crea un tablero vacio con las dimensiones del juego
        this.board = Array(this.game.height).fill().map(() => Array(this.game.width).fill(0));
    }
    
    // Dibuja el tablero en el lienzo
    draw() {
        // Dibuja un fondo en el lienzo
        this.context.fillStyle = '#3f3f3f';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Calcular el tamaño de cada celda del tablero
        let convert = Math.min(this.canvas.width / this.game.width, this.canvas.height / this.game.height);

        // Recorrer el tablero y dibujar cada celda
        this.board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) {
                    // Dibujar una celda activa con el color correspondiente
                    this.context.fillStyle = this.game.boardColors[y][x];
                    this.context.fillRect(x * convert, y * convert, convert, convert);
                }

                // Dibuja el borde de cada celda
                this.context.strokeStyle = '#000';
                this.context.strokeRect(x * convert, y * convert, convert, convert);
            })
        })
    }

    // Limpia las filas completas del tablero
    limpiarFila() {
        
        // Itera sobre todas las filas del tablero
        for (let i = this.game.height - 1; i >= 0; i--) {
            // Verifica si la fila está completa (todos los valores son 1)
            if (this.board[i].every(row => row == 1)) {
                // Elimina la fila completa y agrega una nueva fila vacía en la parte superior
                this.board.splice(i, 1);
                this.board.unshift(Array(this.game.width).fill(0));
            }
        }
    }
}

export default Board;