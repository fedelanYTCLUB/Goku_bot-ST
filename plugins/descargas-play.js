import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn: star, args, usedPrefix, command }) => {
  if (!args || !args[0]) {
    return star.reply(
      m.chat,
      `✦ *¡Ingresa el texto o enlace del vídeo de YouTube!*\n\n» *Ejemplo:*\n> *${usedPrefix + command}* Canción de ejemplo`,
      m
    );
  }

  await m.react('🕓');

  try {
    let query = args.join(' ');
    let isUrl = query.match(/youtu/gi);

    let video;
    if (isUrl) {
      let ytres = await yts({ videoId: query.split('v=')[1] });
      video = ytres.videos[0];
    } else {
      let ytres = await yts(query);
      video = ytres.videos[0];
      if (!video) {
        return star.reply(m.chat, '✦ *Video no encontrado.*', m).then(() => m.react('✖️'));
      }
    }

    let { title, thumbnail, timestamp, views, ago, url, author } = video;

    let api = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${url}`);
    let json = await api.json();
    let { data } = json;

    if (!data || !data.dl) {
      return star.reply(m.chat, '✦ *Error al obtener el enlace de descarga desde la API.*', m).then(() => m.react('✖️'));
    }

    let { dl: downloadUrl, size: sizeHumanReadable } = data;

    let txt = `*「✦」 » ${title}*\n`;
    txt += `> ✦ Canal » *${author.name}*\n`;
    txt += `> ⴵ *Duración* » ${timestamp}\n`;
    txt += `> ✰ *Vistas* » ${views}\n`;
    txt += `> ✐ *Publicación* » ${ago}\n`;
    txt += `> ❒ *Tamaño:* » ${sizeHumanReadable} MB\n`;
    txt += `> 🜸 *Link* » ${url}`;

    await star.sendFile(m.chat, thumbnail, 'thumbnail.jpg', txt, m);

    await star.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      },
      { quoted: m }
    );

    await m.react('📄');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    star.reply(m.chat, '✦ *Ocurrió un error al procesar tu solicitud. Intenta nuevamente más tarde.*', m);
  }
};

handler.command = ['play2', 'playvidoc'];
export default handler;
