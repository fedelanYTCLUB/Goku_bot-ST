import fs from 'fs';
import fetch from 'node-fetch';

// Mapa para almacenar la sesión de búsqueda de APK
let apkSession = new Map();

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Rama: Comando inicial .apk con término de búsqueda
  if (command === 'apk' && text) {
    await m.react('📭');

    try {
      const response = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
      const data = await response.json();
      if (!data.status || !data.data)
        throw new Error("No se encontró la aplicación.");

      const app = data.data;
      apkSession.set(m.chat, { app });

      let description = `\`\`\`◜Apk - Download◞\`\`\`\n\n`;
      description += `° 🌴 *\`Name:\`* ${app.name}\n`;
      description += `° 🌵 *\`Dev:\`* ${app.developer}\n`;
      description += `° ⚖️ *\`Tamaño:\`* ${app.size}\n\n`;
      description += `> By Mai 🌸`; // Arreglé aquí también, antes tenías un error con la variable "dev"

      const buttons = [
        {
          buttonId: `${usedPrefix}apk_download`,
          buttonText: { displayText: "☀️ Descargar 🌻" },
          type: 1
        }
      ];

      // Aquí se quitó viewOnce: true
      await conn.sendMessage(
        m.chat,
        {
          image: { url: app.image },
          caption: description,
          buttons: buttons,
          footer: '🌸 Elige una opción', // Opcional: puedes poner un footer bonito
        },
        { quoted: m }
      );
    } catch (error) {
      console.error("*❌ Error:*", error);
      await m.react('❌'); // Reacción de error
      await conn.sendMessage(
        m.chat,
        { text: `*❌ Ocurrió un error:*\n${error.message || "Error desconocido"}` },
        { quoted: m }
      );
    }
    return;
  }

  // Rama: Al pulsar el botón de descarga (.apk_download)
  if (command === 'apk_download') {
    let session = apkSession.get(m.chat);
    if (!session) {
      return conn.sendMessage(
        m.chat,
        { text: `*⚠️ No hay sesión activa. Realiza una búsqueda usando ${usedPrefix}apk <nombre de la aplicación>*.` },
        { quoted: m }
      );
    }
    let { app } = session;
    const downloadUrl = app.download;

    await m.react('⏳');

    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },
        mimetype: "application/vnd.android.package-archive",
        fileName: `${app.name}.apk`,
        caption: `> By Mai 🌸`
      },
      { quoted: m }
    );

    await m.react('✅');
    return;
  }

  // Caso: .apk sin término de búsqueda
  if (command === 'apk' && !text) {
    let example = `${usedPrefix}apk WhatsApp`;
    return conn.sendMessage(
      m.chat,
      { text: `*📪 Ingresa el nombre de una Apk que deseas descargar.*\n> *\`Ejemplo:\`* ${example}` },
      { quoted: m }
    );
  }
};

handler.command = ['apk', 'apk_download'];
export default handler;
