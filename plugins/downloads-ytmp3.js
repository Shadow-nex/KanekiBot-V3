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
  const kbps = 128
  const mb = (duracionSeg * kbps) / 8 / 1024
  return mb.toFixed(2) + " MB"
}

let handler = async (m, { conn, text, command }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `*❀ Ingresa el nombre de la canción o un enlace de YouTube.*`,
      m
    )

  await m.react("⏰")

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
    const duracionBonita = convertirDuracion(v.timestamp)

    const info = `* ݁  🌾՞  YOUTUBE - DOWNLOAD  ᗤᗤ*

*⌕𓈒 ݇ܶ  ᴛɪᴛᴜʟᴏ ›* ${v.title}
*⌕𓈒 ݇ܶ  ɪᴅ ›* ${v.videoId}
*⌕𓈒 ݇ܶ  ᴄᴀʟɪᴅᴀᴅ ›* 128k
*⌕𓈒 ݇ܶ  ᴄᴀɴᴀʟ ›* ${v.author.name}
*⌕𓈒 ݇ܶ  ᴠɪsᴛᴀs ›* ${v.views.toLocaleString()}
*⌕𓈒 ݇ܶ  ᴅᴜʀᴀᴄɪᴏɴ ›* ${duracionBonita}
*⌕𓈒 ݇ܶ  ᴘᴜʙʟɪᴄᴀᴅᴏ ›* ${v.ago}
*⌕𓈒 ݇ܶ  ᴛᴀᴍᴀɴ̃ᴏ ›* ${tamaño}
*⌕𓈒 ݇ܶ  ʟɪɴᴋ ›* ${v.url}`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: v.thumbnail },
        caption: info
      },
      { quoted: m }
    )

    const api = `${global.APIs.adonix.url}/download/ytaudio?apikey=${global.APIs.adonix.key}&url=${encodeURIComponent(v.url)}`

    const res = await fetch(api)
    const json = await res.json()

    if (!json?.data?.url)
      return conn.reply(m.chat, "> *No pude obtener el audio.*", m)

    /*await conn.sendMessage(
      m.chat,
      {
        audio: { url: json.data.url },
        fileName: `${json.data.title}.mp3`,
        mimetype: "audio/mpeg"
      },
      { quoted: m }
    )*/
    
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: json.data.url },
        fileName: `${json.data.title}.mp3`,
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: '◁◁   ↻    ▐ ▌    ↺   ▷▷',
            body: `1:15 ━━━━━•───── 3:26`,
            sourceUrl: v.url,
            thumbnailUrl: v.thumbnail,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    );

    await m.react("✔️")

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠ Error al buscar o descargar el audio.", m)
  }
}

handler.command = ['ytmp3', 'song']
handler.tags = ['download']
handler.help = ['ytmp3 <texto o link>']
handler.group = true
handler.register = true

export default handler