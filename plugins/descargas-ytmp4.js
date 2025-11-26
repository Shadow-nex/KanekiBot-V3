/*import fetch from "node-fetch"

function formatSize(bytes) {
  if (bytes === 0 || isNaN(bytes)) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(
        m.chat,
        `🎋 *Ingresa el enlace del video de YouTube que deseas descargar.*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/HWjCStB6k4o`,
        m
      )
    }

    await m.react('🕒')
    await conn.reply(m.chat, '*_🍃 Descargando tu video onichan_*', m, rcanal)

    const apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(text)}&quality=480`
    const response = await fetch(apiUrl)
    if (!response.ok) throw `No se pudo obtener información del video.`

    const data = await response.json()
    const meta = data?.result?.metadata
    const down = data?.result?.download
    if (!down?.url) throw `No se pudo obtener el enlace de descarga.`

    const head = await fetch(down.url, { method: "HEAD" })
    const size = Number(head.headers.get("content-length") || 0)
    const sizeMB = size / 1024 / 1024

    let caption = `🍃 *Título:* ${meta.title}
🍟 *Canal:* ${meta.author?.name}
🕒 *Duración:* ${meta.duration?.timestamp || "Desconocida"}
👁 *Vistas:* ${meta.views?.toLocaleString() || "?"}
📅 *Publicado:* ${meta.ago}
🌾 *Calidad:* ${down.quality}
💾 *Tamaño:* ${formatSize(size)}
────────────────────
✨ *Descarga Completa...*`

    let sendType = sizeMB > 100 ? "document" : "video"

    await conn.sendMessage(m.chat, {
      [sendType]: { url: down.url },
      mimetype: "video/mp4",
      fileName: `${meta.title}.mp4`,
      caption,
      thumbnail: meta?.thumbnail ? await (await fetch(meta.thumbnail)).buffer() : null
    }, { quoted: m })

    await m.react('✔️')

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `*Ocurrió un error:*\n${e}`, m)
  }
}

handler.help = ["ytmp4 <url>"]
handler.tags = ["download"]
handler.command = ["ytmp4", "playmp4"]
handler.group = true
handler.register = true

export default handler*/

/*import .`

    const head = await fetch(down.url, { method: "HEAD" })
    const size = Number(head.headers.get("content-length") || 0)
    const sizeMB = size / 1024 / 1024

    let caption = `🍃 *Título:* ${meta.title}
🍟 *Canal:* ${meta.author?.name}
🕒 *Duración:* ${meta.duration?.timestamp || "Desconocida"}
👁 *Vistas:* ${meta.views?.toLocaleString() || "?"}
📅 *Publicado:* ${meta.ago}
🌾 *Calidad:* ${down.quality}
💾 *Tamaño:* ${formatSize(size)}
────────────────────
✨ *Descarga Completa...*`

    let sendType = sizeMB > 100 ? "document" : "video"

    await conn.sendMessage(m.chat, {
      [sendType]: { url: down.url },
      mimetype: "video/mp4",
      fileName: `${meta.title}.mp4`,
      caption,
      thumbnail: meta?.thumbnail ? await (await fetch(meta.thumbnail)).buffer() : null
    }, { quoted: m })

    await m.react('✔️')

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `*Ocurrió un error:*\n${e}`, m)
  }
}

handler.help = ["ytmp4 <url>"]
handler.tags = ["download"]
handler.command = ["ytmp4", "playmp4"]
handler.group = true
handler.register = true

export default handler*/

import fetch from "node-fetch"

function formatSize(bytes) {
  if (bytes === 0 || isNaN(bytes)) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(
        m.chat,
        `🎋 *Ingresa el enlace del video de YouTube que deseas descargar.*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/HWjCStB6k4o`,
        m
      )
    }

    await m.react('🕒')
    await conn.reply(m.chat, '*_🍃 Descargando tu video onichan_*', m, rcanal)

    const apiUrl = `https://api-shadowxyz.vercel.app/download/ytmp4V2?url=${encodeURIComponent(text)}`
    const response = await fetch(apiUrl)
    if (!response.ok) throw `No se pudo obtener información del video.`

    const data = await response.json()
    if (!data?.result?.download_url) throw `No se pudo obtener el enlace de descarga.`

    const meta = data.result

    const head = await fetch(meta.download_url, { method: "HEAD" })
    const size = Number(head.headers.get("content-length") || 0)
    const sizeMB = size / 1024 / 1024

    let caption = `🍃 *Título:* ${meta.title}
🕒 *Duración:* ${meta.duration}
🌾 *Calidad:* 480p
💾 *Tamaño:* ${formatSize(size)}
────────────────────
✨ *Descarga Completa...*`

    let sendType = sizeMB > 100 ? "document" : "video"

    await conn.sendMessage(m.chat, {
      [sendType]: { url: meta.download_url },
      mimetype: "video/mp4",
      fileName: `${meta.title}.mp4`,
      caption,
      thumbnail: meta.thumbnail ? await (await fetch(meta.thumbnail)).buffer() : null
    }, { quoted: m })

    await m.react('✔️')

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `*Ocurrió un error:*\n${e}`, m)
  }
}

handler.help = ["ytmp4 <url>"]
handler.tags = ["download"]
handler.command = ["ytmp4", "playmp4"]
handler.group = true
handler.register = true

export default handler