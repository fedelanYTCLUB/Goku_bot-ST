let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) return m.reply(`『✦』Uso correcto:\n*${usedPrefix + command} <enlace de grupo o canal>*`)

  let link = text.trim()
  let isGroup = link.includes('chat.whatsapp.com/')
  let isChannel = link.includes('whatsapp.com/channel/')

  let jid = null
  let nombre = 'Desconocido'
  let participantes = 'No disponible'

  try {
    if (isGroup) {
      let code = link.split('/').pop().trim()
      // Intenta obtener el JID sin unirse
      try {
        jid = await conn.groupAcceptInvite(code).then((id) => {
          // salir inmediatamente si se une
          conn.groupLeave(id)
          return id
        }).catch(() => `${code}@g.us`)
      } catch (e) {
        jid = `${code}@g.us`
      }

      let metadata = await conn.groupMetadata(jid).catch(() => null)
      if (metadata) {
        nombre = metadata.subject
        participantes = metadata.participants.length
      }
    } else if (isChannel) {
      let code = link.split('/').pop().trim()
      jid = `${code}@broadcast`
      // No se puede leer metadata de canales con esta API, solo mostrar el ID
    } else {
      return m.reply('『✦』El enlace no parece ser de un grupo ni de un canal de WhatsApp válido.')
    }

    let info = `
╭─「 *Inspección de Enlace* 」
│ ✦ *Nombre:* ${nombre}
│ ✎ *JID:* ${jid}
│ 👥 *Miembros:* ${participantes}
╰───────────────`.trim()

    return m.reply(info)

  } catch (e) {
    console.error(e)
    return m.reply('『✦』Hubo un error al procesar el enlace.')
  }
}

handler.help = ['inspeccionar <link>']
handler.tags = ['tools']
handler.command = ['inspeccionar']

export default handler
