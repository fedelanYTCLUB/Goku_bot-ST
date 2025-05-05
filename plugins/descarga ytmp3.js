import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎵';
  const fail = `❌ *No se pudo obtener el audio. Intenta con otro enlace.*`;

  if (!args[0] || !args[0].startsWith('http')) {
    return conn.reply(m.chat, `${emoji} *Por favor ingresa un enlace válido de YouTube.*\n\nEjemplo: *${usedPrefix + command} https://youtu.be/dQw4w9WgXcQ*`, m);
  }

  const url = args[0];
  await conn.reply(m.chat, `${emoji} *Procesando tu audio... espera un momento.*`, m);

  let success = false;

  // Método 1: API de Vreden
  try {
    let res = await fetch(`https://api.vreden.pw/ytmp3?url=${url}`);
    let json = await res.json();

    if (json.status && json.result && json.result.audio) {
      let audioURL = json.result.audio;
      let title = json.result.title || 'audio';

      await conn.sendFile(
        m.chat,
        audioURL,
        `${title}.mp3`,
        `${emoji} *Aquí tienes tu canción:* *${title}*`,
        m,
        null,
        { mimetype: 'audio/mpeg', fileName: `${title}.mp3` }
      );

      success = true;
    }
  } catch (e) {
    console.log('[Vreden Error]', e.message);
  }

  // Método 2: YTDLP como respaldo
  if (!success) {
    try {
      let res = await fetch(`https://ytdl.shadoway.xyz/api/audio?url=${url}`);
      let json = await res.json();

      if (json.status && json.audio) {
        let audioURL = json.audio;
        let title = json.title || 'audio';

        await conn.sendFile(
          m.chat,
          audioURL,
          `${title}.mp3`,
          `${emoji} *Aquí está tu canción:* *${title}*`,
          m,
          null,
          { mimetype: 'audio/mpeg', fileName: `${title}.mp3` }
        );

        success = true;
      }
    } catch (e) {
      console.log('[YTDLP Error]', e.message);
    }
  }

  if (!success) {
    conn.reply(m.chat, fail, m);
  }
};

handler.help = ['ytmp3']
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
