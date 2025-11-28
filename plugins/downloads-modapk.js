import { search, download } from 'aptoide-scraper'
import fetch from 'node-fetch'
//import Jimp from 'jimp'

var handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, `🍃 Por favor, ingrese el nombre de la APK que desea descargar.`, m, rcanal)

  try {
    const res = await fetch('https://files.catbox.moe/rxpw9c.png');
    const thumb2 = Buffer.from(await res.arrayBuffer());

    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: '↻ 𝗔𝗣𝗞 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗗𝗔 ↻',
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };
    await m.react('🕒')
    //conn.reply(m.chat, `*☕ ᑲᥙsᥴᥲᥒძ᥆ 𝗍ᥙ ᥲ⍴ᥣіᥴᥲᥴіóᥒ ᥱs⍴ᥱrᥱ.... 🐢*`, m)
await conn.sendMessage(
  m.chat,
  {
    document: { url: "https://example.com/busqueda" },
    mimetype: "application/pdf",
    fileName: "Buscando aplicación...",
    caption: "*☕ Buscando tu aplicación... 🍃*", 
    jpegThumbnail: thumb2
  },
  { quoted: fkontak }
)

    let searchA = await search(text)
    if (!searchA.length) return m.reply(`⚠️ No se encontró ninguna APK con el nombre *${text}*.`)

    let data5 = await download(searchA[0].id)
    let txt = `*乂  APTOIDE - DESCARGAS 乂*\n\n`
    txt += `≡ 💐 *Nombre* : ${data5.name}\n`
    txt += `≡ 🌿 *Package* : ${data5.package}\n`
    txt += `≡ 🍃 *Update* : ${data5.lastup}\n`
    txt += `≡ 🚀 *Peso* : ${data5.size}`

    await conn.sendFile(m.chat, data5.icon, 'thumbnail.jpg', txt, m, null, rcanalw)

    if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
      return await conn.reply(m.chat, `El archivo es demasiado pesado para enviarlo.`, m, rch)
    }
/*
    let thumb = null
    try {
      const buffer = await (await fetch(data5.icon)).buffer()
      const img = await Jimp.read(buffer)
      img.resize(64, 64).quality(80)
      thumb = await img.getBufferAsync(Jimp.MIME_JPEG)
    } catch (err) {
      console.log('⚠️ Error al procesar miniatura:', err)
    }*/

    await conn.sendMessage(
      m.chat,
      {
        document: { url: data5.dllink },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${data5.name}.apk`,
        caption: dev,
        //jpegThumbnail: thumb,
        ...fake
      },
      { quoted: fkontak }
    )

    await m.react('✔️')
  } catch (error) {
    await m.react('✖️')
    return conn.reply(m.chat, `⚠️ Ocurrió un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`, m, rch)
  }
}

handler.tags = ['download']
handler.help = ['apkmod']
handler.command = ['apk', 'modapk', 'aptoide']
handler.group = true
handler.premium = false
handler.register = true

export default handler