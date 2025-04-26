import fetch from 'node-fetch';

var handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, `${emoji} Por favor, ingrese el nombre de la apk para descargarla.`, m);

  try {
    await m.react(rwait);
    conn.reply(m.chat, `${emoji} Descargando su aplicación, espere un momento...`, m);

    // Llamada a la API de Delirius OFC con el término de búsqueda
    const response = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.status || !data.data) {
      throw new Error("No se encontró la aplicación.");
    }

    const app = data.data;

    // Rediseño del texto con la información de la aplicación
    let txt = `*乂  APTOIDE - DESCARGAS* 乂\n\n`;
    txt += `🌟 *Nombre:* ${app.name}\n`;
    txt += `🖥️ *Desarrollador:* ${app.developer}\n`;
    txt += `⚖️ *Tamaño:* ${app.size}\n`;
    txt += `📅 *Última actualización:* ${app.last_update}\n\n`;
    txt += `🔗 *Enlace de descarga:* [Haz clic aquí](${app.download})\n\n`;
    txt += `> *Descripción:* ${app.description || "Sin descripción disponible."}`;

    // Enviar mensaje con imagen de la app y descripción
    await conn.sendMessage(
      m.chat,
      {
        image: { url: app.image },
        caption: txt,
        viewOnce: true
      },
      { quoted: m }
    );

    await m.react(done);

    // Verificar si el archivo es demasiado grande
    if (app.size.includes('GB') || app.size.replace(' MB', '') > 999) {
      return await conn.reply(m.chat, `${emoji2} El archivo es demasiado pesado.`, m);
    }

    // Enviar el archivo APK
    await conn.sendMessage(
      m.chat,
      {
        document: { url: app.download },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${app.name}.apk`,
        caption: null
      },
      { quoted: m }
    );

  } catch (error) {
    console.error(error);
    return conn.reply(m.chat, `${msm} Ocurrió un fallo...`, m);
  }
};

handler.tags = ['descargas'];
handler.help = ['apkmod'];
handler.command = ['apk', 'modapk', 'aptoide'];
handler.group = true;
handler.register = true;
handler.coin = 0;

export default handler;
