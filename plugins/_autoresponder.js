import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = m => m

const comandos = {
  audio: { claves: ['descarga', 'descargame', 'ponme la canción', 'play'], cmd: '.play' },
  imagen: { claves: ['imagen de', 'hazme una imagen', 'crear imagen'], cmd: '.imagen' },
  video: { claves: ['video de', 'descarga video', 'bajame el video'], cmd: '.ytmp4' },
  instagram: { claves: ['video de instagram', 'instagram video'], cmd: '.instagram' }
}

handler.all = async function (m, { conn }) {
  const text = m.text?.toLowerCase()
  if (!text || m.isBot || m.sender.includes('bot') || text.startsWith('.') || !text.trim()) return

  const user = global.db.data.users[m.sender]
  const chat = global.db.data.chats[m.chat]
  if (!user || !user.registered) return

  const isMenu = text.includes('.menu') || text.includes('.imagen') || text.includes('.play') || text.includes('.ytmp4')

  // Si ya se hizo una petición y llega el menú
  if (user.lastUnknownRequest && isMenu) {
    for (const tipo in comandos) {
      const cmd = comandos[tipo].cmd
      if (text.includes(cmd)) {
        const pedido = user.lastUnknownRequest.replace(new RegExp(comandos[tipo].claves.join('|'), 'gi'), '').trim()
        if (pedido) {
          user.lastUnknownRequest = null
          await this.reply(m.chat, `${cmd} ${pedido}\n\n> 🪴 *Powered By Wirk*☕`, m)
          return
        }
      }
    }
  }

  // CLASIFICADOR INTELIGENTE con IA externa (simulando comportamiento como ChatGPT)
  const resultado = await analizarIntencion(text)
  if (resultado?.tipo === 'comando' && resultado.cmd && resultado.valor) {
    await this.reply(m.chat, `${resultado.cmd} ${resultado.valor}\n\n> 🪴 *Powered By Wirk*☕`, m)
    return
  } else if (resultado?.tipo === 'incomprendido') {
    user.lastUnknownRequest = m.text
    await this.reply(m.chat, `.menú`, m)
    return
  } else if (resultado?.tipo === 'conversacion') {
    await this.reply(m.chat, `${resultado.respuesta}\n\n> 🪴 *Powered By Wirk*☕`, m)
    return
  }

  return true
}

async function analizarIntencion(texto) {
  try {
    const prompt = `
Eres una IA asistente que clasifica la intención del usuario en 3 tipos:

1. comando: Si el usuario quiere descargar una canción, un video, una imagen, o similar. Devuelve el comando y el contenido.
2. conversacion: Si el usuario solo está hablando, preguntando o saludando.
3. incomprendido: Si el mensaje es confuso o no sabes qué comando usar.

Ejemplos:
Entrada: "Descargame la canción Clavo"
Salida: { "tipo": "comando", "cmd": ".play", "valor": "Clavo" }

Entrada: "Hazme una imagen de un dragón"
Salida: { "tipo": "comando", "cmd": ".imagen", "valor": "un dragón" }

Entrada: "Hola, ¿cómo estás?"
Salida: { "tipo": "conversacion", "respuesta": "¡Hola! Estoy muy bien, ¿y tú? ¿En qué te puedo ayudar hoy?" }

Entrada: "Hazme feliz"
Salida: { "tipo": "incomprendido" }

Entrada: "${texto}"
Salida:
`.trim()

    const { data } = await axios.get(`https://api.ryzendesu.vip/api/ai/gemini-pro`, {
      params: {
        text: texto,
        prompt: prompt
      }
    })

    const json = data?.answer?.match(/\{[^}]+\}/)?.[0]
    if (json) return JSON.parse(json)
  } catch (e) {
    console.error('Error analizando intención:', e)
  }
  return null
}

export default handler
