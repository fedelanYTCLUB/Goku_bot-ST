const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import yts from 'yt-search';

const limit = 10;
const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");
  try {
    await m.react("🌱");

    const res = await yts(text);
    const video = res.all[0];

    const caption = `
┏━━━꒰📻 YouTube Play ꒱━━━┓
┃
┃🌿 *Título:* ${video.title}
┃🌾 *Autor:* ${video.author.name}
┃🌱 *Duración:* ${video.duration.timestamp}
┃🌴 *Vistas:* ${video.views}
┃☘️ *URL:* ${video.url}
┃
┗━━━━━━━━━━━━━━━━━━━┛`.trim();

    await conn.sendFile(m.chat, video.thumbnail, 'thumb.jpg', caption, m);

    if (command === "play8" || command === "play") {
      const api = await (await fetch(`https://ytdl.sylphy.xyz/dl/mp3?url=${video.url}&quality=128`)).json();
      await conn.sendFile(m.chat, api.data.dl_url, api.data.title, '', m);
    } else if (command === "play2" || command === "playvid" || command === "play7") {
      const api = await (await fetch(`https://ytdl.sylphy.xyz/dl/mp4?url=${video.url}&quality=480`)).json();
      const isBig = api.data.size_mb >= limit;
      await conn.sendFile(m.chat, api.data.dl_url, api.data.title, '', m, null, { asDocument: isBig });
    }

    await m.react("✔️");
  } catch (e) {
    console.error(e);
    m.reply("❌ Ocurrió un error al procesar tu solicitud.");
  }
};

handler.help = ["play8", "play7", "playvid"];
handler.tags = ["dl"];
handler.command = ["play8", "play7", "playvid"];

export default handler;
