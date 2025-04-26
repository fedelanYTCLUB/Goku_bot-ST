import fetch from 'node-fetch';

let apkSession = new Map();

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === 'apk' && text) {
    await m.react('📭');

    try {
      const response = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
      const data = await response.json();
      if (!data.status || !data.data) throw new Error("No se encontró la aplicación.");

      const app = data.data;
      apkSession.set(m.chat, { app });

      let description = `\`\`\`◜Apk - Download◞\`\`\`\n\n`;
      description += `° 🌴 *\`Nombre:\`* ${app.name}\n`;
      description += `° 🌵 *\`Dev:\`* ${app.developer}\n`;
      description += `° ⚖️ *\`Tamaño:\`* ${app.size}\n\n`;
      description += `> By Mai 🌸`;

      const buttons = [
        {
          buttonId: `${usedPrefix}apk_download`,
          buttonText: { displayText: "☀️ Descargar 🌻" },
          type: 1
        }
      ];

      await conn.sendMessage(
        m.chat,
        {
          image: { url: app.image },
          caption: description,
          buttons: buttons,
          // No ponemos viewOnce
        },
        { quoted: m }
      );

    } catch (error) {
      console.error("*❌ Error:*", error);
      await m.react('❌');
      await conn.sendMessage(m.chat, { text: `*❌ Ocurrió un error:*\n${error.message || "Error desconocido"}` }, { quoted: m });
    }
    return;
  }

  if (command === 'apk_download') {
    let session = apkSession.get(m.chat);
    if (!session) {
      return conn.sendMessage(
        m.chat,
        { text: `⚠️ No hay sesión activa. Usa ${usedPrefix}apk <nombre>` },
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

  if (command === 'apk' && !text) {
    let example = `${usedPrefix}apk WhatsApp`;
    return conn.sendMessage(
      m.chat,
      { text: `*📪 Escribe el nombre de una apk que quieras buscar.*\n> Ejemplo: ${example}` },
      { quoted: m }
    );
  }
};

handler.command = ['apk', 'apk_download'];
export default handler;
