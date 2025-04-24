import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  const userJid = m.messageStubParameters[0];

  const chat = global.db.data.chats[m.chat];

  // Enviar solo el audio de bienvenida cuando un usuario entra
  if (chat.welcome && m.messageStubType === 27) {
    // Enviar el audio de bienvenida usando mimetype
    await conn.sendFile(m.chat, 'https://files.catbox.moe/6w3m3o.mp3', 'bienvenida.mp3', '', m, true, { mimetype: 'audio/mp4', ptt: true });
  }

  // Enviar solo el audio de despedida cuando un usuario sale
  if (chat.welcome && (m.messageStubType === 28 || m.messageStubType === 32)) {
    // Enviar el audio de despedida usando mimetype
    await conn.sendFile(m.chat, 'https://files.catbox.moe/c8ekzx.mp3', 'despedida.mp3', '', m, true, { mimetype: 'audio/mp4', ptt: true });
  }
}
