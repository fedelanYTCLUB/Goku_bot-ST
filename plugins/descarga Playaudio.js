import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`🌟 Ingresa un nombre o URL para buscar en YouTube.\n\n✨ *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    await m.react("⏱️"); // React immediately to show processing started

    // Use the new API endpoint that handles search and provides direct audio link
    const playApi = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(text)}`;
    const playResponse = await fetch(playApi);
    const playData = await playResponse.json();

    // Check if the API returned a successful result and data
    if (!playData || !playData.result || !playData.result.title || !playData.result.download?.url) {
        // Attempt to provide a more specific error if result is present but lacks crucial data
         if (playData && playData.result && playData.result.msg) {
             return m.reply(`⚠️ Error de la API: ${playData.result.msg}`);
         }
      return m.reply(`⚠️ No encontré resultados de audio para *"${text}"* o no se pudo obtener el audio.`);
    }

    const videoInfo = playData.result; // Data about the video/audio
    const audioUrl = videoInfo.download.url; // The direct audio URL

    const waitMessage = `☁️ *︙${videoInfo.title}*\n\n` +
      (videoInfo.channel ? `🎧 *Artista/Canal:* ${videoInfo.channel}\n` : '') + // Add channel if available
      (videoInfo.duration ? `⏳ *Duración:* ${videoInfo.duration}\n` : '') + // Add duration if available
      (videoInfo.views ? `👀 *Vistas:* ${videoInfo.views}\n` : '') + // Add views if available
      `\n➺ 𝑬𝒏𝒗𝒊𝒂𝒏𝒅𝒐 𝒍𝒂 𝒄𝒂𝒏𝒄𝒊ó𝒏...`; // Message before sending audio

    // Send the thumbnail and wait message
    // Check if image is available from the new API, otherwise skip image message
    if (videoInfo.thumbnail) {
         await conn.sendMessage(m.chat, {
              image: { url: videoInfo.thumbnail },
              caption: waitMessage.trim(),
              contextInfo: {
                  forwardingScore: 999,
                  isForwarded: true,
                  externalAdReply: {
                      title: "☕︎︎ 𝘔𝘢𝘪 • 𝑊𝑜𝑟𝑙𝑑 𝑂𝑓 𝐶𝑢𝑡𝑒 🍁",
                      body: "✐ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒 𝖶𝗂𝗋𝗄 🌵",
                      thumbnailUrl: videoInfo.thumbnail,
                      mediaUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY",
                      mediaType: 2,
                      showAdAttribution: true,
                      renderLargerThumbnail: true
                  }
              }
          }, { quoted: m });
    } else {
        // If no thumbnail, just send the caption as text
         await conn.sendMessage(m.chat, { text: waitMessage.trim() }, { quoted: m });
    }


    // Send the audio file
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: false, // Set to true if you want to send as voice message
      fileName: `🎵 ${videoInfo.title}.mp3`, // Use the title from the new API
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m });

    await m.react("✅"); // React with checkmark on success

  } catch (error) {
    console.error(error);
    m.reply(`❌ Ocurrió un error al procesar tu solicitud:\n${error.message}`);
    await m.react("❌"); // React with cross on error
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;
