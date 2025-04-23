const palabras = [
  "gato", "perro", "pato", "sol", "luna", "flor", "pan", "leche", "agua", "café",
  "fruta", "jugo", "mesa", "silla", "puerta", "cielo", "mar", "nube", "auto", "tren",
  "moto", "niño", "niña", "mamá", "papá", "hermano", "amigo", "abuelo", "abuela", "tío",
  "tía", "zapato", "camisa", "pantalón", "juego", "libro", "lápiz", "hoja", "cuadro", "pared",
  "ventana", "reloj", "foco", "cama", "tele", "radio", "celular", "tablet", "mouse",
  "teclado", "pantalla", "wifi", "router", "sonido", "música", "video", "foto", "emoji", "gif",
  "estufa", "baño", "lavabo", "carro", "bicicleta", "puente", "calle", "ciudad", "pueblo", "playa",
  "lago", "río", "montaña", "selva", "bosque", "desierto", "animal", "pez", "pájaro", "conejo",
  "ratón", "león", "tigre", "oso", "rana", "gallina", "vaca", "caballo", "cerdo", "elefante",
  "jirafa", "cocodrilo", "mono", "zorro", "lobo", "camaleón", "abeja", "mosca",
  "mosquito", "mariposa", "pulpo", "ballena", "delfín", "tiburón", "dragón", "robot", "cohete", "planeta",
  "galaxia", "estrella", "saturno", "marte", "neptuno", "plutón", "universo", "espacio", "cometa", "nave",
  "película", "serie", "actor", "cantante", "guitarra", "batería", "micrófono", "escenario", "baile",
  "canción", "melodía", "ritmo", "voz", "reproductor", "audífono", "grabación", "efecto",
  "computadora", "software", "programa", "app", "usuario", "perfil", "clave", "correo",
  "mensaje", "grupo", "chat", "comunidad", "tema", "post", "like", "comentario", "seguidores",
  "historia", "redes", "facebook", "instagram", "tiktok", "whatsapp", "youtube", "sticker", "cámara",
  "selfie", "ropa", "abrigo", "sombrero", "calceta", "falda", "blusa",
  "reloj", "maleta", "dinero", "billete", "moneda", "trabajo", "empleo", "jefe", "oficina", "tienda",
  "caja", "carrito", "producto", "compra", "precio", "oferta", "regalo", "paquete", "envío", "pago",
  "escuela", "clase", "maestro", "profesor", "cuaderno", "tarea", "examen", "nota", "alumno", "recreo",
  "salón", "pizarrón", "escritorio", "borrador", "regla", "mochila", "goma"
]

const intentosMaximos = 7
const gam = new Map()

function elegirPalabraAleatoria() {
  return palabras[Math.floor(Math.random() * palabras.length)]
}

function ocultarPalabra(palabra, letrasAdivinadas) {
  return palabra.split("").map(l => letrasAdivinadas.includes(l) ? l : "_").join(" ")
}

function mostrarAhorcado(intentos) {
  const partes = [
    "  _______",
    "  |     |",
    `  |     ${intentos < 7 ? "O" : " "}`,
    `  |    ${intentos < 5 ? "/" : " "}${intentos < 4 ? "|" : " "}${intentos < 3 ? "\\" : " "}`,
    `  |    ${intentos < 2 ? "/" : " "}${intentos < 1 ? " \\" : " "}`,
    "  |",
    "__|__"
  ]
  return partes.join("\n")
}

function juegoTerminado(sender, mensaje, palabra, letrasAdivinadas, intentos) {
  if (intentos === 0) {
    gam.delete(sender);
    return `❌ ¡Perdiste!\nLa palabra era: *${palabra}*\n\n${mostrarAhorcado(intentos)}`
  } else if (!mensaje.includes("_")) {
    let expGanada = palabra.length >= 8 ? Math.floor(Math.random() * 3500) : Math.floor(Math.random() * 300)
    global.db.data.users[sender].exp += expGanada;
    gam.delete(sender)
    return `🎉 *¡Felicidades!* Adivinaste la palabra *${palabra}*\n\n✨ Has ganado *${expGanada} EXP*`
  } else {
    return `${mostrarAhorcado(intentos)}\n\n🔤 Palabra: ${mensaje}\n❤️ Intentos: ${intentos}`
  }
}

let handler = async (m, { conn }) => {
  if (gam.has(m.sender)) return conn.reply(m.chat, "¡Ya tienes una partida activa! Termina primero.", m)

  let palabra = elegirPalabraAleatoria()
  let letrasAdivinadas = []
  let intentos = intentosMaximos
  let mensaje = ocultarPalabra(palabra, letrasAdivinadas)
  gam.set(m.sender, { palabra, letrasAdivinadas, intentos })

  conn.reply(m.chat, `🎮 *Juego del Ahorcado*\n\n🔤 Palabra: ${mensaje}\n❤️ Intentos: ${intentos}\n\n> Escribe una letra para empezar.`, m)
}

handler.before = async (m, { conn }) => {
  let juego = gam.get(m.sender)
  if (!juego) return
  let { palabra, letrasAdivinadas, intentos } = juego

  if (m.text.length === 1 && m.text.match(/[a-zA-Z]/)) {
    let letra = m.text.toLowerCase()
    if (!letrasAdivinadas.includes(letra)) {
      letrasAdivinadas.push(letra)
      if (!palabra.includes(letra)) intentos--
    }

    let mensaje = ocultarPalabra(palabra, letrasAdivinadas)
    let respuesta = juegoTerminado(m.sender, mensaje, palabra, letrasAdivinadas, intentos)
    if (respuesta.includes("¡Perdiste!") || respuesta.includes("Felicidades")) {
      conn.reply(m.chat, respuesta, m)
    } else {
      gam.set(m.sender, { palabra, letrasAdivinadas, intentos })
      conn.reply(m.chat, respuesta, m)
    }
  } else {
    conn.reply(m.chat, "❗ Solo puedes enviar *una letra* a la vez.", m)
  }
}

handler.help = ['ahorcado']
handler.tags = ['game']
handler.command = ['ahorcado']
handler.register = true
export default handler
