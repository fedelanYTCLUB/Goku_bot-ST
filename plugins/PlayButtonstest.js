import fetch from 'node-fetch';

// Editado: Nuevo ID de canal (newsletterJid)
const newsletterJid  = '120363402846939411@newsletter';
// Manteniendo estos nombres como "Mai"
const newsletterName = 'Mai';
const packname       = 'Mai';

// Nombre de la bot
const botName = 'Mai';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🔎';
  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid, // Usa el nuevo newsletterJid
      newsletterName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: packname,
      body: dev, // Assuming 'dev' is defined elsewhere
      thumbnail: 'https://files.catbox.moe/vrcl7s.jpg', // Miniatura actual
      sourceUrl: redes, // Assuming 'redes' is defined elsewhere
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  if (!args[0]) {
    return conn.reply(
      m.chat,
      `🌸 Holii! Soy ${botName} 🎀 ¿Qué musiquita quieres buscar en YouTube? Dime dime~ ✨\n\n💖 Ejemplo:\n\`${usedPrefix + command} Goku conoce a Bills\``,
      m,
      { contextInfo, quoted: m }
    );
  }

  try {
    await conn.reply(
      m.chat,
      `💖 ${botName} está buscando tu cancioncita "${args.join(' ')}"... ¡Un momentito, por favor! 🎧✨`,
      m,
      { contextInfo, quoted: m }
    );

    const query   = encodeURIComponent(args.join(' '));
    const apiUrl  = `https://api.vreden.my.id/api/ytplaymp3?query=${query}`;
    const res     = await fetch(apiUrl);
    const json    = await res.json();

    if (json.status !== 200 || !json.result?.download?.url) {
      return conn.reply(
        m.chat,
        `😿 Oh, nooo... ${botName} no pudo encontrar ni descargar eso. Gomen ne~`,
        m,
        { contextInfo, quoted: m }
      );
    }

    // Metadata
    const meta = json.result.metadata;
    const title       = meta.title;
    const description = meta.description;
    const timestamp   = meta.timestamp;
    const views       = meta.views.toLocaleString();
    const ago         = meta.ago;
    const authorName  = meta.author?.name || 'Desconocido';
    const downloadURL = json.result.download.url;
    const quality     = json.result.download.quality;
    const filename    = json.result.download.filename;

    const audioRes    = await fetch(downloadURL);
    const audioBuffer = await audioRes.buffer();

    const caption = `
🌸 Tadaa! ✨ Aquí tienes la musiquita que buscaste con ${botName} 🎀🎶

📌 *Título:* ${title}
👤 *Autor:* ${authorName}
⏱️ *Duración:* ${timestamp}
📅 *Publicado:* ${ago}
👁️ *Vistas:* ${views}
🎧 *Calidad:* ${quality}
📝 *Descripción:*
${description}

Espero que te guste muchooo! 🥰
`.trim();

    await conn.sendMessage(
      m.chat,
      {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName: filename,
        ptt: false,
        caption
      },
      { contextInfo, quoted: m }
    );

  } catch (e) {
    console.error(e);
    await conn.reply(
      m.chat,
      `😭 Ahh! Algo salió mal... ${botName} encontró un error feo feo... 💔\n\`\`\`${e.message}\`\`\``,
      m,
      { contextInfo, quoted: m }
    );
  }
};

handler.help = ['play', 'ytplay'].map(v => v + ' <texto>');
handler.tags = ['descargas'];
handler.command = ['ytplay'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
