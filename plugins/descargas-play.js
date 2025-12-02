import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim())
      return conn.reply(m.chat, `🪻 *Por favor, ingresa el nombre o enlace del video.*`, m, rcanal)

    let videoIdMatch = text.match(youtubeRegexID)
    let search = await yts(videoIdMatch ? 'https://youtu.be/' + videoIdMatch[1] : text)
    let video = videoIdMatch
      ? search.all.find(v => v.videoId === videoIdMatch[1]) || search.videos.find(v => v.videoId === videoIdMatch[1])
      : search.videos?.[0]

    if (!video) return conn.reply(m.chat, '✧ No se encontraron resultados para tu búsqueda.', m)

    const { title, thumbnail, timestamp, views, ago, url, author } = video
    const vistas = formatViews(views)
    const canal = author?.name || 'Desconocido'
    const canalLink = author?.url || 'https://youtube.com'

    const infoMessage = `🍃 *${title}*

✿ *Canal:* ${canal}
✎ *Vistas:* ${vistas}
❑ *Duración:* ${timestamp || 'Desconocido'}
☁︎ *Publicado:* ${ago || 'Desconocido'}
➪ *Enlace:* ${url}

✧︎ *Canal:* ${canalLink}`.trim()

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: canal,
          thumbnailUrl: 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763869835047_557840.jpeg',
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m })

    if (command === 'playaudio') {
      const apiUrl = `https://akirax-api.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.status || !json.result?.download)
        throw '*⚠ No se obtuvo un enlace de audio válido.*'

      const data = json.result
      const audioUrl = data.download
      const titulo = data.title
      const thumb = data.thumbnail

      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${titulo}.mp3`,
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: titulo,
            body: canal,
            mediaType: 1,
            thumbnailUrl: thumb,
            sourceUrl: url,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: fkontak })

      await m.react('🎧')
    }

    if (command === 'playvideo') {
      const apiUrl = `https://akirax-api.vercel.app/ytplay?url=${encodeURIComponent(url)}`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.status || !json.result?.video?.url)
        throw '⚠ No se obtuvo enlace de video válido.'

      const videoUrl = json.result.video.url
      const titulo = json.result.title || title

      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: null,
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
    return conn.reply(m.chat, `⚠ Ocurrió un error:\n${err}`, m, rch)
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