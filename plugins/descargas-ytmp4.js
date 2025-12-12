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
> *• ᴄᴀʟɪᴅᴀᴅ »* 480p
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

    const api = `${global.APIs.vreden.url}/api/v1/download/youtube/video?url=${encodeURIComponent(v.url)}&quality=480`

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


mano cambia la api de arriba x esta 
api
https://api.nekolabs.web.id/downloader/youtube/v1?url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3DnQim5_82_No&format=480

descripción 

{
  "success": true,
  "result": {
    "title": "Ganja Mafia - Hola (Prod. PSR)",
    "type": "video",
    "format": "480",
    "quality": "480",
    "duration": "03:58",
    "cover": "https://i.ytimg.com/vi/nQim5_82_No/maxresdefault.jpg",
    "downloadUrl": "https://cdn401.savetube.vip/media/nQim5_82_No/ganja-mafia-hola-prod-psr-480-ytshorts.savetube.me.mp4"
  },
  "timestamp": "2025-12-12T20:00:30.833Z",
  "responseTime": "7875ms"
}


api2

pe (String)
mp4
quality (Number)
480
Ejecutar Petición
200
https://api.soymaycol.icu/ytdl?url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3Dco-TFLbaZAE&type=mp4&quality=480&apikey=may-1a3ecc37
Tiempo: 35706ms
{
  "status": true,
  "type": "mp4",
  "result": {
    "title": "“Gabriela” Performance Video | KATSEYE",
    "quality": "480p",
    "url": "https://s4.ytcontent.net/v3/d/video/co-TFLbaZAE/1755344114966224/YTDown.com_YouTube_Gabriela-Performance-Video-KATSEYE_Media_co-TFLbaZAE_004_360p.mp4?token=1765570216329ec8f9603b47beece20ebdb7592c12"
  },
  "user": {
    "username": "Shadow.xyz",
    "requests_made_today": 7,
    "limit": 1000
  }
}