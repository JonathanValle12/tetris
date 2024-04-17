class Modal {

    constructor (game) {

        this.game = game; // Referencia al juego
    }

    // Función para abrir el modal de puntuación
    openModalScore() {

        // Detiene el temporizador del juego
        clearInterval(this.game.timer);

        let modal_score_save = document.getElementById('modal-score');

        modal_score_save.style.display = 'block';

        let ver_puntuacion = document.getElementById('ver_puntuacion');

        ver_puntuacion.innerHTML = `${this.game.puntos} puntos`;

        // Pausa la música del juego
        this.game.audio.pause();

    }

    // Función para pausar el juego
    pause() {
        this.game.paused = true; // Indica que el juego está pausado
        clearInterval(this.game.timer); // Detiene el temporizador del juego

        // Ocultar el modal cuando se pausa el juego
        let modal_game = document.getElementById("modal-game");
        modal_game.style.display = '';

    }

    // Función para reanudar el juego
    resume() {
        
        if (this.game.paused) {
            // Reanuda el jeugo si esta pausado
            this.game.paused = false;
            this.game.timer = false;
            this.game.timeoutMoveDown();   
        }
        
            // Ocultar el modal al reanudar el juego
            let modal_game = document.getElementById("modal-game");
            modal_game.style.display = 'none';
            
            this.game.comenzarJuego();
    }

    // Función para registrar la puntuación del jugador
    registrar_puntuacion() {
        let name = document.getElementById('name').value;

        let button = document.getElementById('registrar_save');
        if (name.length >= 3) {
            
            button.classList.add('button_save'); // Agregar clase para habilitar el boton de guardar

            // Evento click para guardar la puntuación
            button.addEventListener('click', () => {
                
                let modal = document.getElementById('modal-score');
        
                // Datos a almacenar en el almacenamiento local
                let datos = {
                    name: name,
                    puntos: this.game.puntos
                }
    
                // Almacenar los datos en el localStorage
                localStorage.setItem('puntuacion', JSON.stringify(datos));
                modal.style.display = 'none';
                window.location.reload(); // Recarga la página para mostrar la puntuación

            })
        } else {
            button.classList.remove('button_save'); // Remueve la clase para deshabilitar el botón de guardar
        }

    }
}

export default Modal;