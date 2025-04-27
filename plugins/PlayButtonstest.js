import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
    if (!args[0]) return conn.reply(m.chat, '*`Por favor ingresa un término de búsqueda`*', m);

    await m.react('🕓');
    try {
        let searchResults = await searchVideos(args.join(" "));
        let spotifyResults = await searchSpotify(args.join(" "));
        
        if (!searchResults.length && !spotifyResults.length) throw new Error('No se encontraron resultados.');

        let video = searchResults[0];
        let thumbnail = await (await fetch(video.miniatura)).buffer();

        let messageText = `> *𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝖯𝗅𝖺𝗒 🧇.*\n\n`;
        messageText += `*🎵 Título:* ${video.titulo}\n`;
        messageText += `*⏳ Duración:* ${video.duracion || 'No disponible'}\n`;
        messageText += `*👤 Autor:* ${video.canal || 'Desconocido'}\n`;
        messageText += `*📅 Publicado:* ${convertTimeToSpanish(video.publicado)}\n`;
        messageText += `*🔗 Link:* ${video.url}\n`;

        const media = await prepareWAMessageMedia({ image: thumbnail }, { upload: conn.waUploadToServer });

        const template = generateWAMessageFromContent(m.chat, {
            templateMessage: {
                hydratedTemplate: {
                    imageMessage: media.imageMessage,
                    hydratedContentText: messageText,
                    hydratedFooterText: '✨ ᴘʀᴇꜱɪᴏɴᴀ ᴜɴ ʙᴏᴛóɴ ᴘᴀʀᴀ ᴇʟ ᴛɪᴘᴏ ᴅᴇ ᴅᴇꜱᴄᴀʀɢᴀ ✨',
                    hydratedButtons: [
                        {
                            quickReplyButton: {
                                displayText: '🎧 Descargar Audio',
                                id: `${usedPrefix}ytmp3 ${video.url}`
                            }
                        },
                        {
                            quickReplyButton: {
                                displayText: '🎥 Descargar Video',
                                id: `${usedPrefix}ytmp4 ${video.url}`
                            }
                        },
                        {
                            quickReplyButton: {
                                displayText: '🔎 Más resultados YouTube',
                                id: `${usedPrefix}ytsearch ${args.join(" ")}`
                            }
                        },
                        {
                            quickReplyButton: {
                                displayText: '🔎 Más resultados Spotify',
                                id: `${usedPrefix}spotifysearch ${args.join(" ")}`
                            }
                        }
                    ]
                }
            }
        }, { quoted: m });

        await conn.relayMessage(m.chat, template.message, { messageId: template.key.id });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await m.react('✖️');
        conn.reply(m.chat, '*`Error al buscar el video.`*', m);
    }
};

handler.help = ['play *<texto>*'];
handler.tags = ['dl'];
handler.command = ['playtest'];
export default handler;

// Funciones auxiliares
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
