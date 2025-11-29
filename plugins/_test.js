import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `🌿 Ingresa el nombre de la app.\n\nEjemplo:\n> *${usedPrefix + command}* whatsapp`,
      m
    )
  }

  await m.react('🕓')

  try {
  
    const searchUrl = `https://apkpure.com/search?q=${encodeURIComponent(text)}`
    const { data } = await axios.get(searchUrl)
    const match = data.match(/href="\/([a-zA-Z0-9._-]+)\/download/)

    if (!match) {
      await m.react('❌')
      return m.reply('❌ No se encontró la app en APKPure.')
    }

    const packageName = match[1]

   
    const apiUrl = `https://api.apkpure.com/download?package=${packageName}`
    const { data: api } = await axios.get(apiUrl)

    if (!api?.data?.download_url) {
      await m.react('✖️')
      return m.reply('❌ No se pudo generar el enlace de descarga.')
    }

    const downloadUrl = api.data.download_url
    const fileName = `${api.data.package}.apk`

   
    const apkFile = await axios.get(downloadUrl, { responseType: 'arraybuffer' })

   
    await conn.sendMessage(
      m.chat,
      {
        document: Buffer.from(apkFile.data),
        mimetype: 'application/vnd.android.package-archive',
        fileName
      },
      { quoted: m }
    )

    await m.react('✔️')
  } catch (err) {
    console.log(err)
    await m.react('✖️')
    m.reply('⚠️ Error descargando el APK. Puede que esté bloqueado o no disponible.')
  }
}

handler.help = ['apkpure *<app>*']
handler.tags = ['downloader']
handler.command = ['apkpure']
handler.limit = false

export default handler