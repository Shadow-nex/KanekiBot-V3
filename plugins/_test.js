/*import fs from 'fs'
import fetch from 'node-fetch'
import Jimp from 'jimp'

let handler = async (m, { conn }) => {
  try {

    const userPp = await conn.profilePictureUrl(m.sender, 'image')
      .catch(() => 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765413098347_567654.jpeg')

    const userImg = await Jimp.read(userPp)
    const userBuffer = await userImg.getBufferAsync(Jimp.MIME_JPEG)

    const iconUrl = 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765413098347_567654.jpeg'
    const iconImg = await Jimp.read(iconUrl)
    iconImg.resize(200, 200)
    const iconBuffer = await iconImg.getBufferAsync(Jimp.MIME_JPEG)

    
    const docBase = new Jimp(600, 600, '#000000')
    docBase.composite(iconImg.resize(150,150), 225, 225)
    const documentBuffer = await docBase.getBufferAsync(Jimp.MIME_JPEG)

    const caption = `
test xd
`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: userPp },
        document: documentBuffer,
        fileName: 'test.jpg',
        mimetype: 'image/jpeg',
        jpegThumbnail: iconBuffer,
        caption,
        headerType: 1,
        viewOnce: true,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: botname,
            body: dev,
            thumbnail: iconBuffer,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
  }
}

handler.help = ['test']
handler.tags = ['main']
handler.command = ['test']

export default handler*/

import fs from 'fs';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (command === 'apk2') {
    if (!text)
      return conn.sendMessage(
        m.chat,
        { text: `[🌿] Ingresa un término de búsqueda.\n\n🌵 Ejemplo:\n${usedPrefix}apk2 WhatsApp` },
        { quoted: m }
      );

    try {
      await m.react('🔍');

      const response = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
      const data = await response.json();

      if (!data.status || !data.data)
        throw new Error("No se encontró la aplicación.");

      const app = data.data;

      let description = `• *Nombre:* ${app.name}
• *Desarrollador:* ${app.developer}
• *Paquete:* ${app.id}
• *Tamaño:* ${app.size}
• *Rating:* ${app.stats?.rating?.average || "N/A"} (${app.stats?.rating?.total || 0} votos)
• *Publicado:* ${app.publish}
• *Descargas:* ${app.stats?.downloads?.toLocaleString() || "N/A"}
• *Tienda:* ${app.store?.name || "Desconocida"}`;

     
      await conn.sendMessage(
        m.chat,
        {
          image: { url: app.image },
          caption: description.trim(),
          viewOnce: false
        },
        { quoted: m }
      );

      await m.react('⬇️');

     
      await conn.sendMessage(
        m.chat,
        {
          document: { url: app.download },
          fileName: `${app.name}.apk`,
          mimetype: 'application/vnd.android.package-archive',
          jpegThumbnail: app.image ? await (await fetch(app.image)).buffer() : null,
          caption: `📦 *${app.name}*\nAquí tienes tu APK.`,
          contextInfo: {
            externalAdReply: {
              title: botname,
              body: dev,
              thumbnailUrl: app.image,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: m }
      );

      await m.react('✅');

    } catch (error) {
      console.error("Error:", error);
      await m.react('❌');
      await conn.sendMessage(
        m.chat,
        { text: `❌ Ocurrió un error: ${error.message}` },
        { quoted: m }
      );
    }

    return;
  }
};

handler.tags = ['descargas'];
handler.help = ['apk2'];
handler.command = ['apk2'];

export default handler;

