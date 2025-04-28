import fs from "fs";
import path from "path";
import crypto from "crypto";
import fetch from "node-fetch";
import FormData from "form-data";
import ws from "ws";

let handler = async (m, { conn, args, text, command, usedPrefix, isOwner }) => {
    const users = [...new Set(
        global.conns
            .filter(conn => conn.user && conn.ws?.socket && conn.ws.socket.readyState !== ws.CLOSED)
            .map(conn => conn.user.jid)
    )];

    let isSubbot = users.includes(m.sender);
    if (!isSubbot && !isOwner) 
        return m.reply("❌ *Acceso denegado:* Solo un *subbot autorizado* puede utilizar este comando.");

    if (!args[0]) {
        return m.reply(`🌟 *¡Falta la categoría!* Especifica en qué sección quieres cambiar la imagen.
    
📋 *Opciones disponibles:*
- \`welcome\` ➔ Cambiar imagen de bienvenida.
- \`banner\` ➔ Cambiar imagen del menú.

✏️ *Ejemplo de uso:*
➔ ${usedPrefix + command} welcome
`);
    }

    let q = m.quoted ? m.quoted : m;
    if (!q) return m.reply(`📸 *¡Falta imagen!* Responde a una imagen que quieras usar como logo.`);

    let buffer;
    try {
        buffer = await q.download();
    } catch (e) {
        if (q.url) {
            buffer = await fetch(q.url).then(res => res.buffer());
        }
    }
    if (!buffer) return m.reply("⚡ *Error:* No se pudo descargar la imagen. Asegúrate de responder a una imagen válida.");

    let mimeType = q.mimetype || "application/octet-stream";
    let ext = mimeType.includes("/") ? mimeType.split("/")[1] : "bin";
    let name = crypto.randomBytes(5).toString("hex") + "." + ext;
    let filePath = `./${name}`;
    fs.writeFileSync(filePath, buffer);

    let file = await upload(filePath);
    fs.unlinkSync(filePath);

    if (!file || !file[0]?.url) 
        return m.reply("⚠️ *Error al subir la imagen.* Intenta nuevamente más tarde.");

    let isWel = /wel|welcome$/.test(args[0]?.toLowerCase() || "");
    let cap = `
┏━✦ 𓆩🌿𓆪 ✦━┓
✨ ¡Imagen actualizada exitosamente!
   
🏷️ *Sección:* ${isWel ? "Bienvenida" : "Menú principal"}
👤 *Usuario:* @${conn.user.jid.split("@")[0]}
┗━✦ 𓆩🌴𓆪 ✦━┛
`;

    if (!global.db.data.settings[conn.user.jid]) {
        global.db.data.settings[conn.user.jid] = { logo: {} };
    }

    if (args[0] === "banner" || args[0] === "welcome") {
        global.db.data.settings[conn.user.jid].logo[args[0]] = file[0].url;
        conn.sendMessage(m.chat, { image: { url: file[0].url }, caption: cap, mentions: conn.parseMention(cap) }, { quoted: m });
    } else {
        return m.reply("❌ *Opción no válida.* Verifica que la categoría sea welcome o banner.");
    }
}

handler.tags = ["serbot"];
handler.help = handler.command = ["setlogo", "set"];
export default handler;

async function upload(filePath) {
    try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));

        const response = await fetch("https://cdnmega.vercel.app/upload", {
            method: "POST",
            body: formData,
            headers: formData.getHeaders()
        });

        const result = await response.json();
        return result.success ? result.files : null;
    } catch (error) {
        console.error("Error al subir archivo:", error);
        return null;
    }
  }
