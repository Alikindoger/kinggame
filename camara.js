export class Camera {
    constructor(anchoPantalla, altoPantalla, anchoMapa, altoMapa) {
        this.x = 0;
        this.y = 0;
        this.anchoPantalla = anchoPantalla;
        this.altoPantalla = altoPantalla;
        this.anchoMapa = anchoMapa;
        this.altoMapa = altoMapa;
    }

centrarEn(objetivoX, objetivoY, objetivoAncho, objetivoAlto) {
    
    let targetX = objetivoX + objetivoAncho / 2 - this.anchoPantalla / 2;
    let targetY = objetivoY + objetivoAlto / 2 - this.altoPantalla / 2;

    this.x = Math.max(0, Math.min(targetX, this.anchoMapa - this.anchoPantalla));
    this.y = Math.max(0, Math.min(targetY, this.altoMapa - this.altoPantalla));
}
estaMoviendose() {
        // Si la posición actual es distinta a la del frame anterior, se está moviendo
        return this.x !== this.oldX || this.y !== this.oldY;
    }
}