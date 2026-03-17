export class Interfaz {
    constructor() {
        this.escala = 0;
        this.velocidadE = 0;
        this.fuerza = 0.15;
        this.friccion = 0.82;
        this.tiempoSinu = 0;
        this.ultimoObjId = null;
    }

    dibujar(ctx, camara, jugador) {
        const obj = jugador.objetoEnfocado;

        if (obj && obj.dialogo) {
            if (this.ultimoObjId !== obj.id) {
                this.escala = 0;
                this.velocidadE = 0.3; // El "impulso" del golpe
                this.ultimoObjId = obj.id;
            }

            let atraccion = (1 - this.escala) * this.fuerza;
            this.velocidadE += atraccion;
            this.velocidadE *= this.friccion;
            this.escala += this.velocidadE;

            this.tiempoSinu += 0.05;
            const levitacion = Math.sin(this.tiempoSinu) * 4;

            this._renderizar(ctx, camara, obj, levitacion);
        } else {
            this.ultimoObjId = null;
            this.escala = Math.max(0, this.escala - 0.1); // Desaparece suave
        }
    }

    _renderizar(ctx, camara, obj, levitacion) {
        const texto = obj.dialogo;
        ctx.font = "24px 'Jersey 10'"; 
        const metrica = ctx.measureText(texto);
        const padding = 12;
        const ancho = metrica.width + padding * 2;
        const alto = 50;

        const anchorX = (obj.x - camara.x) + obj.ancho + 5;
        const anchorY = (obj.y - camara.y) + levitacion;

        ctx.save();
        // Trasladamos al anclaje: el torque nace desde aquí
        ctx.translate(anchorX, anchorY);
        
        // El "golpe de fuerza" afecta a la escala y un poco a la rotación
        ctx.scale(this.escala, this.escala);
        ctx.rotate((1 - this.escala) * 0.2); // Pequeño giro al aparecer

        // if no texture
        if (!obj.texturaBocadillo) {
            ctx.fillStyle = "rgb(218, 218, 218)";
            ctx.beginPath();
            ctx.moveTo(0, 0);           // Punta que apunta al objeto
            ctx.lineTo(15, -10);        // Hacia arriba/derecha
            ctx.lineTo(15, 5);          // Hacia abajo/derecha
            ctx.fill();

            // 2. DIBUJAR EL CUERPO DEL BOCADILLO (Desplazado a la derecha del triángulo)
            this._roundRect(ctx, 10, -alto / 2 - 5, ancho, alto, 8);
            ctx.fill();

            // 3. TEXTO
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(texto, 15 + padding, -5);
        } else {
            // Si hay textura, la dibujamos desde el punto 0,0 del anclaje
            ctx.drawImage(obj.texturaBocadillo, 0, -alto, ancho, alto);
        }

        ctx.restore();
    }

    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }
}