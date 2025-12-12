import yts from "yt-search"
import fetch from "node-fetch"

// ───────────────────────────────
// SCRAPER YTDL DEV NEVELOOPP
// ───────────────────────────────
const ytdl = {
  async get(video) {
    try {
      const api = 'https://api.vidfly.ai/api/media/youtube/download';
      const headers = {
        'Content-Type': 'application/json',
        'X-App-Name': 'vidfly-web',
        'X-App-Version': '1.0.0',
        'User-Agent': 'Mozilla/5.0 (Android 13; Mobile; rv:146.0) Gecko/146.0 Firefox/146.0',
        'Referer': 'https://vidfly.ai/es/youtube-video-downloader/'
      };

      const response = await fetch(`${api}?url=${encodeURIComponent(video)}`, { headers });
      const data = await response.json();

      if (data.code !== 0) {
        return { status: false, creator: "Neveloopp", result: null };
      }

      const info = data.data;
      const downloads = [];

      for (const item of info.items) {
        downloads.push({
          type: item.type,
          link: item.url,
          quality: item.label
        });
      }

      return {
        status: true,
        creator: "Neveloopp",
        result: {
          title: info.title,
          img: info.cover,
          dl: downloads
        }
      };
    } catch (error) {
      return { status: false, creator: "Neveloopp", result: null };
    }
  }
};

// ───────────────────────────────
// FUNCIONES DEL PLUGIN
// ───────────────────────────────

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

    // ───────────────────────────────────────────
    // **DESCARGA USANDO EL SCRAPER YTDL**
    // ───────────────────────────────────────────
    const scrap = await ytdl.get(v.url)

    if (!scrap.status)
      return conn.reply(m.chat, "> *El scraper falló.*", m)

    // Buscar calidad 480p
    const video480 = scrap.result.dl.find(x =>
      x.type === "video" && x.quality.includes("480")
    )

    if (!video480)
      return conn.reply(m.chat, "> *No hay calidad 480p disponible.*", m)

    const downloadUrl = video480.link

    await conn.sendMessage(
      m.chat,
      {
        video: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: `${scrap.result.title || "video"}.mp4`
      },
      { quoted: m }
    )

    await m.react("✅")

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠ Error al buscar o descargar el video.", m)
  }
}

handler.command = ['yt']
handler.tags = ['download']
handler.help = ['yt + [texto o link]']
handler.group = true
handler.register = true

export default handler