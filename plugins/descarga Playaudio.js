import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`🌟 Ingresa un nombre para buscar en YouTube.\n\n✨ *Ejemplo:* ${usedPrefix + command} Shakira`);

  try {
    await m.react("⏱️"); // React to show processing started

    // --- PRIMER PASO: BUSCAR VIDEO (Se mantiene como antes) ---
    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      await m.react("❌");
      return m.reply(`⚠️ No encontré resultados de video en YouTube para *"${text}"*...`);
    }

    const video = searchData.data[0]; // Tomamos el primer resultado de la búsqueda

    const waitMessage = `☁️ *︙${video.title}*\n\n` +
      `🎧 *Artista:* ${video.author.name}\n` +
      `⏳ *Duración:* ${video.duration}\n` +
      `👀 *Vistas:* ${video.views}\n\n` +
      `➺ 𝑬𝒔𝒑𝒆𝒓𝒂 𝒖𝒏 𝒑𝒐𝒒𝒖𝒊𝒕𝒐, 𝒆𝒔𝒕𝒂𝒎𝒐𝒔 𝒃𝒂𝒋𝒂𝒏𝒅𝒐 𝒕𝒖 𝒄𝒂𝒏𝒄𝒊ó𝒏...`;

    // Enviamos la miniatura y el mensaje de espera (Se mantiene como antes)
    const message = await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: waitMessage.trim(),
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "☕︎︎ 𝘔𝘢𝘪 • 𝑊𝑜𝑟𝑙𝑑 𝑂𝑓 𝐶𝑢𝑡𝑒 🍁",
          body: "✐ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒 𝖶𝗂𝗋𝗄 🌵",
          thumbnailUrl: video.image,
          mediaUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY",
          mediaType: 2,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    // --- SEGUNDO PASO: DESCARGAR AUDIO (Aquí se usa la nueva URL con el título del video encontrado) ---
    // Usamos el título del video encontrado como query para la nueva API de descarga/reproducción
    const downloadApi = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(video.title)}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    // Verificamos la respuesta de la nueva API
    if (!downloadData?.result?.download?.url) {
      await m.react("❌");
      // Podría haber un mensaje de error específico de la API
       if (downloadData && downloadData.result && downloadData.result.msg) {
             return m.reply(`❌ No se pudo obtener el audio del video usando el título. Error de la API: ${downloadData.result.msg}`);
       }
      return m.reply("❌ No se pudo obtener el audio del video.");
    }

    const audioUrl = downloadData.result.download.url; // Obtenemos la URL del audio

    // Enviamos el audio (Se mantiene similar, usando la URL obtenida)
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `🎵 ${video.title}.mp3`, // Usamos el título del primer paso para el nombre del archivo
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
