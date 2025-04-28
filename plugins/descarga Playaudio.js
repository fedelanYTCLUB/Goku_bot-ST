import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`🌟 Ingresa un nombre para buscar en YouTube.\n\n✨ *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply(`⚠️ No encontré resultados para *"${text}"*...`);
    }

    const video = searchData.data[0]; // Primer resultado
    const waitMessage = `☁️ *︙${video.title}*\n\n` +
      `🎧 *Artista:* ${video.author.name}\n` +
      `⏳ *Duración:* ${video.duration}\n` +
      `👀 *Vistas:* ${video.views}\n` +
      `📅 *Publicado:* ${video.published}\n\n` +
      `➺ 𝑬𝒔𝒑𝒆𝒓𝒂 𝒖𝒏 𝒑𝒐𝒒𝒖𝒊𝒕𝒐, 𝒔𝒆 𝒆𝒔𝒕á 𝒅𝒆𝒔𝒄𝒂𝒓𝒈𝒂𝒏𝒅𝒐...`;

    await m.reply(waitMessage.trim()); // Mensaje de espera kawaii bonito

    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    await conn.sendMessage(m.chat, {
      audio: { url: downloadData.result.download.url },
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react("✨"); // Reacción kawaii
  } catch (error) {
    console.error(error);
    m.reply(`❌ Ocurrió un error:\n${error.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;
