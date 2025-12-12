/*import yts from "yt-search"
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
*/

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

    const apis = [
      {
        api: "NekoLabs",
        endpoint: `https://api.nekolabs.web.id/downloader/youtube/v1?url=${encodeURIComponent(v.url)}&format=480`,
        extractor: res => res.result?.downloadUrl,
        title: res => res.result?.title
      },
      {
        api: "Maycol",
        endpoint: `https://api.soymaycol.icu/ytdl?url=${encodeURIComponent(v.url)}&type=mp4&quality=480&apikey=may-1a3ecc37`,
        extractor: res => res.result?.url,
        title: res => res.result?.title
      },
      {
        api: "Yupra",
        endpoint: `${global.APIs.yupra.url}/api/downloader/ytmp3?url=${encodeURIComponent(v.url)}`,
        extractor: res => res.result?.link,
        title: res => res.result?.title
      },
      {
        api: "Vreden",
        endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/video?url=${encodeURIComponent(v.url)}&quality=480`,
        extractor: res => res.result?.download?.url,
        title: res => res.result?.metadata?.title
      }
    ]

    let finalUrl = null
    let metaTitle = v.title
    let apiUsada = "Desconocida"

    for (const api of apis) {
      try {
        const r = await fetch(api.endpoint)
        const json = await r.json()

        const link = api.extractor(json)
        if (link) {
          finalUrl = link
          metaTitle = api.title(json) || v.title
          apiUsada = api.api
          break
        }

      } catch (e) {
        console.log(`❌ Error en API ${api.api}`)
      }
    }

    if (!finalUrl)
      return conn.reply(m.chat, "> *No pude obtener el video con ninguna API.*", m)

    const captionFinal = `🎬 *${metaTitle}*\n🌐 *API:* ${apiUsada}`

    await conn.sendMessage(
      m.chat,
      {
        video: { url: finalUrl },
        mimetype: "video/mp4",
        fileName: `${metaTitle}.mp4`,
        caption: captionFinal
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