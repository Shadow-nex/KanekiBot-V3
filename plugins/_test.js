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
  const kbps = 128
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

    const api = `https://api-adonix.ultraplus.click/download/ytaudio?apikey=the.shadow&url=${encodeURIComponent(v.url)}`

    const res = await fetch(api)
    const json = await res.json()

    if (!json?.data?.url)
      return conn.reply(m.chat, "❌ No pude obtener el audio.", m)

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: json.data.url },
        fileName: `${json.data.title}.mp3`,
        mimetype: "audio/mpeg"
      },
      { quoted: m }
    )

    await m.react("✅")

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠ Error al buscar o descargar el audio.", m)
  }
}

handler.help = ["yt <texto>"]
handler.tags = ["buscador"]
handler.command = ['yt']

export default handler