import yts from "yt-search"
import fetch from "node-fetch"

function convertirDuracion(timestamp) {
  const partes = timestamp.split(":").map(Number)

  let horas = 0, minutos = 0, segundos = 0

  if (partes.length === 3) {
    horas = partes[0]
    minutos = partes[1]
    segundos = partes[2]
  } else if (partes.length === 2) {
    minutos = partes[0]
    segundos = partes[1]
  }

  const arr = []
  if (horas) arr.push(`${horas} hora${horas > 1 ? 's' : ''}`)
  if (minutos) arr.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`)
  if (segundos) arr.push(`${segundos} segundo${segundos > 1 ? 's' : ''}`)

  return arr.join(", ")
}

function calcularTamano(duracionSeg) {
  const kbps = 380
  const mb = (duracionSeg * kbps) / 8 / 1024
  return mb.toFixed(2) + " MB"
}

let handler = async (m, { conn, text, command }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `*❀ Ingresa el nombre del video o un enlace de YouTube.*`,
      m
    )

  await m.react("🔎")

  try {
    const r = await yts(text)
    if (!r.videos.length)
      return conn.reply(m.chat, "*No encontré nada.*", m)

    const v = r.videos[0]

    const partes = v.timestamp.split(":").map(Number)
    let duracionSeg = 0

    if (partes.length === 3) {
      duracionSeg = partes[0] * 3600 + partes[1] * 60 + partes[2]
    } else {
      duracionSeg = partes[0] * 60 + partes[1]
    }

    const tamaño = calcularTamano(duracionSeg)
    const duracionBonita = convertirDuracion(v.timestamp)

    const info = `  *▥ Y O U T U B E - D O W N L O A D*

> *• ᴛɪᴛᴜʟᴏ »* ${v.title}
> *• ɪᴅ »* ${v.videoId}
> *• ᴄᴀʟɪᴅᴀᴅ »* 128kbps
> *• ᴄᴀɴᴀʟ »* ${v.author.name}
> *• ᴠɪsᴛᴀs »* ${v.views.toLocaleString()}
> *• ᴅᴜʀᴀᴄɪᴏɴ »* ${duracionBonita}
> *• ᴘᴜʙʟɪᴄᴀᴅᴏ »* ${v.ago}
> *• ᴛᴀᴍᴀɴ̃ᴏ »* ${tamaño}
> *• ʟɪɴᴋ »* ${v.url}`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: v.thumbnail },
        caption: info
      },
      { quoted: m }
    )

    const api = `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(v.url)}&quality=360`

    const res = await fetch(api)
    const json = await res.json()

    if (!json?.result?.download?.url)
      return conn.reply(m.chat, "> *No pude obtener el video.*", m)

    const downloadUrl = json.result.download.url
    const meta = json.result.metadata

    const kbps = 1000
    const sizeMB = ((meta.seconds * kbps) / 8 / 1024).toFixed(2)

    const sendAs = sizeMB > 100 ? "document" : "video"

    await conn.sendMessage(
      m.chat,
      {
        [sendAs]: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: `${meta?.title || "video"}.mp4`,
        caption: null
      },
      { quoted: m }
    )

    await m.react("✅")

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠ Error al buscar o descargar el video.", m)
  }
}

handler.command = ['ytmp4']
handler.tags = ['download']
handler.help = ['ytmp4 <texto o link>']
handler.group = true
handler.register = true

export default handler