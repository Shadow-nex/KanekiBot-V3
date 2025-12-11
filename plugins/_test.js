import yts from "yt-search"

// Convertir timestamp a texto bonito
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

// Tamaño estimado
function calcularTamano(duracionSeg) {
  const kbps = 256
  const mb = (duracionSeg * kbps) / 8 / 1024
  return mb.toFixed(2) + " MB"
}

let handler = async (m, { conn, text, command }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `📌 *Ingresa el nombre del video/audio*\nEjemplo:\n${command} Quevedo Bzrp`,
      m
    )

  await m.react("🔎")

  try {
    const r = await yts(text)
    if (!r.videos.length)
      return conn.reply(m.chat, "❌ No encontré nada.", m)

    const v = r.videos[0]

    // duración en segundos
    const partes = v.timestamp.split(":").map(Number)
    let duracionSeg = 0

    if (partes.length === 3) {
      duracionSeg = partes[0] * 3600 + partes[1] * 60 + partes[2]
    } else {
      duracionSeg = partes[0] * 60 + partes[1]
    }

    const tamaño = calcularTamano(duracionSeg)
    const duracionBonita = convertirDuracion(v.timestamp)

    const info = `
✨ *RESULTADO ENCONTRADO*

🎬 *Título:* ${v.title}
👤 *Autor:* ${v.author.name}
👁 *Vistas:* ${v.views.toLocaleString()}
📅 *Publicado:* ${v.ago}

⏳ *Duración:* ${duracionBonita}
📦 *Tamaño estimado:* ${tamaño}

🔗 *Enlace:* ${v.url}
🆔 *ID:* ${v.videoId}
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: v.thumbnail },
        caption: info
      },
      { quoted: m }
    )

    // ⬇⬇ *AQUÍ AGREGO LA DESCARGA DEL AUDIO* ⬇⬇
    try {
      const apiUrl = `https://api-adonix.ultraplus.click/download/ytvideo?apikey=the.shadow&url=${encodeURIComponent(v.url)}`

      await m.reply("🎶 *Descargando audio...*")

      const audioRes = await fetch(apiUrl)
      const audioJson = await audioRes.json()

      if (!audioJson || !audioJson.downloadUrl)
        return m.reply("⚠ No pude obtener el audio.")

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: audioJson.downloadUrl },
          mimetype: "audio/mpeg",
          fileName: v.title + ".mp3"
        },
        { quoted: m }
      )

      await m.react("✅")

    } catch (err) {
      console.error(err)
      m.reply("⚠ Hubo un error al descargar el audio.")
    }

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠ Error al buscar el video.", m)
  }
}

handler.help = ["yt <texto>"]
handler.tags = ["buscador"]
handler.command = ['yt']

export default handler