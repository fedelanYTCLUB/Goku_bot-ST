let handler = async (m, { conn, text, args }) => {
  let targetJid

  if (m.quoted && m.quoted.participant) {
    targetJid = m.quoted.participant
  } else if (m.quoted && m.quoted.key?.remoteJid) {
    targetJid = m.quoted.key.remoteJid
  } else if (text && text.includes('@g.us')) {
    targetJid = text.trim()
  } else {
    return m.reply('『✦』Responde a un mensaje del grupo o canal que deseas inspeccionar, o proporciona su JID.')
  }

  try {
    const metadata = await conn.groupMetadata(targetJid)
    const nombre = metadata.subject
    const participantes = metadata.participants.length

    let info = `
╭─「 *Inspección de Grupo/Canal* 」
│ ✦ *Nombre:* ${nombre}
│ ✎ *ID:* ${targetJid}
│ 👥 *Miembros:* ${participantes}
╰───────────────
`.trim()

    await m.reply(info)
  } catch (e) {
    await m.reply(`『✦』No se pudo inspeccionar el JID: ${targetJid}\nAsegúrate de que sea un grupo o canal válido.`)
  }
}

handler.help = ['inspect [responder o jid]']
handler.tags = ['tools']
handler.command = ['inspect', 'inspeccionar']

export default handler
