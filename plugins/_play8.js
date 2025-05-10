const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
import yts from 'yt-search';

const limit = 108;

async function getVideoInfo(text) {
  const search = await yts(text);
  return search.videos?.[0];
}

async function trySources(videoUrl) {
  const apis = [
    `https://ytdl.sylphy.xyz/dl/mp4?url=${videoUrl}&quality=480`,
    `https://aemt.me/ytdl?url=${videoUrl}`,
    `https://yt.tiochat.net/mp4?url=${videoUrl}`
  ];

  for (let api of apis) {
    try {
      const res = await fetch(api);
      const json = await res.json();
      if (json?.data?.dl_url || json?.url || json?.result?.url) return json;
    } catch (e) {
      continue;
    }
  }

  return null;
}

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");
  try {
    await m.react("⏳");

    const video = await getVideoInfo(text);
    if (!video) return m.reply("❌ No se encontró ningún video.");
    const url = video.url;

    const json = await trySources(url);
    if (!json) return m.reply("❌ No se pudo obtener el enlace de descarga.");

    // Detectar URL y tamaño
    const dl_url = json?.data?.dl_url || json?.url || json?.result?.url;
    const title = json?.data?.title || video.title;
    const size = parseFloat(json?.data?.size_mb || json?.size || 0);
    const isBig = size >= limit;

    const caption = `
🎬 *Título:* ${title}
🎤 *Autor:* ${video.author.name}
⏱️ *Duración:* ${video.duration.timestamp}
👁️‍🗨️ *Vistas:* ${video.views}
🔗 *URL:* ${url}
${isBig ? '📁 Enviado como documento por tamaño.' : ''}
`.trim();

    await conn.sendMessage(m.chat, {
      video: { url: dl_url },
      caption,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      ...(isBig ? { document: true } : {})
    }, { quoted: m });

    await m.react("✅");

  } catch (e) {
    console.error(e);
    m.reply("❌ Error inesperado al procesar el video.");
  }
};

handler.command = ["play2"];
handler.help = ["play2"];
handler.tags = ["dl"];

export default handler;
