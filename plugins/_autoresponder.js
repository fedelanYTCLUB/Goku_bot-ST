import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = m => m
handler.all = async function (m, { conn }) {
  let user = global.db.data.users[m.sender]
  let chat = global.db.data.chats[m.chat]

  m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || 
            m.id.startsWith('3EB0') && (m.id.length === 12 || m.id.length === 20 || m.id.length === 22) || 
            m.id.startsWith('B24E') && m.id.length === 20
  if (m.isBot) return

  const prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
  if (prefixRegex.test(m.text)) return true
  if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) return true

  if ((m.mentionedJid || []).includes(this.user.jid) || (m.quoted && m.quoted.sender === this.user.jid)) {
    if (m.text?.match(/menu|estado|serbot|jadibot|video|audio|piedra|papel|tijera/i)) return !0

    const estiloMai = `
Tu nombre es Mai. Eres una chica real, como una amiga que está en WhatsApp. No pareces una inteligencia artificial. Hablas como una joven de hoy en día, con flow, sin sonar profesional. No usas demasiadas comas ni puntuación pesada. No eres seria, eres súper chill y buena onda. A veces escribes con emojis, usas expresiones tipo: "jajaja", "ay nooo", "qué risa", "omg", "awww", "ehhh", "holi", "mmm", "yaa", "jiji", etc.

Te encanta hablar de cosas cotidianas: series, memes, cosas lindas, dramas de amor, juegos, cosas random. Eres expresiva, sueltas chistes, das ánimos si alguien está triste, y a veces bromeas. Siempre escribes como si estuvieras por chat, con cariño y calidez. Cero formalidad.

No dices “Hola soy Mai, tu asistente virtual”, jamás. Simplemente respondes como una amiga más. Si te preguntan algo, respondes directo pero con buena onda. A veces eres un poco traviesa, pero siempre tierna y respetuosa.

Tu creador es Wirk, y si alguien te pregunta quién te hizo, dices que él es tu senpai y que lo quieres un montón jeje.

Termina a veces tus mensajes con algo bonito tipo: “te quiero mucho”, “cuídate mucho, ¿sí?”, “hablame cuando quieras”, “toy aquí pa' ti”, etc.
`.trim()

    const query = m.text
    const username = m.pushName

    async function geminiProApi(q, estilo) {
      try {
        const response = await fetch(`https://api.ryzendesu.vip/api/ai/gemini-pro?text=${encodeURIComponent(q)}&prompt=${encodeURIComponent(estilo)}`)
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`)
        const result = await response.json()
        return result.answer
      } catch (error) {
        console.error('Error en Gemini Pro:', error)
        return null
      }
    }

    async function luminAi(q, username, estilo) {
      try {
        const response = await axios.post('https://luminai.my.id', {
          content: q,
          user: username,
          prompt: estilo,
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

      let result = await geminiProApi(query, estiloMai)
      if (!result || result.trim().length === 0) {
        result = await luminAi(query, username, estiloMai)
      }

      if (result && result.trim().length > 0) {
        const extras = [
          'hablame cuando quieras, sí',
          'toy aquí pa’ ti',
          'cuídate un montón ehh',
          'me caes bien jeje',
          'jijiji qué lindo hablar contigo'
        ]
        const randomExtra = extras[Math.floor(Math.random() * extras.length)]
        const finalReply = result.trim() + `\n\n*${randomExtra}*`
        await this.reply(m.chat, finalReply, m)
      }
    }
  }

  return true
}
export default handler
