/*
 ┌────────────────────────────┐
 │ * Author    :  お sʜᴀᴅᴏᴡ's xʏᴢ 彡
 │ * Project   :  Bot xD
 │ * GitHub    : https://github.com/shadox-xyz
 │ * Channel   : https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f
 └────────────────────────────┘


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
    return conn.reply(m.chat, `*❀ Ingresa el nombre del video o un enlace de YouTube.*`, m)

  try {
    const r = await yts(text)
    if (!r.videos.length)
      return conn.reply(m.chat, "🚩 *No se encontro resultado para su búsqueda.*", m)

    const v = r.videos[0]

    const partes = v.timestamp.split(":").map(Number)
    let duracionSeg = 0

    if (partes.length === 3) {
      duracionSeg = partes[0] * 3600 + partes[1] * 60 + partes[2]
    } else {
      duracionSeg = partes[0] * 60 + partes[1]
    }

    const tamaño = calcularTamano(duracionSeg)
    const duration = convertirDuracion(v.timestamp)

    const info = `\`ִ ࣪ ˖ ࣪ YTDL  ݂ ⵂⵂ ݂  MP4 ! ᰔ ִ ׄ\`

> ര ׄ 🌱 ׅ Título › ${v.title}
> ര ׄ 🍃 ׅ Id › ${v.videoId}
> ര ׄ 🍚 ׅ Calidad › 480K
> ര ׄ 📺 ׅ Canal › ${v.author.name}
> ര ׄ 👁️ ׅ Vistas › ${v.views.toLocaleString()}
> ര ׄ ⏰ ׅ Duración › ${duration}
> ര ׄ 🗓️ ׅ Publicado › ${v.ago}
> ര ׄ 🌾 ׅ Tamaño › ${tamaño}
> ര ׄ 🔗 ׅ Link › ${v.url}

> ݂   (๑᷎᳞•˕ᩙ•๑᷎᳞)  ݁  ᴇʟ ᴠɪᴅᴇᴏ sᴇ ᴇsᴛᴀ ᴇɴᴠɪᴀɴᴅᴏ, ᴇsᴘᴇʀᴇ ᴜɴ ᴍᴏᴍᴇɴᴛᴏ  ݂ 🍙ᩧ݁᷼`.trim()

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
        caption: `\`${v.title}\``
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠ Error al buscar o descargar el video.", m)
  }
}

handler.command = ['ytmp4']
handler.tags = ['download']
handler.help = ['ytmp4 + [texto/link]']
handler.group = true
handler.register = true

export default handler*/

/*
 ┌────────────────────────────┐
 │ * Author    :  お sʜᴀᴅᴏᴡ's xʏᴢ 彡
 │ * Project   :  Bot xD
 │ * GitHub    : https://github.com/shadox-xyz
 │ * Channel   : https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f
 └────────────────────────────┘
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

let handler = async (m, { conn, text }) => {
  if (!text)
    return conn.reply(m.chat, `*❀ Ingresa el nombre del video o un enlace de YouTube.*`, m)

  try {
    const r = await yts(text)
    if (!r.videos.length)
      return conn.reply(m.chat, "🚩 *No se encontro resultado para su búsqueda.*", m)

    const v = r.videos[0]

    const partes = v.timestamp.split(":").map(Number)
    let duracionSeg = partes.length === 3
      ? partes[0] * 3600 + partes[1] * 60 + partes[2]
      : partes[0] * 60 + partes[1]

    const tamaño = calcularTamano(duracionSeg)
    const duration = convertirDuracion(v.timestamp)

    const info = `\`ִ ࣪ ˖ ࣪ YTDL  ݂ ⵂⵂ ݂  MP4 ! ᰔ ִ ׄ\`

> ര ׄ 🌱 ׅ Título › ${v.title}
> ര ׄ 🍃 ׅ Id › ${v.videoId}
> ര ׄ 🍚 ׅ Calidad › 480K
> ര ׄ 📺 ׅ Canal › ${v.author.name}
> ര ׄ 👁️ ׅ Vistas › ${v.views.toLocaleString()}
> ര ׄ ⏰ ׅ Duración › ${duration}
> ര ׄ 🗓️ ׅ Publicado › ${v.ago}
> ര ׄ 🌾 ׅ Tamaño › ${tamaño}
> ര ׄ 🔗 ׅ Link › ${v.url}

> ݂   (๑᷎᳞•˕ᩙ•๑᷎᳞)  ݁  ᴇʟ ᴠɪᴅᴇᴏ sᴇ ᴇsᴛᴀ ᴇɴᴠɪᴀɴᴅᴏ, ᴇsᴘᴇʀᴇ ᴜɴ ᴍᴏᴍᴇɴᴛᴏ  ݂ 🍙ᩧ݁᷼`.trim()

    await conn.sendMessage(
      m.chat,
      { image: { url: v.thumbnail }, caption: info },
      { quoted: m }
    )

    /* ============================
       NUEVA API YUPRA
    ============================ */
    const api = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(v.url)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json?.success || !json?.data?.download_url)
      return conn.reply(m.chat, "> *No pude obtener el video.*", m)

    const downloadUrl = json.data.download_url
    const title = json.data.title || v.title

    await conn.sendMessage(
      m.chat,
      {
        video: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: `${title}.mp4`,
        caption: `\`${title}\``
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠ Error al buscar o descargar el video.", m)
  }
}

handler.command = ['ytmp4']
handler.tags = ['download']
handler.help = ['ytmp4 + [texto/link]']
handler.group = true
handler.register = true

export default handler