import fetch from 'node-fetch'

const dev = global.dev || 'Shadow.xyz'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(`🍃 *Ingresa el nombre o artista que quieres buscar en SoundCloud.*`)

  try {
    let trackInfo = {}

    const downloadAudio = async (url) => {
      const res = await fetch(`${global.APIs.zenzxz.url}/api/downloader/soundcloud?url=${encodeURIComponent(url)}`)
      const json = await res.json()
      if (!json.success) throw new Error('No se pudo descargar el audio.')
      return json.data
    }

    if (text.includes('soundcloud.com')) {
      trackInfo = await downloadAudio(text)
    } else {
      const res = await fetch(`${global.APIs.delirius.url}/search/soundcloud?q=${encodeURIComponent(text)}&limit=1`)
      const json = await res.json()
      if (!json.status || !json.data?.length)
        return m.reply('No se encontraron resultados.')

      const track = json.data[0]
      const download = await downloadAudio(track.link)

      trackInfo = {
        ...download,
        ...track,
        duration_seconds: Math.floor(track.duration / 1000),
        source_url: track.link,
        thumbnail: track.image
      }
    }

    const duracionSeg = trackInfo.duration_seconds || 0
    const duracion = `${Math.floor(duracionSeg / 60)}:${(duracionSeg % 60)
      .toString()
      .padStart(2, '0')}`

    const infoFields = [
      ['⬯ Título', trackInfo.title],
      ['⬯ Artista', trackInfo.artist],
      ['⬯ Álbum', trackInfo.album],
      ['⬯ Género', trackInfo.genre],
      ['⬯ Label', trackInfo.label_name || trackInfo.label],
      ['⬯ Licencia', trackInfo.license],
      ['⬯ Likes', trackInfo.likes],
      ['⬯ Reproducciones', trackInfo.play],
      ['⬯ Comentarios', trackInfo.comments],
      ['⬯ Duración', duracion],
      ['⬯ Enlace', trackInfo.source_url]
    ]

    const caption = [
      '🌱 SOUNDCLOUD - MUSIC 🌾',
      ...infoFields.map(([k, v]) => `${k}: ${v ?? '-'}`),
      `> ${dev}`
    ].join('\n')

    await conn.sendMessage(
      m.chat,
      {
        image: { url: trackInfo.thumbnail || banner },
        caption
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: trackInfo.download_url },
        mimetype: 'audio/mpeg',
        fileName: `${trackInfo.title || 'soundcloud'}.mp3`
      },
      { quoted: m }
    )

  } catch (err) {
    console.error(err)
    m.reply('*Ocurrió un error al procesar la canción.*')
  }
}

handler.command = ['sound', 'soundcloud']
handler.help = ['soundcloud <nombre o artista>']
handler.tags = ['download']
handler.group = true

export default handler