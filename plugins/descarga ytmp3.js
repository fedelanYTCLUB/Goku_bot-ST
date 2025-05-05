import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎵';

  if (!args[0] || !args[0].startsWith('http')) {
    return conn.reply(m.chat, `${emoji} *Por favor, ingresa un enlace válido de YouTube.*\n\nEjemplo: *${usedPrefix + command} https://youtu.be/ryVgEcaJhwM*`, m);
  }

  const url = args[0];

  try {
    await conn.reply(m.chat, `${emoji} *Espérame tantito... estoy convirtiendo el video en mp3 para ti...*`, m);

    const res = await fetch(`https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (!data || data.status !== 200 || !data.result || !data.result.audio) {
      return conn.reply(m.chat, `${emoji} *No se pudo obtener el audio del video. Puede que el enlace no sea válido o la API esté fallando.*`, m);
    }

    const audioURL = data.result.audio;
    const title = data.result.title || 'audio';

    await conn.sendFile(m.chat, audioURL, `${title}.mp3`, `${emoji} *Aquí tienes tu canción:* *${title}*`, m, null, {
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    });

  } catch (error) {
    console.error(error);
    return conn.reply(m.chat, `⚠️ *Ocurrió un error inesperado:*\n${error.message}`, m);
  }
};

handler.help = ['ytmp3']
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'ytmp3dl'];
handler.register = true;
handler.limit = true;
handler.coin = 1;

export default handler;
