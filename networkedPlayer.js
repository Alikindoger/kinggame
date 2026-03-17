import { Jugador } from './jugador.js';

export class NetworkedPlayer extends Jugador {
    constructor(gridX, gridY, nombre, mapa) {
        super(gridX, gridY, nombre, null);
    }

    actualizarDesdeRed(data) {
        this.gridX = data.gridX;
        this.gridY = data.gridY;
        this.estadoActual = data.anim;
    }
}