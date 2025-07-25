class Modal {

    constructor(game) {

        this.game = game; // Referencia al juego
    }

    // Función para pausar el juego
    pause() {

        if (this.game.paused) {
            this.game.paused = false; // Indica que el juego está pausado
            document.getElementById('contenedor-menu').style.display = "none";

            this.game.timer = false;
            this.game.timeoutMoveDown();


            this.game.audio.play();
        } else {
            this.game.paused = true;
            document.getElementById('contenedor-menu').style.display = "flex";

            this.game.audio.pause();
        }
    }

    // Función para registrar la puntuación del jugador
    registrar_puntuacion() {

        const recordActual = JSON.parse(localStorage.getItem('puntuacion'))?.puntos || 0;
        
        if (this.game.puntos > recordActual) {
            localStorage.setItem('puntuacion', JSON.stringify({ puntos: this.game.puntos }));

            document.getElementById('record-punts').innerHTML = this.game.puntos;
        }

    }


    updateModalContent(estado) {
        const contenedor = document.getElementById('contenedor-menu');

        contenedor.style.display = "flex";
        const t = contenedor.querySelector('#menu-titulo');
        const m = contenedor.querySelector('#menu-mensaje');
        const b = contenedor.querySelector('#start');

        const config = {
            inicio: {
                titulo: "Tetris",
                mensaje: 'Presiona "Comenzar Juego"',
                boton: ["inline", "Comenzar Juego", false]
            },
            pausa: {
                titulo: "Pausado",
                mensaje: "Presiona 'P' para reanudar",
                boton: ["none", "", true]
            },
            fin: {
                titulo: "Fin de partida",
                mensaje: `Puntuación final: ${this.game.puntos}`,
                boton: ["none", "", true]
            }
        }

        const { titulo, mensaje, boton } = config[estado];
        t.textContent = titulo;
        m.textContent = mensaje;
        b.style.display = boton[0];

        if (boton[1]) b.textContent = boton[1];
        b.disabled = boton[2];
    }
}

export default Modal;