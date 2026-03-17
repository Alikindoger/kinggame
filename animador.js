export class Animador {
    constructor(rutaImagen, frameW, frameH) {
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
        
        this.frameW = frameW;
        this.frameH = frameH;
        
        this.cargada = false;
        this.imagen.onload = () => this.cargada = true;

        this.frameActual = 0;
        this.contadorTicks = 0;
    }

    actualizar(totalFrames, ticksPorFrame) {
        this.contadorTicks++;
        if (this.contadorTicks >= ticksPorFrame) {
            this.frameActual = (this.frameActual + 1) % totalFrames;
            this.contadorTicks = 0;
        }
        
    }

    dibujar(ctx, x, y, anchoDestino, altoDestino, fila, offsetX = 0, offsetY = 0,ajuste) {
        if (!this.cargada) return;

        if(ajuste==true){
            if(this.frameActual !=0){
                offsetX = offsetX*2;
            }
        }

        if(fila != 0){
            offsetY = offsetY * fila +4;
        }
        
        ctx.drawImage(
            this.imagen,
            this.frameActual * this.frameW + offsetX * this.frameActual, // X de origen
            fila * this.frameH  + offsetY,             // Y de origen (fila)
            this.frameW, this.frameH,       // Tamaño de recorte
            x, y,                           // Posición destino
            anchoDestino, altoDestino       // Tamaño destino
        );
    }
}