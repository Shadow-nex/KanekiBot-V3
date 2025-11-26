// - codigo creado x Shadow.xyz 🎋
// - https://github.com/shadox-xyz
// - https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U
// - no quitar creditos xD

import acrcloud from 'acrcloud'
import ytsearch from 'yt-search'
import baileys from '@whiskeysockets/baileys'

const { generateWAMessageFromContent, generateWAMessageContent, proto } = baileys

const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
})

function formatSize(bytes) {
  if (bytes === 0 || isNaN(bytes)) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = q.mimetype || ''
    const mtype = q.mtype || ''

    if (!/audio|video/.test(mime) && !/audioMessage|videoMessage/.test(mtype)) {
      return conn.reply(
        m.chat,
        `✔️ *Usa el comando así:*\n\nEtiqueta un audio o video corto con: *${usedPrefix + command}* para intentar reconocer la canción.`,
        m
      )
    }

    await m.react('🕓')

    const buffer = await q.download?.()
    if (!buffer) throw '❌ No se pudo descargar el archivo. Intenta nuevamente.'

   
    const clipSize = formatSize(Buffer.byteLength(buffer))

    const result = await acr.identify(buffer)
    const { status, metadata } = result

    if (status.code !== 0) throw status.msg || 'No se pudo identificar la canción.'

    const music = metadata.music?.[0]
    if (!music) throw 'No se encontró información de la canción.'

   
    const genres =
      music.genres ||
      music.genre ||
      music.metadata?.genres ||
      [] 

    const genresText =
      Array.isArray(genres)
        ? genres.map(v => v.name).join(', ')
        : typeof genres === 'string'
          ? genres
          : 'Desconocido'

    const title = music.title || 'Desconocido'
    const artist = music.artists?.map(v => v.name).join(', ') || 'Desconocido'
    const album = music.album?.name || 'Desconocido'
    const release = music.release_date || 'Desconocida'

    
    const yt = await ytsearch(`${title} ${artist}`)
    const video = yt.videos.length > 0 ? yt.videos[0] : null

    const published = video ? (video.uploadedAt || video.ago || release) : release

    if (video) {
      const { imageMessage } = await generateWAMessageContent(
        { image: { url: video.thumbnail } },
        { upload: conn.waUploadToServer }
      )

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.fromObject({
                text: `☯ 𝙆𝘼𝙉𝙀𝙆𝙄 𝘽𝙊𝙏 𝙈𝘿 ☯  

🍋 *Título:* ${title}  
🎋 *Artista:* ${artist}  
💿 *Álbum:* ${album}  
📆 *Lanzamiento:* ${release}  
🌿 *Género:* ${genresText}
📦 *Tamaño del clip:* ${clipSize}

⚔️ *YouTube:* ${video.title}  
⏱ *Duración:* ${video.timestamp}  
🔥 *Vistas:* ${video.views.toLocaleString()}  
🌿 *Publicado:* ${published}
📺 *Canal:* ${video.author.name}  
🔗 *Enlace:* ${video.url}`
              }),
              footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: dev
              }),
              header: proto.Message.InteractiveMessage.Header.fromObject({
                title: '',
                hasMediaAttachment: true,
                imageMessage
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                  {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                      display_text: "ᴄᴏᴘɪᴀʀ - ᴜʀʟ",
                      id: video.url,
                      copy_code: video.url
                    })
                  },
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: "🌐 Ver en YouTube",
                      url: video.url,
                      merchant_url: video.url
                    })
                  }
                ]
              })
            })
          }
        }
      }, { quoted: m })

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
      await m.react('✔️')
    }

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `> ❌ Error al identificar la música:\n${e}`, m)
  }
}

handler.help = ['test <audio/video>']
handler.tags = ['tools']
handler.command = ['test']
handler.register = true

export default handler