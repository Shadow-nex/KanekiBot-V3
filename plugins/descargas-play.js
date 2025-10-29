import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim()) return conn.reply(m.chat, `⚽ *Por favor, ingresa el nombre o enlace del video.*`, m)

    let videoIdMatch = text.match(youtubeRegexID)
    let search = await yts(videoIdMatch ? 'https://youtu.be/' + videoIdMatch[1] : text)
    let video = videoIdMatch
      ? search.all.find(v => v.videoId === videoIdMatch[1]) || search.videos.find(v => v.videoId === videoIdMatch[1])
      : search.videos?.[0]

    if (!video) return conn.reply(m.chat, '✧ No se encontraron resultados para tu búsqueda.', m)

    const { title, thumbnail, timestamp, views, ago, url, author } = video
    const vistas = formatViews(views)
    const canal = author?.name || 'Desconocido'

    const infoMessage = `
🍃 *Título:* 
> *${title}*

🚀 *Canal:* 
> ${canal}

💐 *Vistas:*
> ${vistas}

⌛ *Duración:* 
> ${timestamp || 'Desconocido'}

📆 *Publicado:* 
> ${ago || 'Desconocido'}

🌱 *Enlace:*
> ${url}`.trim()

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: canal,
          thumbnailUrl: thumbnail,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m })

    if (command === 'playaudio') {
      const apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(url)}&quality=128`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.status || !json.result?.download?.url)
        throw '*⚠ No se obtuvo un enlace de audio válido.*'

      const data = json.result
      const audioUrl = data.download.url
      const titulo = data.metadata.title

      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${titulo}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: titulo,
            body: data.metadata.author?.name || canal,
            mediaType: 1,
            thumbnailUrl: data.metadata.thumbnail,
            sourceUrl: data.metadata.url,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: fkontak })

      await m.react('🎧')
    }

    if (command === 'playvideo') {
      const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(url)}`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.status || !json.result?.formats?.[0]?.url)
        throw '⚠ No se obtuvo enlace de video válido.'

      const videoData = json.result.formats.find(f => f.qualityLabel === '360p') || json.result.formats[0]
      const videoUrl = videoData.url
      const titulo = json.result.title || title

      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: `🎬 *${titulo}*`,
        mimetype: 'video/mp4',
        fileName: `${titulo}.mp4`,
        contextInfo: {
          externalAdReply: {
            title: titulo,
            body: canal,
            thumbnailUrl: thumbnail,
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: fkontak })

      await m.react('🎥')
    }

  } catch (err) {
    console.error(err)
    return conn.reply(m.chat, `⚠ Ocurrió un error:\n${err}`, m)
  }
}

handler.command = ['playaudio', 'playvideo']
handler.help = ['playaudio', 'playvideo']
handler.tags = ['download']
export default handler

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`
  return views.toString()
}