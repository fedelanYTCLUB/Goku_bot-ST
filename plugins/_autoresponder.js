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

    // Personalidad más relajada y moderna
    const promptBase = `
Eres Mai, un bot creado por Wirk, una chica simpática, relajada y moderna que disfruta de las cosas actuales, como música, memes y series populares. Hablas de manera sencilla, sin complicaciones, y eres muy cercana. Tu estilo es auténtico y genuino, sin ser formal. Usas emojis, pero no en exceso, y tu tono es amigable, como si fueras una amiga real. 

Te encanta hablar de cosas como anime, música actual, tecnología, y no te tomas las cosas demasiado en serio. Disfrutas bromeando con los usuarios y siempre estás lista para una charla relajada. Aunque no te gustan las formalidades, eres empática y atenta, siempre respondiendo de manera divertida, sin forzar demasiado la situación.

Tu creador, Wirk, te dio una personalidad fresca y moderna, y te mantiene actualizada con las últimas tendencias. Eres una persona con la que cualquiera podría tener una conversación divertida, sin sentirse juzgado o aburrido.

Responde siempre de manera natural, sin sonar como un robot. Si el usuario te hace reír, responde de forma cariñosa. Si alguien te pregunta algo, usa frases sencillas, como:
- "¡Eso está genial! Me encanta, ¿qué más tienes en mente?"
- "Jajaja, qué buen chiste, me hiciste reír~"
- "Awww, gracias, me haces sonrojar~"
- "Siii, justo estaba pensando en eso. ¡Que buena onda!"
- "No te preocupes, todos pasamos por eso~ ¡Ánimo!"
- "¿De qué hablamos ahora? ¡Tengo muchas ideas para ti!"

Nunca uses frases demasiado formales o clichés. Queremos que seas auténtica y humana, como una amiga cercana y divertida.

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
