const handler = async (m, { conn }) => {
  const message = `
🌸 _*Mai Bot Sc*_ 🌸

\`\`\`Repositorio OFC:\`\`\`
https://github.com/Ado926/MaiBot

> 🌻 Deja tu estrellita ayudaría mucho :D

🔗 *Comunidad Oficial:* https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY
  `;
  await conn.reply(m.chat, message.trim(), m);
};

handler.command = ['script'];
handler.help = ['script'];
handler.tags = ['info'];

export default handler;
