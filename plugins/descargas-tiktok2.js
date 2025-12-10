import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    let regex = /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/[^\s]+/i
    let match = m.text.match(regex)
    if (!match) return

    let url = match[0]
    await m.react('⏳')

    let api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}?hd=1`
    let res = await fetch(api)
    let json = await res.json()

    if (!json || json.code !== 0 || !json.data) {
      await m.react('❌')
      return conn.reply(m.chat, 'No se pudo obtener el video.', m)
    }

    const d = json.data
    const { title, duration, play, cover, images, create_time } = d

    let sizeMB = 0
    try {
      let head = await fetch(play, { method: "HEAD" })
      let size = head.headers.get("content-length")
      if (size) sizeMB = (Number(size) / 1024 / 1024).toFixed(2)
    } catch {}

    let info = `> 🌿 *${title || 'Sin título'}*
> ⏱️ \`Duración:\` ${duration || 0}s
> 🗓️ \`Publicado:\` ${new Date(create_time * 1000).toLocaleString()}
> 🎋 \`Tamaño:\` ${sizeMB || 'Desconocido'} MB`

    if (images && images.length > 0) {
      await m.react('🖼️')

      let mediaArray = []
      for (let img of images) {
        mediaArray.push({ image: { url: img } })
      }
 
      await conn.sendMessage(
        m.chat,
        {
          caption: info,
          image: { url: images[0] },
          mediaUploadTimeoutMs: 100000
        },
        { quoted: m }
      )
      for (let i = 1; i < images.length; i++) {
        await conn.sendMessage(
          m.chat,
          { image: { url: images[i] } },
          { quoted: m }
        )
      }

      return await m.react('✔️')
    }

    await m.react('📥')
    await conn.sendMessage(
      m.chat,
      {
        video: { url: play },
        caption: info,
        gifPlayback: false,
        jpegThumbnail: Buffer.from(await (await fetch(cover)).arrayBuffer())
      },
      { quoted: m }
    )

    await m.react('✔️')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(m.chat, '❌ Error al procesar el video.', m)
  }
}

handler.customPrefix = /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/[^\s]+/i
handler.command = new RegExp
export default handler