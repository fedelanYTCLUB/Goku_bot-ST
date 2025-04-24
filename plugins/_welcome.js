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
    await conn.sendFile(m.chat, 'https://files.catbox.moe/6w3m3o.mp3', 'bienvenida.mp3', null, m, true, {
      type: 'audioMessage',
      ptt: true
    });
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
    await conn.sendFile(m.chat, 'https://files.catbox.moe/c8ekzx.mp3', 'despedida.mp3', null, m, true, {
      type: 'audioMessage',
      ptt: true
    });
  }
}
