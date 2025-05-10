const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import yts from 'yt-search';

const limit = 108;
const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");
  try {
    await m.react("🕛");

    const res = await yts(text + ' ' + Date.now()); // Previene caché
    const video = res?.all?.[0];
    if (!video) return m.reply("❌ No se encontró el video. Intenta con otro nombre.");

    const caption = `
┏━ 🎥 *Video Info* 🎥 ━┓
┃ 🎵 *Título:* ${video.title}
┃ 🎤 *Autor:* ${video.author.name}
┃ ⏱️ *Duración:* ${video.duration.timestamp}
┃ 👁️‍🗨️ *Vistas:* ${video.views}
┃ 🌍 *URL:* ${video.url}
┗━━━━━━━━━━━━━┛`.trim();

    await conn.sendFile(m.chat, video.thumbnail, 'thumb.jpg', caption, m);

    if (command === "play2" || command === "playvid") {
      const api = await (await fetch(`https://ytdl.sylphy.xyz/dl/mp4?url=${video.url}&quality=480&nocache=${Date.now()}`)).json();

      if (!api?.data?.dl_url) return m.reply("❌ No se pudo obtener el enlace de descarga.");
      
      const size = parseFloat(api.data.size_mb) || 0;
      const isBig = size >= limit;

      await conn.sendFile(m.chat, api.data.dl_url, `${api.data.title}.mp4`, '', m, null, {
        asDocument: isBig,
        mimetype: 'video/mp4'
      });
    }

    await m.react("✅");
  } catch (e) {
    console.error(e);
    m.reply("❌ Ocurrió un error al procesar tu solicitud.");
  }
};

handler.help = ["play2", "playvid"];
handler.tags = ["dl"];
handler.command = ["play2", "playvid"];

export default handler;
