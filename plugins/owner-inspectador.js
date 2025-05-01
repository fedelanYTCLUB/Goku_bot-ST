let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return m.reply(`『✦』Uso correcto:\n*${usedPrefix + command} <enlace de canal>*`)

  if (!text.includes('whatsapp.com/channel/')) return m.reply('『✦』El enlace debe ser de un canal de WhatsApp.')

  let code = text.trim().split('/').pop()
  let id = `${code}@newsletter`

  let res = `
╭─「 *Inspección de Canal* 」
│ ✦ *Enlace:* ${text}
│ ✎ *ID:* ${id}
╰───────────────`.trim()

  m.reply(res)
}

handler.help = ['inspeccionar <enlace>']
handler.tags = ['tools']
handler.command = ['inspeccionar']

export default handler
