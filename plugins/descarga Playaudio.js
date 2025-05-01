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

    const video = searchData.data[0];

    const waitMessage = `☁️ *︙${video.title}*\n\n` +
      `🎧 *Artista:* ${video.author.name}\n` +
      `⏳ *Duración:* ${video.duration}\n` +
      `👀 *Vistas:* ${video.views}\n` +
      `➺ 𝑬𝒔𝒑𝒆𝒓𝒂 𝒖𝒏 𝒑𝒐𝒒𝒖𝒊𝒕𝒐, 𝒆𝒔𝒕𝒂𝒎𝒐𝒔 𝒃𝒂𝒋𝒂𝒏𝒅𝒐 𝒕𝒖 𝒄𝒂𝒏𝒄𝒊ó𝒏...`;

    const waicontext = {
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,         // Define esto
          newsletterName: channelRD.name,      // Define esto
          serverMessageId: -1
        },
        forwardingScore: 16,
        externalAdReply: {
          title: "☕︎︎ 𝘔𝘢𝘪 • 𝑊𝑜𝑟𝑙𝑑 𝑂𝑓 𝐶𝑢𝑡𝑒🐤",
          body: "✐ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒 𝖶𝗂𝗋𝗄 💛",
          thumbnailUrl: banner,                // Define esto
          sourceUrl: redes,                    // Define esto
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    };

    // Imagen con waitMessage como si viniera del canal
    await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: waitMessage.trim(),
      ...waicontext
    }, { quoted: m });

    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    const audioUrl = downloadData.result.download.url;

    // Audio también como si viniera del canal
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `🎵 ${video.title}.mp3`,
      ...waicontext
    }, { quoted: m });

    await m.react("✨");
  } catch (error) {
    console.error(error);
    m.reply(`❌ Ocurrió un error:\n${error.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;
