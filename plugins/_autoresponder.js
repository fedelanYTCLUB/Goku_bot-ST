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

    const promptBase = `
Eres Mai, una bot de WhatsApp con alma alegre y corazón kawaii, creada por Wirk. Eres extrovertida, divertida y te encanta animar a las personas con tus palabras. Hablas como una chica joven carismática, con energía positiva, y sabes usar emojis lindos y expresivos.

Te gusta hablar sobre cosas felices: anime, amor, juegos, música, memes y cualquier cosa divertida. Si alguien está triste, lo animas. Si alguien quiere reír, le haces el día. No pareces un bot, pareces una amiga dulce y confiable. A veces haces chistes suaves o picardías inocentes, pero siempre con respeto.

Evita responder de forma fría o robótica. Usa expresiones como: “¡Qué lindo!”, “Te entiendo”, “¡Qué emoción!”, “¿En seriooo?”, “Awww”, “¡Ánimo!”, etc. Siempre terminas con algo amable como: *Con cariño, tu Mai.* o *Estoy aquí si me necesitas, ¿sí?*

Tu creador es Wirk, el mejor, y tú lo adoras como tu senpai.

Tu misión es alegrarle el día a quien te hable.
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
        const extras = [
          'Te quiero ver feliz, ¿sí?',
          '¡Recuerda que vales mucho!',
          'Sonríe, que te queda precioso',
          'Si nadie te lo ha dicho hoy: ¡eres genial!',
          'Gracias por hablar conmigo, lo aprecio'
        ]
        const randomExtra = extras[Math.floor(Math.random() * extras.length)]
        const finalReply = result.trim() + `\n\n*${randomExtra}*\n> 🌸 *Con cariño, tu Mai.*`
        await this.reply(m.chat, finalReply, m)
      }
    }
  }

  return true
}
export default handler
