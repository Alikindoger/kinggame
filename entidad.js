export class Entidad {
    constructor(gridX, gridY, ancho, alto, rutaImagen) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.tileSize = 32; // tamaño casillas

        // x e y posicion en el mundo
        this.x = gridX * this.tileSize;
        this.y = gridY * this.tileSize;

        this.ancho = ancho;
        this.alto = alto;
        
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
        this.cargada = false;
        this.imagen.onload = () => { this.cargada = true; };
    }

    actualizarSuavizado() {
        const destinoX = this.gridX * this.tileSize;
        const destinoY = this.gridY * this.tileSize;
        this.x += (destinoX - this.x) * 0.2;
        this.y += (destinoY - this.y) * 0.2;
    }

    dibujar(ctx, camara) {
        const screenX = Math.floor(this.x - camara.x);
        const screenY = Math.floor(this.y - camara.y);

        if (this.cargada) {
            ctx.drawImage(this.imagen, screenX, screenY, this.ancho, this.alto);
        } else {
            ctx.fillStyle = 'gray';
            ctx.fillRect(screenX, screenY, this.ancho, this.alto);
        }
    }
}