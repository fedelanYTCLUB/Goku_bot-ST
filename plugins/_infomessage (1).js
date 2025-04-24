import fetch from 'node-fetch'
import { readdirSync, unlinkSync, existsSync, promises as fs } from 'fs'
import path from 'path'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isOwner, isROwner, isBotAdmin, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  const usuario = `@${m.sender.split`@`[0]}`
  const groupName = (await conn.groupMetadata(m.chat)).subject
  const groupAdmins = participants.filter(p => p.admin)
  const chat = global.db.data.chats[m.chat] || {}
  const mentions = [m.sender, m.messageStubParameters?.[0], ...groupAdmins.map(v => v.id)].filter(Boolean)
  const getMentionedJid = () => m.messageStubParameters?.map(param => `${param}@s.whatsapp.net`) || []

  // Archivos de audio
  const vn = 'https://qu.ax/OzTbp.mp3'
  const vn2 = 'https://qu.ax/OzTbp.mp3'

  const who = m.messageStubParameters?.[0] + '@s.whatsapp.net'
  const user = global.db.data.users[who] || {}
  const userName = user.name || await conn.getName(who)
  const redes = 'https://github.com/David-Chian'

  // Reemplaza con tu miniatura
  const icons = await (await fetch('https://qu.ax/zliac.jpg')).buffer()

  // Asegúrate de definir `channelRD`
  const channelRD = {
    id: '1203630xxxxx@g.us',
    name: 'Comunidad'
  }

  // Detectar y eliminar sesiones si es necesario
  if (chat.detect && m.messageStubType == 2) {
    const uniqid = (m.isGroup ? m.chat : m.sender).split('@')[0]
    const sessionPath = './Sessions/'
    for (const file of await fs.readdir(sessionPath)) {
      if (file.includes(uniqid)) {
        await fs.unlink(path.join(sessionPath, file))
        console.log(`[ ⚠️ Archivo Eliminado ] '${file}'`)
      }
    }
  }

  // Promoción a admin
  if (chat.detect && m.messageStubType == 29) {
    return await conn.sendMessage(m.chat, {
      text: `💣 @${m.messageStubParameters[0].split`@`[0]} ha sido promovido a Administrador por ${usuario}`,
      mentions
    })
  }

  // Degradado de admin
  if (chat.detect && m.messageStubType == 30) {
    return await conn.sendMessage(m.chat, {
      text: `💣 @${m.messageStubParameters[0].split`@`[0]} ha sido degradado de Administrador por ${usuario}`,
      mentions
    })
  }

  // Bienvenida
  if (chat.welcome && m.messageStubType === 27) {
    return await conn.sendMessage(m.chat, {
      audio: { url: vn },
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: '',
          newsletterName: channelRD.name
        },
        forwardingScore: 9999999,
        isForwarded: true,
        mentionedJid: getMentionedJid(),
        externalAdReply: {
          title: '  ͟͞ Ｗ Ｅ Ｌ Ｃ Ｏ Ｍ Ｅ ͟͞  ',
          body: userName,
          previewType: 'PHOTO',
          thumbnailUrl: null,
          thumbnail: icons,
          sourceUrl: redes,
          showAdAttribution: true
        }
      },
      seconds: 4556,
      ptt: true,
      mimetype: 'audio/mpeg',
      fileName: 'bienvenida.mp3'
    }, { quoted: m })
  }

  // Despedida
  if (chat.welcome && [28, 32].includes(m.messageStubType)) {
    return await conn.sendMessage(m.chat, {
      audio: { url: vn2 },
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: '',
          newsletterName: channelRD.name
        },
        forwardingScore: 9999999,
        isForwarded: true,
        mentionedJid: getMentionedJid(),
        externalAdReply: {
          title: '  ͟͞ Ａ Ｄ Ｉ Ｏ Ｓ ͟͞  ',
          body: `${userName}, se despide.`,
          previewType: 'PHOTO',
          thumbnailUrl: null,
          thumbnail: icons,
          sourceUrl: redes,
          showAdAttribution: true
        }
      },
      seconds: 4556,
      ptt: true,
      mimetype: 'audio/mpeg',
      fileName: 'bye.mp3'
    }, { quoted: m })
  }
}

export default handler
