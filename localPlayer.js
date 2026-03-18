import { Jugador } from './jugador.js';
import { conn } from './conection.js';

export class LocalPlayer extends Jugador {

    constructor(gridX, gridY, nombre, mapa) {
        super(gridX,gridY,nombre,mapa)

    }

actualizar(teclas, canvas) {
        let moviendose = false;
        let nuevaDir = this.ultimaDireccion;

        let movY = 0;
        let movX = 0;

        // 1. Captura de movimiento
        if (teclas['w']) { movY -= this.velocidad; nuevaDir = 'ARRIBA'; moviendose = true; }
        else if (teclas['s']) { movY += this.velocidad; nuevaDir = 'ABAJO'; moviendose = true; }
        
        if (teclas['a']) { movX -= this.velocidad; nuevaDir = 'IZQUIERDA'; moviendose = true; }
        else if (teclas['d']) { movX += this.velocidad; nuevaDir = 'DERECHA'; moviendose = true; }

        
        if (this.input.justPressed['e']) {
            this.interact();            
            this.input.justPressed['e'] = false;
        }

        // 3. Colisiones (Usando píxeles)
        if (!this.mapa.esSolido(this.x + movX, this.y, this.hitBoxX, this.hitBoxY)) {
            this.x += movX;
        }
        if (!this.mapa.esSolido(this.x, this.y + movY, this.hitBoxX, this.hitBoxY)) {
            this.y += movY;
        }
        
        if(moviendose){
            conn.enviar("MOVIMIENTO",{
                x : this.x,
                y : this.y,
                estadoActual : this.estadoActual
            });
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

        // 5. Animaciones
        if (moviendose) {
            this.estadoActual = 'WALK_' + nuevaDir;
            this.ultimaDireccion = nuevaDir;
            this.swapAnimator(this.WalkAnimator);
        } else {
            this.estadoActual = 'IDLE_' + this.ultimaDireccion;
            this.swapAnimator(this.IdleAnimator);
        }
     
   
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
        console.log(checkX,checkY);
        
        let objeto = (this.mapa.obtenerObjetoEnPixeles(checkX,checkY))
        if(objeto != null && objeto.canInteract) objeto.interact();

    }

}