import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import { promisify } from 'util'
import { pipeline } from 'stream'
const streamPipeline = promisify(pipeline)

var handler = async (m, { args, conn }) => {
  if (!args[0]) return conn.reply(m.chat, '⚠️ Proporcione un enlace de YouTube. Ej: playmp4 https://youtu.be/xxxx', m)

  const url = args[0]
  const apiUrl = `https://nightapioficial.onrender.com/api/ytvideo?url=${encodeURIComponent(url)}&format=mp4&quality=720p`

  try {
    const res = await fetch(apiUrl)
    if (!res.ok) throw 'No se pudo obtener respuesta de la API'

    const json = await res.json()
    if (!json.video) return conn.reply(m.chat, '⚠️ No se encontró el video en la respuesta de la API.', m)

    const videoUrl = json.video
    const fileName = path.join(tmpdir(), `video_${Date.now()}.mp4`)
    const videoRes = await fetch(videoUrl)

    if (!videoRes.ok) throw 'No se pudo descargar el video'

    await streamPipeline(videoRes.body, fs.createWriteStream(fileName))

    await conn.sendMessage(m.chat, { video: { url: fileName }, caption: `✅ Video descargado de: ${url}` }, { quoted: m })

    fs.unlinkSync(fileName) // eliminar para ahorrar espacio

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, '❌ Error al procesar el video.', m)
  }
}

handler.command = ['playmp4']
handler.help = ['playmp4 <enlace>']
handler.tags = ['downloader']
handler.register = true

export default handler
