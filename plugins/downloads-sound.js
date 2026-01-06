// by shadow.xyz

import fetch from 'node-fetch'

const handler = async (m, { conn, text, command }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `🎧 *Ingresa qué quieres buscar en SoundCloud*\n\nEjemplo:\n.${command} twice`,
      m
    )

  try {
    await m.react('🕒')

    // 🔍 Buscar (1 resultado)
    const searchUrl = `https://api.delirius.store/search/soundcloud?q=${encodeURIComponent(text)}&limit=1`
    const searchRes = await fetch(searchUrl)
    const searchJson = await searchRes.json()

    if (!searchJson.status || !searchJson.data?.length)
      throw 'No se encontraron resultados'

    const sc = searchJson.data[0]

    // ⏱ Duración
    const duration = (ms) => {
      let s = Math.floor(ms / 1000)
      let m = Math.floor(s / 60)
      s %= 60
      return `${m}:${s.toString().padStart(2, '0')}`
    }

    // 📝 Info
    const caption = `
🎵 *${sc.title}*
👤 *Artista:* ${sc.artist || 'Desconocido'}
⏱ *Duración:* ${duration(sc.duration)}
❤️ *Likes:* ${sc.likes}
▶️ *Reproducciones:* ${sc.play}

⬇️ *Descargando audio...*
    `.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: sc.image },
        caption
      },
      { quoted: m }
    )

    // ⬇️ Descargar audio usando el link encontrado
    const dlUrl = `https://api.delirius.store/download/soundcloud?url=${encodeURIComponent(sc.link)}`
    const dlRes = await fetch(dlUrl)
    const dlJson = await dlRes.json()

    if (!dlJson.status || !dlJson.data?.download)
      throw 'No se pudo descargar el audio'

    const audio = dlJson.data

    // 🎧 Enviar audio
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audio.download },
        mimetype: 'audio/mpeg',
        fileName: `${audio.title}.mp3`
      },
      { quoted: m }
    )

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(m.chat, '❌ Error al procesar SoundCloud', m)
  }
}

handler.help = ['soundcloud + [texto]']
handler.tags = ['music']
handler.command = ['soundcloud', 'sound']

export default handler