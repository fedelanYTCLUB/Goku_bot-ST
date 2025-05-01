import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, text }) => {
  let link = text.trim()
  if (!link) return m.reply('『✦』Por favor, proporciona o responde a un link de grupo o canal de WhatsApp.')

  let isGroup = link.includes('chat.whatsapp.com')
  let isChannel = link.includes('whatsapp.com/channel/')

  try {
    let jid

    if (isGroup) {
      let code = link.split('/').pop().trim()
      jid = await conn.groupAcceptInvite(code).catch(() => null) // Solo decodifica sin unirse
      if (!jid) jid = `${code}@g.us` // En caso de que no se pueda unir, intenta construir manualmente
    } else if (isChannel) {
      let code = link.split('/').pop().trim()
      jid = `${code}@broadcast`
    } else {
      return m.reply('『✦』El link no es válido. Asegúrate de que sea un enlace de grupo o canal.')
    }

    let metadata
    try {
      metadata = await conn.groupMetadata(jid)
    } catch (e) {
      metadata = null // Canal no se puede leer con groupMetadata
    }

    let nombre = metadata?.subject || 'Canal Desconocido'
    let participantes = metadata?.participants?.length || 'N/A'

    let info = `
╭─「 *Inspección de Enlace* 」
│ ✦ *Nombre:* ${nombre}
│ ✎ *JID:* ${jid}
│ 👥 *Miembros:* ${participantes}
╰───────────────`.trim()

    await m.reply(info)
  } catch (e) {
    console.error(e)
    m.reply('『✦』Ocurrió un error al inspeccionar el enlace.')
  }
}

handler.help = ['inspectlink <link>']
handler.tags = ['tools']
handler.command = ['inspectlink', 'inspeccionarlink', 'jid']

export default handler
