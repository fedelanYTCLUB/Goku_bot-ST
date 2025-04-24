import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  const userJid = m.messageStubParameters[0];
  const chat = global.db.data.chats[m.chat];

  // Enviar solo el audio de bienvenida cuando un usuario entra
  if (chat.welcome && m.messageStubType === 27) {
    // Obtenemos el archivo de la URL de bienvenida
    const audioUrl = 'https://files.catbox.moe/6w3m3o.mp3';
    const audioBuffer = await fetch(audioUrl).then(res => res.buffer());
    
    // Enviar el audio de bienvenida
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m });
  }

  // Enviar solo el audio de despedida cuando un usuario sale
  if (chat.welcome && (m.messageStubType === 28 || m.messageStubType === 32)) {
    // Obtenemos el archivo de la URL de despedida
    const audioUrl = 'https://files.catbox.moe/c8ekzx.mp3';
    const audioBuffer = await fetch(audioUrl).then(res => res.buffer());

    // Enviar el audio de despedida
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m });
  }
}
