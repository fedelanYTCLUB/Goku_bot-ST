import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎵';

  if (!args[0] || !args[0].startsWith('http')) {
    return conn.reply(m.chat, `${emoji} *Por favor, ingresa un enlace válido de YouTube.*\n\nEjemplo: *${usedPrefix + command} https://youtu.be/ryVgEcaJhwM*`, m);
  }

  const url = args[0];
  await conn.reply(m.chat, `${emoji} *Espera un momento mientras descargo el audio...*`, m);

  const apis = [
    `https://api.lolhuman.xyz/api/ytmp3?url=${url}`, // sin key, puede tardar
    `https://aemt.me/download/ytmp3?url=${url}`,
    `https://api.akuari.my.id/downloader/yta2?link=${url}`,
    `https://vihangayt.me/download/ytmp3?url=${url}`,
    `https://dl.shadoway.xyz/api/ytmp3?url=${url}`
  ];

  let success = false;

  for (let api of apis) {
    try {
      let res = await fetch(api);
      let json = await res.json();

      let audio, title;

      if (json.result?.link || json.result?.url) {
        audio = json.result.link || json.result.url;
        title = json.result.title || 'audio';
      } else if (json.result?.audio) {
        audio = json.result.audio;
        title = json.result.title || 'audio';
      } else if (json.url?.audio) {
        audio = json.url.audio;
        title = json.title || 'audio';
      } else {
        continue;
      }

      await conn.sendFile(
        m.chat,
        audio,
        `${title}.mp3`,
        `${emoji} *Aquí está tu canción:* *${title}*`,
        m,
        null,
        {
          mimetype: 'audio/mpeg',
          fileName: `${title}.mp3`
        }
      );

      success = true;
      break;
    } catch (err) {
      console.log(`[FALLÓ API]: ${api}\n${err.message}`);
    }
  }

  if (!success) {
    conn.reply(m.chat, `❌ *No se pudo descargar el mp3. Intenta con otro enlace o más tarde.*`, m);
  }
};

handler.help = ['ytmp3']
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio', 'ytmp3dl'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
