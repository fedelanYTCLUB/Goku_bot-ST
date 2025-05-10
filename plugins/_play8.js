const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import yts from 'yt-search';

const limit = 108; // límite de MB

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");

  try {
    await m.react("⏳");

    // Buscar el video en YouTube
    const search = await yts(text);
    const video = search.videos[0];
    if (!video) return m.reply("❌ No se encontró ningún resultado.");

    const url = video.url;

    // Descargar el video en 480p desde Sylphy
    const apiURL = `https://ytdl.sylphy.xyz/dl/mp4?url=${encodeURIComponent(url)}&quality=480`;
    const res = await fetch(apiURL);
    const json = await res.json();

    if (!json?.data?.dl_url) return m.reply("❌ No se pudo obtener el enlace de descarga.");

    const size = parseFloat(json.data.size_mb) || 0;
    const isBig = size >= limit;

    // Caption bien sincronizado
    const caption = `
🎬 *Título:* ${video.title}
🎤 *Autor:* ${video.author.name}
⏱️ *Duración:* ${video.duration.timestamp}
👁️‍🗨️ *Vistas:* ${video.views}
🔗 *URL:* ${url}
${isBig ? '📁 Enviado como documento por tamaño.' : ''}
`.trim();

    await conn.sendMessage(m.chat, {
      video: { url: json.data.dl_url },
      caption,
      mimetype: 'video/mp4',
      fileName: `${video.title}.mp4`,
      ...(isBig ? { mimetype: 'video/mp4', fileName: `${video.title}.mp4`, document: true } : {})
    }, { quoted: m });

    await m.react("✅");

  } catch (err) {
    console.error(err);
    m.reply("❌ Error al procesar el video.");
  }
};

handler.command = ["play2"];
handler.help = ["play2"];
handler.tags = ["dl"];

export default handler;
