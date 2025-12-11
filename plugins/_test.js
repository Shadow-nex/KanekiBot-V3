import fs from 'fs'
import fetch from 'node-fetch'
import Jimp from 'jimp'

let handler = async (m, { conn }) => {
  try {

    // FOTO DEL USUARIO
    const userPp = await conn.profilePictureUrl(m.sender, 'image')
      .catch(() => 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765413098347_567654.jpeg')

    const userImg = await Jimp.read(userPp)
    const userBuffer = await userImg.getBufferAsync(Jimp.MIME_JPEG)

    // ICONO PEQUEÑO PARA EL DOCUMENTO
    const iconUrl = 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765413098347_567654.jpeg'
    const iconImg = await Jimp.read(iconUrl)
    iconImg.resize(200, 200) // icono pequeño
    const iconBuffer = await iconImg.getBufferAsync(Jimp.MIME_JPEG)

    // DOCUMENTO (Jimp crea un JPG vacío con tu icono)
    const docBase = new Jimp(600, 600, '#000000') // fondo negro
    docBase.composite(iconImg.resize(150,150), 225, 225) // centrar icono
    const documentBuffer = await docBase.getBufferAsync(Jimp.MIME_JPEG)

    // CAPTION (NO MODIFIQUÉ TUS TEXTOS)
    const caption = `
╭━━━〔 𝙍𝙞𝙣 𝙄𝙩𝙤𝙨𝙝𝙞 〕━━⬣
│ Bienvenido causa 😼🔥
│ Todo junto como pediste 😈
╰━━━━━━━━━━━━━━⬣
`

    // ENVÍO TODO JUNTO
    await conn.sendMessage(
      m.chat,
      {
        image: { url: userPp }, // 1️⃣ Imagen del usuario
        document: documentBuffer, // 2️⃣ Documento con icono pequeño
        fileName: 'Rin-Itoshi-Document.jpg',
        mimetype: 'image/jpeg',
        jpegThumbnail: iconBuffer, // icono en miniatura
        caption, // 3️⃣ Texto decorado
        headerType: 1,
        viewOnce: true,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: '',
            body: '',
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

export default handler