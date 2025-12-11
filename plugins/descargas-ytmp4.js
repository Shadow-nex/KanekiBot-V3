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
        `🎋 *Ingresa el enlace del video que deseas descargar.*\nEjemplo:\n${usedPrefix + command} https://youtu.be/HWjCStB6k4o`,
        m
      )
    }

    await m.react('🕒')
    await conn.reply(m.chat, '*Procesando descarga...*', m)

    let info = null
    let downloadUrl = null
    let meta = null
    let caption = null

    try {
      const api1 = `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(text)}&quality=360`
      const r1 = await fetch(api1)
      const j1 = await r1.json()

      if (j1?.result?.download?.url) {
        info = j1
        meta = j1.result.metadata
        downloadUrl = j1.result.download.url

        caption = `
*Y O U T U B E - D O W N L O A D*

> • *Título:* ${meta.title}
> • *Canal:* ${meta.author?.name}
> • *Duración:* ${meta.duration?.timestamp}
> • *Vistas:* ${meta.views?.toLocaleString()}
> • *Publicado:* ${meta.ago}
> • *Calidad:* ${j1.result.download.quality}
        `
      }

    } catch {
      info = null
    }

    if (!downloadUrl) {
      try {
        const api2 = `https://api-adonix.ultraplus.click/download/ytvideo?apikey=the.shadow&url=${encodeURIComponent(text)}`
        const r2 = await fetch(api2)
        const j2 = await r2.json()

        if (j2?.data?.url) {
          downloadUrl = j2.data.url

          caption = `🎬 *${j2.data.title || "Video encontrado"}*\n(Usando servidor 2)`
        }

      } catch {
        downloadUrl = null
      }
    }

    
    if (!downloadUrl) {
      return conn.reply(m.chat, `❌ *No se pudo descargar el video desde ninguno de los servidores.*`, m)
    }

    
    let size = 0
    try {
      const head = await fetch(downloadUrl, { method: "HEAD" })
      size = Number(head.headers.get("content-length") || 0)
    } catch {}

    const sizeMB = size / 1024 / 1024
    caption += `\n> • *Tamaño:* ${size ? formatSize(size) : "No disponible"}`


    const sendAs = sizeMB > 100 ? "document" : "video"

    await conn.sendMessage(
      m.chat,
      {
        [sendAs]: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: `${meta?.title || "video"}.mp4`,
        caption
      },
      { quoted: m }
    )

    await m.react('✔️')

  } catch (e) {
    console.log(e)
    conn.reply(m.chat, `⚠️ *Error inesperado:* ${e}`, m)
  }
}

handler.help = ["ytmp4 <url>"]
handler.tags = ["download"]
handler.command = ["ytmp4", "playmp4"]
handler.group = true
handler.register = true

export default handler