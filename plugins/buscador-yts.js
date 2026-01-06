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
    return res.headers['content-length']
      ? parseInt(res.headers['content-length'], 10)
      : 0
  } catch {
    return 0
  }
}

function formatSize(bytes) {
  if (!bytes) return 'Desconocido'
  const u = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (bytes >= 1024 && i < u.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${u[i]}`
}

async function getYTDL(url, type = 'audio') {
  try {
    const quality = type === 'audio' ? '128' : '360'
    const api = `https://api-shadow-xyz.onrender.com/download/ytdl?url=${encodeURIComponent(
      url
    )}&type=${type}&quality=${quality}`

    const res = await fetch(api)
    const json = await res.json()

    return json?.status ? json.result?.url : null
  } catch {
    return null
  }
}

var handler = async (m, { text, conn }) => {
  if (!text)
    return conn.reply(m.chat, 'ⓘ *Ingresa el nombre o link de YouTube*', m)

  try {
    await m.react('🔍')

    const res = await yts(text)
    const videos = res.videos.slice(0, 20)
    if (!videos.length)
      return conn.reply(m.chat, '❌ No se encontraron resultados.', m)

    ytCache[m.sender] = {
      results: videos,
      timestamp: Date.now()
    }

    let caption = `仚 *Resultados de búsqueda*\n`
    caption += `⸙͎ *Término:* ${text}\n`
    caption += `⸙͎ *Mostrando:* ${videos.length}\n\n`

    videos.forEach((v, i) => {
      caption += `➩ *Título:* ${v.title}\n`
      caption += `🫛 *Número:* ${i + 1}\n`
      caption += `🌾 *Canal:* ${v.author.name}\n`
      caption += `🍃 *Duración:* ${v.timestamp}\n`
      caption += `🌱 *Vistas:* ${formatNumber(v.views)}\n`
      caption += `💥 *Link:* https://youtube.com/${v.videoId}\n`
      caption += `${'─'.repeat(25)}\n\n`
    })

    caption += `📥 *Responder ESTE mensaje con:*\n`
    caption += `▸ \`A1\` para audio\n`
    caption += `▸ \`V1\` para video`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: videos[0].thumbnail },
        caption
      },
      { quoted: m }
    )

    await m.react('✔️')
  } catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, `❌ Error: ${e.message}`, m)
  }
}

handler.before = async (m, { conn }) => {
  if (!m.text || !m.quoted) return
  if (!m.quoted.fromMe) return
  if (!/Resultados de búsqueda/i.test(m.quoted.text || '')) return

  const match = m.text.trim().match(/^(a|v)(\d{1,2})$/i)
  if (!match) return

  const type = match[1].toLowerCase() === 'a' ? 'audio' : 'video'
  const index = parseInt(match[2]) - 1

  const cache = ytCache[m.sender]
  if (!cache || !cache.results[index])
    return conn.reply(
      m.chat,
      '◌ *La lista expiró o el número no es válido.*',
      m
    )

  if (Date.now() - cache.timestamp > CACHE_TIME)
    return conn.reply(m.chat, '⏱️ *La lista ya expiró.*', m)

  const video = cache.results[index]

  try {
    await m.react('🕒')

    const url = await getYTDL(video.url, type)
    if (!url)
      return conn.reply(m.chat, '❌ Error al generar enlace.', m)

    const size = await getSize(url)
    const asDoc = size / (1024 * 1024) > MAX_FILE_SIZE_MB

    const caption = `❀ *${video.title}*
✎ *Duración:* ${video.timestamp}
✰ *Tamaño:* ${formatSize(size)}`

    if (asDoc) {
      await conn.sendMessage(
        m.chat,
        {
          document: { url },
          mimetype: type === 'audio' ? 'audio/mpeg' : 'video/mp4',
          fileName: `${video.title}.${type === 'audio' ? 'mp3' : 'mp4'}`,
          caption: caption + `\n\n◌ Enviado como documento`
        },
        { quoted: m }
      )
    } else if (type === 'audio') {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url },
          mimetype: 'audio/mpeg',
          fileName: `${video.title}.mp3`,
          ptt: false,
          caption
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          video: { url },
          mimetype: 'video/mp4',
          fileName: `${video.title}.mp4`,
          caption
        },
        { quoted: m }
      )
    }

    await m.react('✔️')
  } catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, `❌ Error: ${e.message}`, m)
  }
}

handler.help = ['ytbuscar <texto>']
handler.tags = ['search']
handler.command = ['ytbuscar', 'yts', 'ytsearch']
handler.group = true
handler.register = true

export default handler