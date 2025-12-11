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

