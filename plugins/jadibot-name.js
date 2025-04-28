import ws from "ws";

let handler = async (m, { conn, args, text, command, usedPrefix, isOwner }) => {
  const users = [...new Set(
    global.conns
      .filter(conn => conn.user && conn.ws?.socket && conn.ws.socket.readyState !== ws.CLOSED)
      .map(conn => conn.user.jid)
  )];

  let isSubbot = users.includes(m.sender);  
  if (!isSubbot && !isOwner) 
    return m.reply("🚫 Solo un *subbot autorizado* puede usar este comando.");  

  if (!text) {  
    return m.reply(`🌟 ¡Ups! Debes especificar el *nuevo nombre* que quieres asignarle al bot.`);
  }

  global.db.data.settings[conn.user.jid].botName = text;

  let cap = `
┏━━━✦° 𓆩🌴𓆪 °✦━━━┓
┃ ✅ ¡Nombre actualizado exitosamente!
┃ 
┃ 🆔 *Usuario:* @${conn.user.jid.split("@")[0]}
┃ 📝 *Nuevo Nombre:* ${text}
┗━━━✦° 𓆩🌿𓆪 °✦━━━┛
`;

  conn.reply(m.chat, cap, m, { mentions: conn.parseMention(cap) });
}

handler.tags = ["serbot"];
handler.help = handler.command = ["setname"];
export default handler;
