import fetch from 'node-fetch';

const newsletterJid = '120363402846939411@newsletter';
const newsletterName = '💛 Mai Bot ☕';
// Variables de branding que ya tienes definidas:
const packname = 'ׄMaisita 🍟';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎥';
  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 99,
    forwardedNewsletterMessageInfo: {
      newsletterJid,
      newsletterName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: packname,
      body: dev,
      thumbnail: icons,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  // Verificar que haya link
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `${emoji} *Pásame un link de YouTube para traer tu video.\n\nUso: *${usedPrefix + command} https://youtu.be/niOxDDhscYs*`,
      m,
      { contextInfo, quoted: m }
    );
  }

  const url = args[0];

  try {
    // Mensaje de espera
    await conn.reply(
      m.chat,
      `🪴 *E S P E R E*\n 🌺 Se está descargando su video, espere tantito..`,
      m,
      { contextInfo, quoted: m }
    );

    // Llamada a la API
    const res = await fetch(
      `https://dark-core-api.vercel.app/api/download/ytmp4/v2?key=api&url=${url}`
    );
    const json = await res.json();

    if (!json.download) {
      return conn.reply(
        m.chat,
        `${emoji} *No pude obtener el video.* Razón: ${json.message || 'desconocida'}`,
        m,
        { contextInfo, quoted: m }
      );
    }

    // Descargar buffer
    const videoRes    = await fetch(json.download);
    const videoBuffer = await videoRes.buffer();
    const title       = json.title   || 'video';
    const quality     = json.quality || 'Desconocida';
    const author      = json.author  || 'No disponible';
    const date        = json.date    || 'No disponible';

    // Enviar video
    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        caption: 
`${emoji} *Aqui tienes tu video*

🌻 *Título:* ${title}
👤 *Autor:* ${author}
📆 *Publicado:* ${date}
🎞️ *Calidad:* ${quality}p`,
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      },
      { contextInfo, quoted: m }
    );
  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `❌ *Ups… algo falló al descargar el video.*\nDetalles: ${e.message}`,
      m,
      { contextInfo, quoted: m }
    );
  }
};

handler.help = ['ytvideo'].map(v => v + ' *<link de YouTube>*');
handler.tags = ['descargas'];
handler.command = ['ytvideo', 'ytmp4dl'];
handler.register = true;
handler.limit = true;
handler.coin = 3;

export default handler;
