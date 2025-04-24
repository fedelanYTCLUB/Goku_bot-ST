import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  const userJid = m.messageStubParameters[0];
  const userTag = `@${userJid.split('@')[0]}`;
  const pp = await conn.profilePictureUrl(userJid, 'image').catch(() => 'https://files.catbox.moe/un7lt7.jpg');
  const img = await (await fetch(pp)).buffer();

  const chat = global.db.data.chats[m.chat];
  const groupName = groupMetadata.subject;
  let groupSize = participants.length;

  if (m.messageStubType === 27) groupSize++;
  if (m.messageStubType === 28 || m.messageStubType === 32) groupSize--;

  const welcomeTitle = '✦˚｡･ﾟ✧ Bienvenid@ ✧˚｡･ﾟ✦';
  const goodbyeTitle = '✦˚｡･ﾟ✧ Hasta pronto ✧˚｡･ﾟ✦';

  if (chat.welcome && m.messageStubType === 27) {
    const bienvenida = `
╭┈┈ ୨♡୧ ┈┈╮
│ ¡Hola ${userTag}!
│ Bienvenid@ a *${groupName}*  
│
│ ✦ Somos *${groupSize}* personitas aquí.
│ ✦ Esperamos que la pases bonito.
│ ✦ Usa *#help* para conocer a Mai.
╰┈┈┈┈┈┈┈┈╯`.trim();

    await conn.sendMini(m.chat, welcomeTitle, dev, bienvenida, img, img, redes, fkontak);
  }

  if (chat.welcome && (m.messageStubType === 28 || m.messageStubType === 32)) {
    const despedida = `
╭┈┈ ୨♡୧ ┈┈╮
│ ${userTag} ha salido de *${groupName}*
│
│ ✦ Ahora quedamos *${groupSize}* miembros.
│ ✦ ¡Te vamos a extrañar!
│ ✦ Regresa cuando quieras.
╰┈┈┈┈┈┈┈┈╯`.trim();

    await conn.sendMini(m.chat, goodbyeTitle, dev, despedida, img, img, redes, fkontak);
  }
}
import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';  // Asegúrate de tener 'node-fetch' instalado.

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  const userJid = m.messageStubParameters[0];
  const chat = global.db.data.chats[m.chat];

  // Enviar solo el audio de bienvenida cuando un usuario entra
  if (chat.welcome && m.messageStubType === 27) {
    const bienvenidaUrl = 'https://files.catbox.moe/6w3m3o.mp3';
    
    // Descargar el audio de la URL y convertirlo a buffer
    const bienvenidaAudio = await fetch(bienvenidaUrl);
    const bienvenidaBuffer = await bienvenidaAudio.buffer();
    
    // Enviar el audio de bienvenida usando sendFile
    await conn.sendFile(m.chat, bienvenidaBuffer, 'bienvenida.mp3', '', m, true, { mimetype: 'audio/mp4', ptt: true });
  }

  // Enviar solo el audio de despedida cuando un usuario sale
  if (chat.welcome && (m.messageStubType === 28 || m.messageStubType === 32)) {
    const despedidaUrl = 'https://files.catbox.moe/c8ekzx.mp3';
    
    // Descargar el audio de la URL y convertirlo a buffer
    const despedidaAudio = await fetch(despedidaUrl);
    const despedidaBuffer = await despedidaAudio.buffer();

    // Enviar el audio de despedida usando sendFile
    await conn.sendFile(m.chat, despedidaBuffer, 'despedida.mp3', '', m, true, { mimetype: 'audio/mp4', ptt: true });
  }
}import { WAMessageStubType } from '@whiskeysockets/baileys';
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
