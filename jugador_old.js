import { Entidad } from './entidad.js';
import { Animador } from './animador.js';
import { Cofre } from './cofre.js';

export class Jugador extends Entidad {
    constructor(x, y,mapa,debug = false) {
        super(x, y, 64, 64, null);

        this.hitBoxX = 50;
        this.hitBoxY = 64;

        this.mapa = mapa;
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
        this.debug = debug;

        this.estadoActual = 'IDLE_ABAJO';
        this.velocidad = 4;
        this.ultimaDireccion = 'ABAJO';

        this.auxX = 0;
        this.auxY = 0;

        this.objetoEnfocado = null;

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
    


    actualizar(teclas, canvas) {
        let moviendose = false;
        let nuevoEstado = 'ABAJO';

        let movY = 0;
        let movX = 0;

        if (teclas['w']) { movY -= this.velocidad; nuevoEstado = 'ARRIBA'; moviendose = true; }
        else if (teclas['s']) { movY += this.velocidad; nuevoEstado = 'ABAJO'; moviendose = true; }
        if (teclas['a']) { movX -= this.velocidad; nuevoEstado = 'IZQUIERDA'; moviendose = true; }
        else if (teclas['d']) { movX += this.velocidad; nuevoEstado = 'DERECHA'; moviendose = true; }

        if (this.input.justPressed['e']) {
            console.log("si");
            
            this.interact();
            this.input.justPressed['e'] = false;
        }
        

        
        if (!this.mapa.esSolido(this.x + movX, this.y,this.hitBoxX,this.hitBoxY)) {

            this.x += movX;
        }

        if (!this.mapa.esSolido(this.x, this.y + movY, this.hitBoxX, this.hitBoxY)) {
            
            
            this.y += movY;
        }

        let frenteX = this.x + this.ancho / 2;
        let frenteY = this.y + this.alto / 2;
        const distanciaCheck = 32;

        if(this.estadoActual.includes("IDLE_ABAJO")){
            frenteY += 70;
        }
        if(this.estadoActual.includes("IDLE_ARRIBA")){
            frenteY -= 70;
        }
        if(this.estadoActual.includes("IDLE_DERECHA")){
            frenteX += 70;
        }
        if(this.estadoActual.includes("IDLE_IZQUIERDA")){
            frenteX -= 70;
        }
        
        this.objetoEnfocado = this.mapa.obtenerObjetoEnPixeles(frenteX, frenteY);
        
        if (moviendose) {
            this.estadoActual = 'WALK_'+nuevoEstado;
            this.ultimaDireccion = nuevoEstado;
            this.swapAnimator(this.WalkAnimator);
        } else {
            this.swapAnimator(this.IdleAnimator);
            this.estadoActual = 'IDLE_'+this.ultimaDireccion;
        }

        
        const config = this.animaciones[this.estadoActual];
        this.sprite.actualizar(config.frames, config.velocidad);

        this.x = Math.max(0, Math.min(this.x, canvas.width - this.ancho - this.auxX));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.alto - this.auxY));
    }

    interact(){
         let checkX = 0;
         let checkY = 0;

        if(this.estadoActual.includes("ABAJO")){
            checkX = this.x + 32;
            checkY = this.y + 64;
        }
        else if(this.estadoActual.includes("ARRIBA")){
            checkX = this.x + 32;
            checkY = this.y - 10;
        }
        else if(this.estadoActual.includes("DERECHA")){
            checkX = this.x + 64;
            checkY = this.y + 32;
        }
        else if(this.estadoActual.includes("IZQUIERDA")){
            checkX = this.x - 10;
            checkY = this.y + 32;
        }

        let objeto = (this.mapa.obtenerObjetoEnPixeles(checkX,checkY))
        if(objeto != null && objeto.canInteract) objeto.interact();

    }


    swapAnimator(anim){
        if(anim != this.sprite){
            this.sprite = anim;
            this.sprite.frameActual = 0;
        }
    }

    dibujar(ctx,camara) {
 

        if(camara.estaMoviendose()){
         this.auxX = -Math.floor(camara.x); 
         this.auxY =   -Math.floor(camara.y); 
        }


        const anim = this.animaciones[this.estadoActual];
        this.sprite.dibujar(ctx, this.x - 13, this.y, this.ancho, this.alto, anim.fila,2,4,true);
        
        if(this.debug){
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x, this.y, this.hitBoxX, this.hitBoxY);
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, 4, 4);
        }

    }
}