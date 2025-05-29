const handler = async (m, { conn }) => {
  const texto = `
🌳 _*Goku Bot ST*_ 🌳

\`\`\`Repositorio OFC:\`\`\`
https://github.com/fedelanYTCLUB/Goku_bot-ST

> 🍀 Deja tu estrellita ayudaría mucho :D

🔗 *Comunidad Oficial:* https://chat.whatsapp.com/FX6eYrqXtt9L76NDpOm2K7
  `.trim()

  await conn.reply(m.chat, texto, m)
}

handler.help = ['script']
handler.tags = ['info']
handler.command = ['script']

export default handler
