import fetch from 'node-fetch'
import yts from 'yt-search'
import axios from 'axios'

let handler = async (m, { conn, text, command, usedPrefix }) => {
  try {
    if (!text) {
      return conn.reply(
        m.chat,
        `🎋 Ingresa el nombre de la canción o un enlace de YouTube.\n\n> Ejemplo: ${usedPrefix + command} DJ Malam Pagi`,
        m, fake
      )
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    await conn.reply(m.chat, '*_🦌🛷 Buscando en Youtube_*', m)

    const search = await yts(text)
    const video = search.videos[0]
    if (!video) return conn.reply(m.chat, '☁️ No se encontró ningún resultado.', m)

    const meta = {
      title: video.title,
      duration: video.timestamp,
      url: video.url,
      author: video.author?.name || "Desconocido",
      views: video.views?.toLocaleString('es-PE') || "0",
      ago: video.ago || "Desconocido",
      thumbnail: video.thumbnail
    }

    const apis = [
      { 
        api: 'Adonix',
        endpoint: `${global.APIs.adonix.url}/download/ytaudio?apikey=${global.APIs.adonix.key}&url=${encodeURIComponent(meta.url)}`,
        extractor: res => res.data?.url
      },
      {
        api: 'Vreden',
        endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/audio?url=${encodeURIComponent(meta.url)}&quality=128`,
        extractor: res => res.result?.download?.url
      },
      { 
        api: 'Yupra',
        endpoint: `${global.APIs.yupra.url}/api/downloader/ytmp3?url=${encodeURIComponent(meta.url)}`,
        extractor: res => res.result?.link
      },
      {
        api: 'ZenzzXD v2',
        endpoint: `${global.APIs.zenzxz.url}/api/downloader/ytmp3v2?url=${encodeURIComponent(meta.url)}`,
        extractor: res => res.data?.download_url
      }
    ]

    const { url: downloadUrl, servidor } = await fetchFromApis(apis)
    if (!downloadUrl) return conn.reply(m.chat, 'Ninguna API devolvió el audio.', m)

    const size = await getSize(downloadUrl)
    const sizeStr = size ? formatSize(size) : 'Desconocido'

    const textoInfo = `🍃 *ᴛɪᴛᴜʟᴏ:* ${meta.title} 
☕ *ᴅᴜʀᴀᴄɪᴏɴ:* ${meta.duration}
🪹 *ᴛᴀᴍᴀɴ̃ᴏ:* ${sizeStr}
🌠 *ᴄᴀʟɪᴅᴀᴅ:* 128kbps
🪵 *ᴄᴀɴᴀʟ:* ${meta.author}
🧃 *ᴠɪsᴛᴀs:* ${meta.views}
🗓️ *ᴘᴜʙʟɪᴄᴀᴅᴏ:* ${meta.ago}
🐚 *ᴇɴʟᴀᴄᴇ:* ${meta.url}
🎍 *ᴀᴘɪ:* ${servidor}`

    const thumb = (await conn.getFile(meta.thumbnail)).data
    await conn.sendMessage(m.chat, { image: thumb, caption: textoInfo, ...rcanalw }, { quoted: m })

    const audioResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' })
    const audioBuffer = Buffer.from(audioResponse.data)

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      fileName: `${meta.title}.mp3`,
      mimetype: "audio/mpeg",
      ptt: false,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: '🎅🦌 𝐘 𝐎 𝐔 𝐓 𝐔 𝐁 𝐄 • 𝐌 𝐔 𝐒 𝐈 𝐂 ❄️🎄',
          body: `☕ Duración: ${meta.duration}`,
          thumbnailUrl: meta.thumbnail,
          mediaType: 1,
          sourceUrl: meta.url,
          renderLargerThumbnail: true,
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: "✔️", key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `Error: ${e.message}`, m, rcanal)
  }
}

handler.command = ['ytmp3', 'song']
handler.tags = ['download']
handler.help = ['ytmp3 <texto o link>', 'song <texto>']
handler.group = true
handler.register = true

export default handler


async function fetchFromApis(apis) {
  for (const api of apis) {
    try {
      const res = await axios.get(api.endpoint, { timeout: 10000 })
      const url = api.extractor(res.data)
      if (url) return { url, servidor: api.api }
    } catch (e) { continue }
  }
  return { url: null, servidor: "Ninguno" }
}

async function getSize(url) {
  try {
    const response = await axios.head(url)
    const length = response.headers['content-length']
    return length ? parseInt(length, 10) : null
  } catch {
    return null
  }
}

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  if (!bytes || isNaN(bytes)) return 'Desconocido'
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(2)} ${units[i]}`
}