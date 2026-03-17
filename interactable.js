export class Interactuable {
    constructor(x, y, ancho, alto, id,dialogo = null) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.id = id;
        this.dialogo = dialogo;
        this.canInteract = true;
        }

    interact() {
        console.log("Interacción base: Este objeto no hace nada todavía.");
    }
}