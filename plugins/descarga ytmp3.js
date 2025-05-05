import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

var handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '🎵';
  if (!args[0] || !args[0].startsWith('http')) {
    return conn.reply(m.chat, `${emoji} *Ingresa un enlace válido de YouTube.*\nEjemplo: ${usedPrefix + command} https://youtu.be/ryVgEcaJhwM`, m);
  }

  const url = args[0];
  const id = Math.floor(Math.random() * 999999);
  const output = path.join(__dirname, `tmp-audio-${id}.mp3`);

  conn.reply(m.chat, `${emoji} *Descargando audio... espera unos segundos.*`, m);

  const ytdlp = spawn('yt-dlp', [
    '-x', '--audio-format', 'mp3',
    '-o', output,
    url
  ]);

  ytdlp.stderr.on('data', data => console.log('[yt-dlp]', data.toString()));
  ytdlp.on('close', async code => {
    if (code !== 0) {
      return conn.reply(m.chat, '❌ *Error al convertir el video a audio.*', m);
    }

    let title = `audio-${id}.mp3`;
    await conn.sendFile(m.chat, output, title, `${emoji} *Aquí está tu audio convertido.*`, m, null, {
      mimetype: 'audio/mpeg',
      fileName: title
    });

    fs.unlinkSync(output); // Limpieza del archivo
  });
};

handler.help = ['ytmp3'].map(v => v + ' <enlace>');
handler.tags = ['descargas'];
handler.command = ['ytmp3', 'ytaudio'];
handler.register = true;
handler.limit = true;
handler.coin = 2;

export default handler;
