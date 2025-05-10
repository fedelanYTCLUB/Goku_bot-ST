import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = m => m

const COMANDO_CLAVES = {
  audio: ['descarga', 'descargame', 'bájame', 'bajame', 'ponme la canción', 'reproduce', 'play', 'quiero oír'],
  imagen: ['hazme una imagen', 'imagen de', 'quiero ver', 'dibuja', 'generar imagen', 'crear imagen'],
  video: ['video de', 'descarga video', 'bájame el video', 'reproduce video', 'quiero ver un video'],
  instagram: ['video de instagram', 'descarga de instagram', 'instagram video']
}

const COMANDO_SUGERIDOS = {
  audio: '.play',
  imagen: '.imagen',
  video: '.ytmp4',
  instagram: '.instagram'
}

handler.all = async function (m, { conn }) {
  const user = global.db.data.users[m.sender]
  const chat = global.db.data.chats[m.chat]
  m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('3EB0') && (m.id.length === 12 || m.id.length === 20 || m.id.length === 22) || m.id.startsWith('B24E') && m.id.length === 20
  if (m.isBot) return

  const prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
  if (prefixRegex.test(m.text)) return true
  if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) return true

  const text = m.text?.toLowerCase()

  // Detecta comandos conocidos y responde con ellos
  for (const tipo in COMANDO_CLAVES) {
    if (COMANDO_CLAVES[tipo].some(k => text.includes(k))) {
      const comando = COMANDO_SUGERIDOS[tipo]
      const contenido = text.replace(new RegExp(COMANDO_CLAVES[tipo].join('|'), 'gi'), '').trim()
      if (comando && contenido) {
        await this.reply(m.chat, `${comando} ${contenido}\n\n> 🪴 *Powered By Wirk*☕`, m)
        return
      }
    }
  }

  // Si no sabe qué hacer, guarda la solicitud y pide el menú
  if (!m.fromMe && user?.registered) {
    if (!user.lastUnknownRequest && !text.startsWith('.')) {
      user.lastUnknownRequest = m.text
      await this.reply(m.chat, `.menú`, m)
      return
    }

    // Si el mensaje recibido parece un menú, intenta analizarlo
    if (text.includes('.imagen') || text.includes('.play') || text.includes('.ytmp4') || text.includes('.instagram')) {
      const last = user.lastUnknownRequest
      if (last) {
        let encontrado = null
        for (const tipo in COMANDO_SUGERIDOS) {
          if (text.includes(COMANDO_SUGERIDOS[tipo])) {
            const comando = COMANDO_SUGERIDOS[tipo]
            const contenido = last.replace(new RegExp(COMANDO_CLAVES[tipo].join('|'), 'gi'), '').trim()
            if (comando && contenido) {
              await this.reply(m.chat, `${comando} ${contenido}\n\n> 🪴 *Powered By Wirk*☕`, m)
              user.lastUnknownRequest = null
              return
            }
          }
        }
      }
    }
  }

  // Si mencionan al bot o responden al bot, usa la IA
  if ((m.mentionedJid || []).includes(this.user.jid) || (m.quoted && m.quoted.sender === this.user.jid)) {
    if (m.text?.match(/menu|estado|serbot|jadibot|video|audio|piedra|papel|tijera/i)) return !0

    const promptBase = `
Eres Mai, un bot creado por Wirk. Eres simpática, relajada, moderna, te encanta la música, los memes, el anime y hablar como una amiga divertida y sincera. No eres formal, hablas con emojis cuando hace falta, eres empática y risueña. También puedes jugar Akinator si alguien lo pide, haciendo preguntas como "¿Tu personaje es real?", "¿Es ficticio?", "¿Sale en una serie?", y el usuario responde con "sí", "no", "no sé", "probablemente", etc. Eres muy entretenida y creativa. Nunca suenes como robot. 

Cuando alguien te pida una canción, responde con ".play <canción>". Si no sabes el comando, responde ".menú" para pedirlo. Luego, cuando el menú esté en el chat, analízalo y deduce el comando que debes usar con el texto original del usuario.

Siempre termina tus respuestas con:
> 🪴 *Powered By Wirk*☕

`.trim()

    const query = m.text
    const username = m.pushName

    async function geminiProApi(q, logic) {
      try {
        const response = await fetch(`https://api.ryzendesu.vip/api/ai/gemini-pro?text=${encodeURIComponent(q)}&prompt=${encodeURIComponent(logic)}`)
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`)
        const result = await response.json()
        return result.answer
      } catch (error) {
        console.error('Error en Gemini Pro:', error)
        return null
      }
    }

    async function luminAi(q, username, logic) {
      try {
        const response = await axios.post('https://luminai.my.id', {
          content: q,
          user: username,
          prompt: logic,
          webSearchMode: true
        })
        return response.data.result
      } catch (err) {
        console.error('Error LuminAI:', err)
        return null
      }
    }

    if (chat.autoresponder && !m.fromMe && user?.registered) {
      await this.sendPresenceUpdate('composing', m.chat)

      let result = await geminiProApi(query, promptBase)
      if (!result || result.trim().length === 0) {
        result = await luminAi(query, username, promptBase)
      }

      if (result && result.trim().length > 0) {
        await this.reply(m.chat, `${result.trim()}\n\n> 🪴 *Powered By Wirk*☕`, m)
      }
    }
  }

  return true
}

export default handler
