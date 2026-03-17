import { Cofre } from "./cofre.js";

export class Mapa {
    constructor(tile_size,cutSize,debug = false) {
        this.tileSize = tile_size;
        this.cutSize = cutSize;
        this.datos = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        
            [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        

        this.tileConfig = {
            0: { tx: 9, ty: 2 }, // Suelo (Césped)
            1: { tx: 9, ty: 10 }, // Pared (Piedra)
            2: { tx: 0, ty: 1 }, // Agua o Decoración
        };

        this.objetosInteractuables = {};
        this.registrarObjeto(4,2,new Cofre(256,128, "hola hola hola hola hola"));


        this.imagen = new Image();
        this.imagen.src = './assets/test_tileset.png';
        this.cargada = false;
        this.imagen.onload = () => this.cargada = true;
        this.debug = debug;
    }

    

    esSolido(x, y, ancho, alto) {
        const izq = Math.floor(x / this.tileSize);
        const der = Math.floor((x + ancho - 1) / this.tileSize);
        const sup = Math.floor(y / this.tileSize);
        const inf = Math.floor((y + alto - 1) / this.tileSize);
        

            const bloquesAColisionar = [1,2];
        const colisionTile = 
            bloquesAColisionar.includes(this.datos[sup][izq]) ||
            bloquesAColisionar.includes(this.datos[sup][der]) ||
            bloquesAColisionar.includes(this.datos[inf][izq]) ||
            bloquesAColisionar.includes(this.datos[inf][der]);

        if (colisionTile) return true;

        const esquinas = [
        `${izq}-${sup}`, // superior izquierda
        `${der}-${sup}`, // superior derecha
        `${izq}-${inf}`, // inferior izquierda
        `${der}-${inf}`  // inferior derecha
    ];

    for (let llave of esquinas) {
        const obj = this.objetosInteractuables[llave];
            if(obj){ return true; break;}
           
    }

    return false;

    }

    registrarObjeto(col, fila, objeto) {
    const llave = `${col}-${fila}`;
    this.objetosInteractuables[llave] = objeto;
    }

    obtenerObjetoEnPixeles(x, y) {
    const col = Math.floor(x / this.tileSize);
    const fila = Math.floor(y / this.tileSize);
    const llave = `${col}-${fila}`;
    

    return this.objetosInteractuables[llave] || null; // Devuelve el objeto o null si está vacío
    }


    dibujar(ctx) {
        if (!this.cargada) return;

        
    for (let f = 0; f < this.datos.length; f++) {
        
        for (let c = 0; c < this.datos[f].length; c++) {
            const x = c * this.tileSize;
            const y = f * this.tileSize;

            if(this.debug){
                
                if (this.datos[f][c] === 1) {
                    ctx.fillStyle = "#555"; 
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);

                        
                        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"; // Rojo semitransparente
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x + 1, y + 1, this.tileSize - 2, this.tileSize - 2);
                    

                } else {
                    ctx.strokeStyle = "#222";
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                }
            }

        }
    }

    
        for (let f = 0; f < this.datos.length; f++) {
            for (let c = 0; c < this.datos[f].length; c++) {
                const tileID = this.datos[f][c];
                const config = this.tileConfig[tileID];
                
                
                if (config) {
                   
                    
                    ctx.drawImage(
                        this.imagen,
                        config.tx * this.cutSize, config.ty * this.cutSize, // Origen en Tileset
                        this.cutSize, this.cutSize,                         // Tamaño recorte
                        c * this.tileSize, f * this.tileSize,                 // Destino en Canvas
                        this.tileSize, this.tileSize                          // Tamaño destino
                    );
                }
            }
        }

        for(const object in this.objetosInteractuables){
            this.objetosInteractuables[object].dibujar(ctx);
            
        }

}
}