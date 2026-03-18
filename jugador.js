import { Entidad } from './entidad.js';
import { Animador } from './animador.js';

export class Jugador extends Entidad {
    constructor(gridX, gridY, nombre, mapa) {
        super(gridX, gridY, 64, 64, null);
        
        this.mapa = mapa;
        this.nombre = nombre;
        this.estadoActual = 'IDLE_ABAJO';
        this.velocidad = 4;

        this.x = gridX;
        this.y = gridY;

        this.hitBoxX = 62;
        this.hitBoxY = 62;

        //WIP global porque ambos, networked y local lo usaran
        this.estadoActual = "IDLE_ABAJO";
        this.ultimaDireccion = "ABAJO";


                this.IdleAnimator = new Animador('./assets/idle_player.png',16,16);
                this.WalkAnimator = new Animador('./assets/walk_player.png',16,16);
        
                this.sprite = new Animador('./assets/idle_player.png', 16, 16);
                
                this.animaciones = {
                    'IDLE_ABAJO':   { fila: 0, frames: 4, velocidad: 12 },
                    'IDLE_ARRIBA':  { fila: 4, frames: 4, velocidad: 12 },
                    'IDLE_IZQUIERDA': {fila:5, frames: 4, velocidad: 12},
                    'IDLE_DERECHA':{fila:2, frames: 4, velocidad: 12},
        
                    'WALK_ABAJO':   { fila: 0, frames: 4, velocidad: 12 },
                    'WALK_ARRIBA':  { fila: 4, frames: 4, velocidad: 12 },
                    'WALK_IZQUIERDA': {fila:5, frames: 4, velocidad: 12},
                    'WALK_DERECHA':{fila:2, frames: 4, velocidad: 12}
        
                };

                    this.input = {
            pressed: {},  // Teclas que están bajadas actualmente
            justPressed: {} // Teclas que se acaban de pulsar en este instante
        };
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            // Si la tecla no estaba ya pulsada, significa que se acaba de pulsar ahora
            if (!this.input.pressed[key]) {
                this.input.justPressed[key] = true;
            }
            this.input.pressed[key] = true;
        });

        window.addEventListener("keyup", (e) => {
            const key = e.key.toLowerCase();
            this.input.pressed[key] = false;
            this.input.justPressed[key] = false;
});
    }


    dibujar(ctx, camara) {
       // this.actualizarSuavizado();


        if(camara.estaMoviendose()){
         this.auxX = -Math.floor(camara.x); 
         this.auxY =   -Math.floor(camara.y); 
        }

        const screenX = Math.floor(this.x - camara.x) - this.auxX;
        const screenY = Math.floor(this.y - camara.y) - this.auxY;

        const anim = this.animaciones[this.estadoActual];
        

        this.sprite.dibujar(ctx, screenX - 13, screenY, this.ancho, this.alto, anim.fila, 2, 4, true);
        const config = this.animaciones[this.estadoActual];
        this.sprite.actualizar(config.frames, config.velocidad);

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(this.nombre, screenX + this.ancho/2 - 4, screenY - 5);
    }

    

    swapAnimator(anim){
        if(anim != this.sprite){
            this.sprite = anim;
            this.sprite.frameActual = 0;
        }
    }
}