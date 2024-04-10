class Modal {

    constructor (game) {

        this.game = game;
    }

    openModalScore() {

        clearInterval(this.game.timer);

        let modal_score_save = document.getElementById('modal-score');

        modal_score_save.style.display = 'block';

        let ver_puntuacion = document.getElementById('ver_puntuacion');

        ver_puntuacion.innerHTML = `${this.game.puntos} puntos`;

        this.game.audio.pause();

    }

    pause() {
        this.game.paused = true;
        clearInterval(this.game.timer);

        // Ocultar el modal cuando se pausa el juego
        let modal_game = document.getElementById("modal-game");
        modal_game.style.display = '';

    }

    resume() {
        
        if (this.game.paused) {
            this.game.paused = false;
            this.game.timer = false;
            this.game.timeoutMoveDown();   
        }
        
            // Ocultar el modal al reanudar el juego
            let modal_game = document.getElementById("modal-game");
            modal_game.style.display = 'none';
            
            this.game.comenzarJuego();
    }

    registrar_puntuacion() {
        let name = document.getElementById('name').value;

        let button = document.getElementById('registrar_save');
        if (name.length >= 3) {
            
            button.classList.add('button_save');

            button.addEventListener('click', () => {
                
                let modal = document.getElementById('modal-score');
        
                let datos = {
                    name: name,
                    puntos: this.game.puntos
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

export default Modal;