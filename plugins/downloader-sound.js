import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) return m.reply(`🍂 *Uso correcto:* 
> ${usedPrefix + command} <url de SoundCloud>

📀 *Ejemplo:*
> ${usedPrefix + command} https://m.soundcloud.com/...`)

    await m.react('⏳')
    let res = await fetch(`https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(text)}`)
    let data = await res.json()
    if (!data.status) return m.reply('No se pudo obtener el audio.')

    let meta = data.data
    let dur = `${Math.floor(meta.duration / 60000).toString().padStart(2, '0')}:${Math.floor(meta.duration / 1000 % 60).toString().padStart(2, '0')}`
    let audioBuffer = await (await fetch(meta.url)).buffer()

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      fileName: `${meta.title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: `💐 ${meta.title}`,
          body: `✨ ${meta.user} | 🍃 ${dur}`,
          thumbnailUrl: meta.thumbnail,
          mediaType: 2,
          renderLargerThumbnail: true,
          mediaUrl: text,
          sourceUrl: text
        }
      }
    }, { quoted: m })

    await m.react('✔️')

  } catch (e) {
    console.error(e)
    await m.reply('🌿 Error inesperado al procesar el audio.')
  }
}

handler.help = ['soundcloud2']
handler.tags = ['download']
handler.command = ['soundcloud2', 'scdl']

export default handler