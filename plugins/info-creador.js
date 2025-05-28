import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    await m.react('👑');

    if (!['owner', 'creator', 'creador', 'dueño'].includes(command.toLowerCase())) {
        return conn.sendMessage(m.chat, { text: `El comando ${command} no existe.` });
    }

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(who);
    let edtr = `@${m.sender.split('@')[0]}`;
    let username = conn.getName(m.sender);

    let list = [{
        displayName: "fede - Creador de Goku 🌹",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN: fede - Bot Developer\nitem1.TEL;waid=5491156178758:5491156178758\nitem1.X-ABLabel:Número\nitem2.ADR:;;Argentina;;;;\nitem2.X-ABLabel:País\nEND:VCARD`,
    }];

    const imageUrl = 'https://files.catbox.moe/jl731y.jpg';
    const texto = `╭───────❀\n│ *Contacto del creador*\n╰───────❀\n\n• *Nombre:* fede\n• *Desde:* Argentina\n• *Creador de:* Goku\n\n_“El código es temporal, pero la creatividad... esa es eterna.”_\n\nPuedes contactarlo si tienes ideas, bugs o quieres apoyar el proyecto..`;

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${list.length} Contacto`,
            contacts: list
        },
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: 'Goku - Bot Fede',
                body: 'Creador: fedelanYT',
                thumbnailUrl: imageUrl,
                sourceUrl: 'https://github.com/fedelanYTCLUB',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { text: texto }, { quoted: m });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
