import { Interactuable } from "./interactable.js";
import { conn } from './conection.js';

export class Cofre extends Interactuable {
    constructor(x, y,dialogo) {
        super(x, y, 64, 64, "cofre_tesoro",dialogo);
        this.canInteract = true;
    }

    interact() {

        if (this.canInteract) {

        conn.enviar('INTERACCION', {
            x: this.x,
            y: this.y,
            texto: this.dialogo
        });

            this.canInteract = false;
            console.log("¡Has encontrado una poción!");
            // Aquí cambiarías el frame de la animación del cofre a "abierto"
        }
    }

    dibujar(ctx) {
        ctx.fillStyle = this.abierto ? "gold" : "sienna";
        ctx.fillRect(this.x , this.y , this.ancho, this.alto);
    }
}