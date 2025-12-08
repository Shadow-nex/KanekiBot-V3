import fetch from 'node-fetch'
import { lookup } from 'mime-types'

let handler = async (m, { conn, text }) => {
  const user = global.db.data.users[m.sender] || {}

  if (!text) return m.reply(`*☘ Ingresa un enlace válido de Mediafire.*`)

  if (user.coin < 20) {
    return conn.reply(
      m.chat,
      `No tienes suficientes ${currency}. Necesitas 20 para usar este comando.`,
      m
    )
  }

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

  try {
    let info = await fetch(
      `https://api-nv.ultraplus.click/api/download/mediafire?url=${encodeURIComponent(text)}&key=hYSK8YrJpKRc9jSE`
    )
    let json = await info.json()

    if (!json.status || !json.result?.fileName) throw "Error obteniendo información"

    let d = json.result

 
    let sizeText = d.fileSize.toLowerCase()
    let sizeMB = 0

    if (sizeText.includes("gb")) {
      sizeMB = parseFloat(sizeText) * 1024
    } else if (sizeText.includes("mb")) {
      sizeMB = parseFloat(sizeText)
    }

    // limite 500 MB
    if (!user.premium && sizeMB > 500) {
      return m.reply(
        `*☘ ᴇsᴛᴇ ᴀʀᴄʜɪᴠᴏ sᴜᴘᴇʀᴀ ᴇʟ ʟɪᴍɪᴛᴇ ᴅᴇ ᴅᴇsᴄᴀʀɢᴀ.*
✿ \`ʟɪᴍɪᴛᴇ:\` \`\`\`500 MB\`\`\`
✿ \`ᴘᴇsᴏ:\` \`\`\`${sizeMB.toFixed(2)}\`\`\`

> *★ ʜᴀsᴛᴇ ᴜɴ ᴜsᴜᴀʀɪᴏ ᴘʀᴇᴍɪᴜᴍ ᴘᴀʀᴀ ᴅᴇsᴄᴀʀɢᴀs ᴍᴀs ɢʀᴀɴᴅᴇs.*`
      )
    }

    let resumen =
      `MEDIAFIRE - INFORMACIÓN DEL ARCHIVO\n\n` +
      `Nombre: ${d.fileName}\n` +
      `Tamaño: ${d.fileSize}\n` +
      `Tipo: ${d.fileType}\n` +
      `Subido: ${d.uploaded}\n\n` +
      `Descargando archivo...`

    await conn.sendMessage(m.chat, { text: resumen, ...rcanal }, { quoted: m })

    let dl = await fetch(
      `https://akirax-api.vercel.app/download/mediafire?url=${encodeURIComponent(text)}`
    )
    let json2 = await dl.json()

    if (!json2.status || !json2.result?.downloadUrl) throw "No se pudo descargar"

    let { fileName, downloadUrl } = json2.result
    let mimetype = lookup(fileName.split('.').pop()) || 'application/octet-stream'

    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },
        fileName,
        mimetype
      },
      { quoted: m }
    )

    user.coin -= 20
    conn.reply(m.chat, `Se descontaron 20 ${currency}`, m)

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    console.error(err)
    m.reply(`Error al procesar la descarga.`)
  }
}

handler.help = ['mediafire2']
handler.tags = ['download']
handler.command = ['mf2', 'mediafire2']
handler.group = true

export default handler