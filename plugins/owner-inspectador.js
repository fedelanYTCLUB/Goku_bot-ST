let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) return m.reply(`『✦』Uso correcto:\n*${usedPrefix + command} <enlace del canal>*`)

  if (!text.includes('whatsapp.com/channel/')) return m.reply('『✦』El enlace debe ser de un canal de WhatsApp.')

  try {
    const code = text.trim().split('/').pop()
    const result = await conn.groupGetInviteInfo(code)

    if (!result.id || !result.id.endsWith('@newsletter')) {
      return m.reply('『✦』No se pudo obtener la ID real del canal.')
    }

    let info = `
╭─「 *Canal Inspeccionado* 」
│ ✦ *Nombre:* ${result.subject || 'Desconocido'}
│ ✎ *ID real:* ${result.id}
│ 🗓️ *Creado:* ${result.creation ? new Date(result.creation * 1000).toLocaleString() : 'N/A'}
╰───────────────`.trim()

    m.reply(info)
  } catch (e) {
    console.log(e)
    m.reply('『✦』Error al inspeccionar el canal. Asegúrate de que el enlace sea válido y que el bot no esté bloqueado.')
  }
}

handler.help = ['inspeccionar <enlace>']
handler.tags = ['tools']
handler.command = ['inspeccionar']

export default handler
