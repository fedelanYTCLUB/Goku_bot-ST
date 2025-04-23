const palabras = [
  "gato", "perro", "pájaro", "elefante", "tigre", "ballena", "mariposa", "tortuga", "conejo", "rana",
  "pulpo", "ardilla", "jirafa", "cocodrilo", "pingüino", "delfín", "serpiente", "hámster", "mosquito", "abeja",
  "televisión", "computadora", "reggaeton", "economía", "electrónica", "facebook", "whatsapp", "instagram", "tiktok", "milanesa",
  "presidente", "película", "dragón", "zorro", "camaleón", "caballo", "ratón", "mapache", "león", "pantera",
  "cactus", "volcán", "planeta", "galaxia", "robot", "nube", "sol", "luna", "estrella", "universo",
  "espacio", "telescopio", "cometa", "asteroide", "marte", "tierra", "júpiter", "saturno", "neptuno", "plutón",
  "cielo", "atmósfera", "montaña", "bosque", "selva", "desierto", "río", "lago", "océano", "playa",
  "isla", "cueva", "ciudad", "pueblo", "casa", "edificio", "puente", "calle", "carretera", "auto",
  "camión", "moto", "bicicleta", "tren", "avión", "barco", "cohete", "wifi", "router", "servidor",
  "aplicación", "software", "teclado", "pantalla", "mouse", "celular", "tablet", "reloj", "cámara", "drone",
  "memoria", "batería", "cargador", "videojuego", "control", "nivel", "misión", "mapa", "arma", "escudo",
  "vida", "moneda", "tienda", "espada", "flecha", "armadura", "casco", "botas", "anillo", "trofeo",
  "logro", "usuario", "perfil", "email", "mensaje", "chat", "grupo", "comunidad", "moderador", "tema",
  "comentario", "emoji", "gif", "sticker", "foto", "video", "voz", "audio", "canción", "música",
  "álbum", "cantante", "instrumento", "guitarra", "micrófono", "sonido", "volumen", "ritmo", "melodía", "letra",
  "reproductor", "grabación", "efecto", "filtro", "pantalla", "color", "brillo", "archivo", "descarga", "subida",
  "enlace", "navegador", "página", "web", "blog", "cuenta", "login", "sesión", "registro", "configuración",
  "menú", "lista", "texto", "fuente", "tamaño", "familia", "escuela", "maestro", "profesor", "clase",
  "estudiante", "cuaderno", "lápiz", "libro", "hoja", "examen", "tarea", "nota", "recreo", "juego",
  "pelota", "amigo", "hermano", "mamá", "papá", "abuelo", "abuela", "primo", "prima", "tío",
  "tía", "vecino", "niño", "niña", "hombre", "mujer", "doctor", "enfermera", "hospital", "clínica",
  "vacuna", "pastilla", "agua", "comida", "pan", "leche", "arroz", "pollo", "pescado", "carne",
  "fruta", "verdura", "manzana", "banana", "naranja", "fresa", "sandía", "limón", "uva", "piña",
  "helado", "galleta", "dulce", "chocolate", "sal", "azúcar", "jugo", "refresco", "café", "té",
  "plato", "vaso", "cuchara", "tenedor", "cuchillo", "silla", "mesa", "puerta", "ventana", "piso",
  "pared", "techo", "luz", "foco", "reloj", "ropa", "camisa", "pantalón", "zapato", "sombrero",
  "abrigo", "calcetín", "pañuelo", "maleta", "dinero", "moneda", "billete", "banco", "trabajo", "empleo", 
]

const intentosMaximos = 6
const gam = new Map()

function elegirPalabraAleatoria() {
return palabras[Math.floor(Math.random() * palabras.length)]
}

function ocultarPalabra(palabra, letrasAdivinadas) {
let palabraOculta = "";
for (const letra of palabra) {
if (letrasAdivinadas.includes(letra)) {
palabraOculta += letra + " "; 
} else {
palabraOculta += "_ "; 
}}
return palabraOculta.trim(); 
}


function mostrarAhorcado(intentos) {
const dibujo = [
" ____",
" |  |",
intentos < 6 ? " |  O" : " |",
intentos < 5 ? " | /" : intentos < 4 ? " | / " : intentos < 3 ? " | / \\" : intentos < 2 ? " | / \\ " : " |",
intentos < 2 ? "_|_" : " |",
]
return dibujo.slice(0, intentosMaximos - intentos).join("\n")
}

function juegoTerminado(sender, mensaje, palabra, letrasAdivinadas, intentos) {
if (intentos === 0) {
gam.delete(sender);
return `❌ ¡Perdiste! La palabra correcta era: ${palabra}\n\n${mostrarAhorcado(intentos)}`;
} else if (!mensaje.includes("_")) {
let expGanada = Math.floor(Math.random() * 300); //fáciles
if (palabra.length >= 8) {
expGanada = Math.floor(Math.random() * 3500); //difíciles
}
global.db.data.users[sender].exp += expGanada;
gam.delete(sender);
return `¡Que pro Ganaste 🥳! Adivinaste la palabra "${palabra}".\n\n*Has ganado:* ${expGanada} Exp.`;
} else {
return `${mostrarAhorcado(intentos)}\n\n${mensaje}`;
}}

let handler = async (m, { conn }) => {
let users = global.db.data.users[m.sender]
if (gam.has(m.sender)) {
return conn.reply(m.chat, "Ya tienes un juego en curso. ¡Termina ese primero!", m)
}
let palabra = elegirPalabraAleatoria()
let letrasAdivinadas = []
let intentos = intentosMaximos
let mensaje = ocultarPalabra(palabra, letrasAdivinadas)
gam.set(m.sender, { palabra, letrasAdivinadas, intentos })
let text = `¡Adivina la palabra:\n\n${mensaje}\n\nIntentos restantes: ${intentos}`
conn.reply(m.chat, text, m)
}

handler.before = async (m, { conn }) => {
let users = global.db.data.users[m.sender]
let juego = gam.get(m.sender)
if (!juego) return
let { palabra, letrasAdivinadas, intentos } = juego
if (m.text.length === 1 && m.text.match(/[a-zA-Z]/)) {
let letra = m.text.toLowerCase()
if (!letrasAdivinadas.includes(letra)) {
letrasAdivinadas.push(letra)
if (!palabra.includes(letra)) {
intentos--
}}
let mensaje = ocultarPalabra(palabra, letrasAdivinadas)
let respuesta = juegoTerminado(m.sender, mensaje, palabra, letrasAdivinadas, intentos)
if (respuesta.includes("¡Perdiste!") || respuesta.includes("¡Ganaste!")) {
conn.reply(m.chat, respuesta, m)
} else {
gam.set(m.sender, { palabra, letrasAdivinadas, intentos })
conn.reply(m.chat, respuesta + `\n\nIntentos restantes: ${intentos}`, m)
}} else {
let mensaje = ocultarPalabra(palabra, letrasAdivinadas);
let respuesta = juegoTerminado(m.sender, mensaje, palabra, letrasAdivinadas, intentos)
conn.reply(m.chat, respuesta, m)
gam.delete(m.sender)
}}
handler.help = ['ahorcado']
handler.tags = ['game']
handler.command = ['ahorcado']
handler.register = true
export default handler

