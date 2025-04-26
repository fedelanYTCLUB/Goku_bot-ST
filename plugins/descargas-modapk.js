import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path'; // Para manejar mejor rutas

let apkSession = new Map();

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === 'apk' && text) {
    await m.react('📭');

    try {
      // Buscar la app en la API
      const response = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
      if (!response.ok) throw new Error('Error al buscar la APK.');

      const data = await response.json();
      if (!data.status || !data.data) throw new Error('No se encontró la aplicación.');

      const app = data.data;
      apkSession.set(m.chat, { app });

      // Descripción bonita
      const description = `\`\`\`◜ Apk - Download ◞\`\`\`\n\n`
        + `° 🌴 *Nombre:* ${app.name}\n`
        + `° 🌵 *Desarrollador:* ${app.developer}\n`
        + `° ⚖️ *Tamaño:* ${app.size}\n\n`
        + `> By Mai 🌸`;

      // Enviar la descripción
      await conn.sendMessage(m.chat, { text: description }, { quoted: m });

      await m.react('⏳');

      // Descargar la APK
      const apkBuffer = await fetch(app.download).then(res => res.buffer());

      // Crear ruta correcta para guardar en carpeta /tmp
      const tmpFilePath = path.join('./tmp', `${app.name}.apk`);
      fs.writeFileSync(tmpFilePath, apkBuffer);

      // Enviar el archivo APK
      await conn.sendMessage(
        m.chat,
        {
          document: fs.readFileSync(tmpFilePath),
          fileName: `${app.name}.apk`,
          mimetype: 'application/vnd.android.package-archive',
          caption: `> By Mai 🌸`
        },
        { quoted: m }
      );

      // Eliminar archivo temporal
      fs.unlinkSync(tmpFilePath);

      await m.react('✅');

    } catch (error) {
      console.error('❌ Error:', error);
      await m.react('❌');
      await conn.sendMessage(m.chat, { text: `*❌ Ocurrió un error:*\n${error.message || 'Error desconocido'}` }, { quoted: m });
    }
    return;
  }

  // Si no pone nombre
  if (command === 'apk' && !text) {
    const example = `${usedPrefix}apk WhatsApp`;
    await conn.sendMessage(
      m.chat,
      { text: `*📪 Escribe el nombre de una APK que quieras buscar.*\n> Ejemplo: ${example}` },
      { quoted: m }
    );
    return;
  }
};

handler.command = ['apk'];
export default handler;
