import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  let bot = global.db.data.settings[conn.user.jid]

  global.botname = global.db.data.settings[conn.user.jid].botName || global.bottname
  global.textbot = `${botname} Powered by ${conn.getName(conn.user.jid)}` || global.textobot

  global.welcom1 = bot.welcome || "¡Bienvenido/a! Espero que disfrutes mucho aquí 💖"
  global.welcom2 = bot.bye || "¡Hasta pronto! 🥺✨ Nos vemos pronto 👋💫"

  let redes = ""

  if (!m.messageStubType || !m.isGroup) return !0;
  
  let pp = bot.logo.welcome || await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/un7lt7.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '🌸❀ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 🐾❀'
  let txt1 = '🌸❀ 𝑨𝑫𝑰𝑶𝑺 🐾❀'
  
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = bot.welcome || `🌟 ¡Bienvenido/a a *${groupMetadata.subject}*! 🌸\n🎀 *${global.welcom1}*\n\n👋 *@${m.messageStubParameters[0].split`@`[0]}*, te damos la bienvenida con mucho cariño 💕\n🔸 Ahora somos ${groupSize} miembros, ¡qué alegría tenerte con nosotros! 🎉\n> ✨ Usa *#help* para ver todos los comandos y disfrutar del grupo.`
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, null)
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = bot.bye || `💫 *Adiós* de *${groupMetadata.subject}* 😢\n🎀 *${global.welcom2}*\n\n🌟 *@${m.messageStubParameters[0].split`@`[0]}*, te despedimos con cariño. ¡Esperamos verte pronto! 💕\n🔸 Ahora somos ${groupSize} miembros, ¡te echaremos de menos! 🥺\n> ✨ Usa *#help* para ver la lista de comandos.`
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, null)
  }
}
