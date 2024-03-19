class Modal {

    constructor () {

        this.paused = false; // Variable si se ha indicado si el juego esta pausado o no
        this.timer = false; // Variable para almacenar el identificador del temporizador
        this.gameOver = false;
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
}