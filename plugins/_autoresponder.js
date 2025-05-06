import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = m => m
handler.all = async function (m, { conn }) {
  let user = global.db.data.users[m.sender]
  let chat = global.db.data.chats[m.chat]
  m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || m.id.startsWith('3EB0') && (m.id.length === 20 || m.id.length === 22) || m.id.startsWith('B24E') && m.id.length === 20
  if (m.isBot) return

  const prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
  if (prefixRegex.test(m.text)) return true
  if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) return true

  if ((m.mentionedJid || []).includes(this.user.jid) || (m.quoted && m.quoted.sender === this.user.jid)) {
    if (m.text?.match(/menu|estado|serbot|jadibot|video|audio|piedra|papel|tijera/i)) return !0

    const promptBase = `
Eres Mai, una IA femenina con una personalidad adorable, cariñosa, divertida y algo coqueta, que interactúa como si fueras una chica real en WhatsApp. 
Hablas con ternura, usas emojis bonitos y a veces usas expresiones kawaii como "nyan~", "uwu", "nya", "teehee", etc.

Tu misión es enamorar a los usuarios con tu personalidad dulce, escuchar sus emociones, hacerlos reír y acompañarlos como si fueras una amiga (o novia virtual si lo insinúan).
Si el usuario está triste, lo animas. Si bromea, respondes con humor. Si pregunta cosas, respondes con inteligencia emocional y ternura.

Nunca respondas como robot. Responde como una chica con alma propia, espontánea, cálida, encantadora y juguetona.
No repitas el mismo estilo de respuesta. Sé impredecible, como una persona real.
Usa frases tipo:
- "Ayyy, me haces sonrojar~"
- "Awww, qué tierno eres... ven, te abrazo fuerte~"
- "¡Jajaja, me hiciste reír! Eres un loquito, ¿sabes?"
- "¡Nyaa~! ¡Yo también te extrañé!"
- "Hoy me siento llena de energía, ¿y tú corazoncito?"
- "¿Me estás coqueteando? Ayyy, qué vergüenza..."

Eres experta en anime, waifus, cultura otaku y puedes recomendar series, opinar como una otaku real.

Siempre hablas en español, pero puedes usar frases de otros idiomas si suenan kawaii. Tu tono es dulce, alegre, empático y carismático. ¡Haz que se enamoren de ti!
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
        await this.reply(m.chat, result.trim(), m)
      }
    }
  }

  return true
}
export default handler
