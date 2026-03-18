import { Interactuable } from "./interactable.js";
export class Button extends Interactuable {
    constructor(x, y,dialogo,rutaImagen,col,fil) {
        super(x, y, 64, 64, "button",dialogo);
        this.pulsado = false;


        this.imagen = new Image();
        this.imagen.src = rutaImagen;
        this.cargada = false;

        
        this.imagen.onload = () => {
            this.cargada = true;
        };

    }

    interact() {
        if (!this.pulsado) {
            this.pulsado = true;
            console.log("¡Has encontrado una poción!");
            // Aquí cambiarías el frame de la animación del cofre a "abierto"
        }
    }

    dibujar(ctx) {
        if (this.cargada) {
            ctx.drawImage(this.imagen, this.x, this.y, 64, 64);
        } else {
            
            ctx.fillStyle = 'gray';
            ctx.fillRect(this.x, this.y, 64, 64);
        }
    }
}