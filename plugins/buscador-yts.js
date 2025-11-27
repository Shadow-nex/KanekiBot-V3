import fetch from 'node-fetch'
import yts from 'yt-search'
import axios from 'axios'

const MAX_FILE_SIZE_MB = 80
const CACHE_TIME = 10 * 60 * 1000
let ytCache = {}

function formatNumber(num) {
  return num.toLocaleString('en-US')
}

async function getSize(url) {
  try {
    const res = await axios.head(url)
    const len = res.headers['content-length']
    return len ? parseInt(len, 10) : 0
  } catch {
    return 0
  }
}

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${units[i]}`
}

async function getshadowa(url) {
  try {
    const api = `https://api-shadowxyz.vercel.app/download/ytmp3V2?url=${encodeURIComponent(url)}`
    const res = await fetch(api)
    const data = await res.json()

    if (data?.status === true && data?.result?.download_url) {
      return {
        link: data.result.download_url,
        format: 'mp3'
      }
    }
    return null
  } catch {
    return null
  }
}

async function getshadowv(url) {
  try {
    const api = `https://api-shadowxyz.vercel.app/download/ytmp4V2?url=${encodeURIComponent(url)}`
    const res = await fetch(api)
    const data = await res.json()

    if (data?.status === true && data?.result?.download_url) {
      return {
        link: data.result.download_url,
        format: 'mp4'
      }
    }
    return null
  } catch {
    return null
  }
}

var handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, `🌸 *Ingresa el nombre o enlace de YouTube.*`, m)

  try {
    await m.react('🔍')
    const results = await yts(text)
    const videos = results.videos.slice(0, 15)
    if (!videos.length) return conn.reply(m.chat, '⚠️ No se encontraron resultados.', m)

    ytCache[m.sender] = { results: videos, timestamp: Date.now() }

    let caption = ` 🎍 𝚁𝙴𝚂𝚄𝙻𝚃𝙰𝙳𝙾𝚂 𝙳𝙴 𝙱𝚄𝚂𝚀𝚄𝙴𝙳𝙰\n`
    caption += `*Término:* ${text}\n`
    caption += `*Mostrando:* \`15\`\n\n`

    for (let i = 0; i < videos.length; i++) {
      const v = videos[i]
      caption += `🍃ᭃ *${i + 1}.* ${v.title}\n`
      caption += `> 🌠ᭃ ᴄᴀɴᴀʟ: *${v.author.name}*\n`
      caption += `> ⏰ᭃ ᴅᴜʀᴀᴄɪᴏɴ: *${v.timestamp || 'Desconocida'}*\n`
      caption += `> 🗓️ᭃ sᴜʙɪᴅᴏ: *${v.ago || 'N/D'}*\n`
      caption += `> 🧃ᭃ ᴠɪsᴛᴀs: *${formatNumber(v.views)}*\n`
      caption += `> 🪹ᭃ ʟɪɴᴋ: ${v.url}\n`
      caption += `\n${'•'.repeat(38)}\n\n`
    }

    caption += `🪷 *Responde con:*
お ☕ a1 - a15 → Descargar audio
お 🌳 v1 - v15 → Descargar video`

    await conn.sendMessage(m.chat, {
      image: { url: videos[0].thumbnail },
      caption, ...fake
    }, { quoted: m })

    await m.react('✔️')
  } catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, ` Error al procesar: ${e.message}`, m)
  }
}

handler.before = async (m, { conn }) => {
  if (!m.text) return
  const match = m.text.trim().match(/^(a|v)(\d{1,2})$/i)
  if (!match) return

  const type = match[1].toLowerCase() === 'a' ? 'audio' : 'video'
  const index = parseInt(match[2]) - 1

  const userCache = ytCache[m.sender]
  if (!userCache || !userCache.results[index] || Date.now() - userCache.timestamp > CACHE_TIME)
    return conn.reply(m.chat, '🎍 La lista expiró. Usa el comando nuevamente.', m, rcanal)

  const video = userCache.results[index]

  try {
    await m.react('🕒')

    const apiData = type === 'audio'
      ? await getshadowa(video.url)
      : await getshadowv(video.url)

    if (!apiData) return conn.reply(m.chat, `🍃 Error al obtener enlace desde la API.`, m, fake)

    const size = await getSize(apiData.link)
    const mb = size / (1024 * 1024)
    const sendAsDoc = mb > MAX_FILE_SIZE_MB

    const caption = `📡 *${video.title}*\n🌾 *Duración:* ${video.timestamp || 'Desconocida'}\n💮 *Tamaño:* ${formatSize(size)}`

    if (sendAsDoc) {
      await conn.sendMessage(
        m.chat,
        {
          document: { url: apiData.link },
          fileName: `${video.title}.${apiData.format}`,
          mimetype: type === 'audio' ? 'audio/mpeg' : 'video/mp4',
          caption: caption + `\n\n🚀 Enviado como documento (>${MAX_FILE_SIZE_MB} MB)`
        },
        { quoted: m }
      )
    } else if (type === 'audio') {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: apiData.link },
          fileName: `${video.title}.mp3`,
          mimetype: 'audio/mpeg',
          ptt: false,
          caption
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: apiData.link },
          fileName: `${video.title}.mp4`,
          mimetype: 'video/mp4',
          caption
        },
        { quoted: m }
      )
    }

    await m.react('✔️')
  } catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, `Error al descargar: ${e.message}`, m)
  }
}

handler.help = ['ytbuscar <texto>']
handler.tags = ['search']
handler.command = ['ytbuscar', 'yts', 'ytsearch']
handler.group = true

export default handler