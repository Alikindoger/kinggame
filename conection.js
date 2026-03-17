// src/Conexion.js
import { NetworkedPlayer } from "./networkedPlayer.js";
import { LocalPlayer } from "./localPlayer.js";
import { Estado, mapa } from "./game.js";
class Conection {
    constructor() {
        this.url = 'ws://localhost:8080';
        this.socket = null;
        this.eventos = {};
        this.players = {};
        this.conectado = false;
        this.nombre = "";
        this.miIDLocal = null;
        
    }

    esperarConexion() {
        return new Promise((resolve, reject) => {
            // Si ya está abierto, resolvemos inmediatamente
            if (this.socket.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }

            // Si el socket se cierra o da error mientras esperamos
            if (this.socket.readyState === WebSocket.CLOSED) {
                reject("No se pudo conectar: el socket está cerrado.");
                return;
            }

            // Configuramos un intervalo que chequea el estado cada 100ms
            const intervalo = setInterval(() => {
                if (this.socket.readyState === WebSocket.OPEN) {
                    clearInterval(intervalo);
                    resolve();
                } else if (this.socket.readyState === WebSocket.CLOSED) {
                    clearInterval(intervalo);
                    reject("La conexión falló durante la espera.");
                }
            }, 100);

            // Opcional: Timeout por si el servidor nunca responde (10 segundos)
            setTimeout(() => {
                clearInterval(intervalo);
                reject("Tiempo de espera agotado (Timeout)");
            }, 10000);
        });
    }

    conectar() {

    conn.on("LOGIN_EXITO", (data) => {
    console.log("Login correcto, creando jugador...");
    
    Estado.jugador = new LocalPlayer(data.x, data.y, data.nombre, mapa);
    
    document.getElementById('pantalla-carga').style.display = 'none';
    Estado.juegoIniciado = true;
    });

    conn.on("LOGIN_FALLO", (data) => {
        errorLogin.innerText = data.mensaje;
        errorLogin.style.display = 'block';
    });


    this.on("INTERACCION", (data) => {
    console.log("Activando bocadillo con el texto: " + data.texto);
    });


    //CREAMOS OTRO JUGADORES
    conn.on("NUEVO_JUGADOR", (data) => {

    if (data.id === this.miIDLocal) return;
        console.log(data.x,data.y);
        
        this.players[data.id] = new NetworkedPlayer(
        data.x,data.y, 
        data.nombre,
        null
        ); 
    });

    conn.on("MOVIMIENTO", (data) => {
    const p = this.players[data.id];
    if (p) {
        p.x = data.x;
        p.y = data.y;
        p.estadoActual = data.estadoActual;
        }
    });

    //CUANDO SE PIERDE LA CONEXION CON EL SERVIDOR
    conn.on("desconectado", () => {
        Estado.pantalla.style.display = "flex";
        Estado.textoCarga.innerText = "Conexión perdida. Reintentando...";
        Estado.juegoIniciado = false;
        this.conectar();
    });

    //CUANDO UN JUGADOR SE SALE DEL SERVIDOR
    conn.on("DESCONEXION", (data) => {
        delete this.players[data.id]; //borramos la instancia y del diccionario
        
    })



        if (this.conectado) return; 
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            this.conectado = true;
            this.nombre = Math.floor(Math.random() * 1000);
            console.log("Conectado al servidor");
        };

        this.socket.onmessage = (event) => {

            console.log(event.data);
            
            const data = JSON.parse(event.data);
            
            if (this.eventos[data.tipo]) {

                this.eventos[data.tipo](data);
            }
        };

        this.socket.onclose = () => {
            this.conectado = false;
            this.eventos["desconectado"]();
            console.warn("Conexión perdida con el servidor");
        };

    }
    
    //para configurar los protocolos
    on(tipo, callback) {
        
        this.eventos[tipo] = callback;
    }

    enviar(tipo, datos = {}) {
        console.log("mando");
        
        if (this.conectado && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ tipo, ...datos }));
        }
    }
}

export const conn = new Conection();