import fetch from 'node-fetch'
import { lookup } from 'mime-types'

let handler = async (m, { conn, text }) => {
  const user = global.db.data.users[m.sender] || {}

  if (user.coin < 20) {
    return conn.reply(
      m.chat,
      `🔥 No tienes suficientes *${currency}*.\nNecesitas *20* para usar este comando.`,
      m
    )
  }

  if (!text) return m.reply(`🍃 *Ingresa un enlace válido de Mediafire.*`)

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
  m.reply(`🎍 *Obteniendo información...*`)

  try {

    let info = await fetch(
      `https://api-nv.ultraplus.click/api/download/mediafire?url=${encodeURIComponent(text)}&key=hYSK8YrJpKRc9jSE`
    )
    let json = await info.json()

    if (!json.status || !json.result?.fileName) throw "Error obteniendo información"

    let d = json.result

    let msg = `🌾 *MEDIAFIRE - INFORMACIÓN DEL ARCHIVO*\n\n` +
    `❄️ *Nombre:* ${d.fileName}\n` +
    `🍃 *Tamaño:* ${d.fileSize}\n` +
    `🥗 *Tipo:* ${d.fileType}\n` +
    `⚡ *Subido:* ${d.uploaded}\n\n` +
    `🐥 *Descargando archivo...*`

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m })

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
        mimetype,
        caption: null
      },
      { quoted: m }
    )

    user.coin -= 20
    conn.reply(m.chat, `🌱 Se descontaron *20 ${currency}*`, m)

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    console.error(err)
    m.reply(`*Error al procesar la descarga.*`)
  }
}

handler.help = ['mediafire2']
handler.tags = ['download']
handler.command = ['mf2', 'mediafire2']
handler.group = true

export default handler