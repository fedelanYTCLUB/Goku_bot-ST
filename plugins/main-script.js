const handler = async (m, { conn, text, command }) => {
  try {
    // Verifica si el comando es 'script'
    if (command === 'script') {
      // Responde con el mensaje profesional y emojis
      const message = `
🌸 _*Mai Bot Sc*_  🌸

```Repositorio OFC:```
https://github.com/Ado926/MaiBot

> 🌻 Deja tu estrellita ayudaría mucho :D

🔗 *Comunidad Oficial* https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY
      `;
      // Envía el mensaje
      await conn.reply(m.chat, message, m);
    }
  } catch (error) {
    console.error("Error en el comando 'script':", error);
    return m.reply(`⚠️ *Hubo un error al procesar tu solicitud.*`);
  }
};

handler.command = handler.help = ['script'];
handler.tags = ['info'];

export default handler;
