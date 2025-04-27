import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, '🌸 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧 𝙞𝙣𝙜𝙧𝙚𝙨𝙖 𝙪𝙣 𝙩𝙚́𝙧𝙢𝙞𝙣𝙤 𝙥𝙖𝙧𝙖 𝙗𝙪𝙨𝙘𝙖𝙧.', m);

    await m.react('🔎');
    try {
        let searchResults = await searchVideos(args.join(" "));
        let spotifyResults = await searchSpotify(args.join(" "));
        
        if (!searchResults.length && !spotifyResults.length) throw new Error('No se encontraron resultados.');

        let video = searchResults[0];
        let thumbnail = await (await fetch(video.miniatura)).buffer();

        let messageText = `┏━━━━━━━━━━━━━┓\n`;
        messageText += `🎧 *𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝖯𝗅𝖺𝗒* 🎧\n`;
        messageText += `┗━━━━━━━━━━━━━┛\n\n`;
        messageText += `*📜 Título:* ${video.titulo}\n`;
        messageText += `*⏳ Duración:* ${video.duracion || 'No disponible'}\n`;
        messageText += `*👤 Autor:* ${video.canal || 'Desconocido'}\n`;
        messageText += `*📅 Publicado:* ${convertTimeToSpanish(video.publicado)}\n`;
        messageText += `*🔗 Link:* ${video.url}\n`;

        let ytSections = searchResults.slice(1, 11).map((v, index) => ({
            title: `🎵 ${index + 1}┃ ${v.titulo}`,
            rows: [
                {
                    title: `🎶 Descargar MP3`,
                    description: `🎵 Duración: ${v.duracion || 'No disponible'}`, 
                    id: `${usedPrefix}ytmp3 ${v.url}`
                },
                {
                    title: `🎥 Descargar MP4`,
                    description: `🎵 Duración: ${v.duracion || 'No disponible'}`, 
                    id: `${usedPrefix}ytmp4 ${v.url}`
                }
            ]
        }));

        let spotifySections = spotifyResults.slice(0, 10).map((s, index) => ({
            title: `🎶 ${index + 1}┃ ${s.titulo}`,
            rows: [
                {
                    title: `🎵 Descargar Audio`,
                    description: `🎵 Duración: ${s.duracion || 'No disponible'}`, 
                    id: `${usedPrefix}spotify ${s.url}`
                }
            ]
        }));

        await conn.sendMessage(m.chat, {
            image: thumbnail,
            caption: messageText,
            footer: '🌟 𝘌𝘭𝘪𝘨𝘦 𝘶𝘯 𝘵𝘪𝘱𝘰 𝘥𝘦 𝘥𝘦𝘴𝘤𝘢𝘳𝘨𝘢 𝘥𝘦𝘴𝘥𝘦 𝘭𝘰𝘴 𝘣𝘰𝘵𝘰𝘯𝘦𝘴.',
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            },
            buttons: [
                {
                    buttonId: `${usedPrefix}ytmp3 ${video.url}`,
                    buttonText: { displayText: '🎧 𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳 𝘈𝘶𝘥𝘪𝘰' },
                    type: 1,
                },
                {
                    buttonId: `${usedPrefix}ytmp4 ${video.url}`,
                    buttonText: { displayText: '🎥 𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳 𝘝𝘪𝘥𝘦𝘰' },
                    type: 1,
                },
                {
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🔍 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨 𝙔𝙤𝙪𝙏𝙪𝙗𝙚',
                            sections: ytSections,
                        }),
                    },
                },
                {
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                            title: '🎶 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨 𝙎𝙥𝙤𝙩𝙞𝙛𝙮',
                            sections: spotifySections,
                        }),
                    },
                },
            ],
            headerType: 1,
            viewOnce: false
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('❌');
        conn.reply(m.chat, '⚠️ *𝙀𝙧𝙧𝙤𝙧 𝙖𝙡 𝙗𝙪𝙨𝙘𝙖𝙧 𝙚𝙡 𝙫𝙞𝙙𝙚𝙤.*', m);
    }
};

handler.help = ['play *<texto>*'];
handler.tags = ['dl'];
handler.command = ['playtest'];
export default handler;

async function searchVideos(query) {
    try {
        const res = await yts(query);
        return res.videos.slice(0, 10).map(video => ({
            titulo: video.title,
            url: video.url,
            miniatura: video.thumbnail,
            canal: video.author.name,
            publicado: video.timestamp || 'No disponible',
            vistas: video.views || 'No disponible',
            duracion: video.duration.timestamp || 'No disponible'
        }));
    } catch (error) {
        console.error('Error en yt-search:', error.message);
        return [];
    }
}

async function searchSpotify(query) {
    try {
        const res = await fetch(`https://delirius-apiofc.vercel.app/search/spotify?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.data.slice(0, 10).map(track => ({
            titulo: track.title,
            url: track.url,
            duracion: track.duration || 'No disponible'
        }));
    } catch (error) {
        console.error('Error en Spotify API:', error.message);
        return [];
    }
}

function convertTimeToSpanish(timeText) {
    return timeText
        .replace(/year/, 'año').replace(/years/, 'años')
        .replace(/month/, 'mes').replace(/months/, 'meses')
        .replace(/day/, 'día').replace(/days/, 'días')
        .replace(/hour/, 'hora').replace(/hours/, 'horas')
        .replace(/minute/, 'minuto').replace(/minutes/, 'minutos');
                                                              }
