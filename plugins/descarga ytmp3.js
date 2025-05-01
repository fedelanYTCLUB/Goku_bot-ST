import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, escribe el nombre de la canción que quieres escuchar.`, m)
    }

    const search = await yts(text)
    if (!search.all || search.all.length === 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    const videoInfo = search.all[0]
    if (!videoInfo) {
      return m.reply('✧ No se pudo obtener información del video.')
    }

    const { title, thumbnail, timestamp, url } = videoInfo
    if (!title || !thumbnail || !timestamp || !url) {
      return m.reply('✧ Información incompleta del video.')
    }

    const thumb = (await conn.getFile(thumbnail))?.data
    m.react('🌸')

    if (command === 'play' || command === 'yta' || command === 'ytmp3') {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
        const result = api.result?.download?.url
        if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.')

        await conn.sendMessage(m.chat, {
          audio: { url: result },
          fileName: `${api.result.title}.mp3`,
          mimetype: 'audio/mpeg',
          contextInfo: {
            externalAdReply: {
              title: title,
              body: `⏳ Duración: ${timestamp}`,
              mediaType: 1,
              previewType: "PHOTO",
              thumbnail: thumb,
              showAdAttribution: true,
              renderLargerThumbnail: true,
              sourceUrl: url
            }
          }
        }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Puede que el archivo sea muy pesado o hubo un error. Intenta más tarde.', m)
      }
    } else if (command === 'play2' || command === 'ytv' || command === 'ytmp4') {
      try {
        const json = await (await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`)).json()
        const resultado = json.result?.download?.url
        if (!resultado) throw new Error('⚠ El enlace de video no se generó correctamente.')

        await conn.sendMessage(m.chat, {
          video: { url: resultado },
          fileName: `${json.result.title}.mp4`,
          mimetype: 'video/mp4',
          caption: `╭•⋯⋯⋯⋯⋯⋯⋯⋯•╮
  ✿ 𝙑𝙞𝙙𝙚𝙤 𝙡𝙞𝙨𝙩𝙤 ✿
╰•⋯⋯⋯⋯⋯⋯⋯⋯•╯

🍡 *${title}*
⏳ *Duración:* ${timestamp}`,
          contextInfo: {
            externalAdReply: {
              title: title,
              body: `⏳ Duración: ${timestamp}`,
              mediaType: 1,
              previewType: "PHOTO",
              thumbnail: thumb,
              showAdAttribution: true,
              renderLargerThumbnail: true,
              sourceUrl: url
            }
          }
        }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Puede que el archivo sea muy pesado o hubo un error. Intenta más tarde.', m)
      }
    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error inesperado:\n${error}`)
  }
}

handler.command = handler.help = ['yta', 'ytmp3']
handler.tags = ['descargas']
handler.group = true

export default handler
