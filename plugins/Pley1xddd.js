import fetch from "node-fetch";
import yts from "yt-search";

const encodedApi = "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=";
const getApiUrl = () => Buffer.from(encodedApi, "base64").toString("utf-8");

const fetchWithRetries = async (url, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.status === 200 && data.result?.download?.url) {
        return data.result;
      }
    } catch (error) {
      console.error(`Intento ${attempt + 1} fallido:`, error.message);
    }
  }
  throw new Error("No se pudo obtener la música después de varios intentos.");
};

let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) {
    return conn.sendMessage(m.chat, {
      text: "*❀ Ingresa el nombre de la música a descargar.*\n\n*Ejemplo:* `.play1 Ojitos lindos`",
    });
  }

  try {
    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    const progreso = [
      "🎶 Enviando audio...\n[░░░░░░░░░░] 0%",
      "🎶 Enviando audio...\n[█░░░░░░░░░] 10%",
      "🎶 Enviando audio...\n[██░░░░░░░░] 20%",
      "🎶 Enviando audio...\n[███░░░░░░░] 30%",
      "🎶 Enviando audio...\n[████░░░░░░] 40%",
      "🎶 Enviando audio...\n[█████░░░░░] 50%",
      "🎶 Enviando audio...\n[██████░░░░] 60%",
      "🎶 Enviando audio...\n[███████░░░] 70%",
      "🎶 Enviando audio...\n[████████░░] 80%",
      "🎶 Enviando audio...\n[█████████░] 90%",
      "✅ ¡Audio listo!\n[██████████] 100%"
    ];

    // Enviar mensaje inicial
    const mensajeInicial = await conn.sendMessage(m.chat, { text: progreso[0] }, { quoted: m });

    // Editar con progreso
    for (let i = 1; i < progreso.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 250));
      await conn.sendMessage(m.chat, {
        text: progreso[i],
        edit: mensajeInicial,
      });
    }

    // Obtener enlace del audio
    const apiUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    const apiData = await fetchWithRetries(apiUrl);

    // Enviar info y audio
    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: `*「✦」Descargando ${video.title}*\n\n> ✦ Canal » *${video.author.name}*\n> ✰ *Vistas:* » ${video.views}\n> ⴵ *Duración:* » ${video.timestamp}\n> Provived By Mai 🌻`,
    });

    await conn.sendMessage(m.chat, {
      audio: { url: apiData.download.url },
      mimetype: "audio/mpeg",
      ptt: true,
      fileName: `${video.title}.mp3`,
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Error al procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
    });
  }
};

handler.command = ['play1'];
handler.help = ['play1 <texto>'];
handler.tags = ['downloader'];

export default handler;
