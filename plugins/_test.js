import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `🍃 *Ingresa un enlace de YouTube*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/TdrL3QxjyVw`,
      m
    )

  try {
    await m.react('⏳')

    const api = `https://api.delirius.store/download/ytmp4?url=${encodeURIComponent(text)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json.status) throw `❌ No se pudo obtener información del video.`

    const data = json.data
    const dl = data.download

    // Formatear duración
    const formatDur = secs => {
      const min = Math.floor(secs / 60)
      const sec = secs % 60
      return `${min} minutos, ${sec} segundos`
    }

    // Mensaje resumen
    const info = `
🎬 *${data.title}*
👤 Autor: ${data.author}
📌 Categoría: ${data.category}
⏱ Duración: ${formatDur(data.duration)}
👁‍🗨 Vistas: ${data.views}
👍 Likes: ${data.likes}
💬 Comentarios: ${data.comments}

📥 *Descarga:* ${dl.quality}
📦 Tamaño: ${dl.size}
    `.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: data.image_max_resolution || data.image },
        caption: info,
        buttons: [
          {
            buttonId: `.ytmp4dl ${dl.url}`,
            buttonText: { text: "⬇ Descargar MP4" },
            type: 1
          }
        ],
        footer: "Delirius API • Shadow Xyz Bot"
      },
      { quoted: m }
    )

    await m.react('✅')

  } catch (err) {
    console.error(err)
    m.react('❌')
    conn.reply(m.chat, `⚠️ Ocurrió un error.\n${err}`, m)
  }
}

handler.help = ["yt <url>"]
handler.tags = ["downloader"]
handler.command = ["yt", "ytv"]

export default handler