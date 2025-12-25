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
                text: `┏┅┅▣ 𝑾𝒉𝒂𝒕𝒎𝒖𝒔𝒊𝒄 ▣┅≫
┇ 
┇❐ 𝐓𝐢𝐭𝐮𝐥𝐨: ${title}
┇❐ 𝐀𝐫𝐭𝐢𝐬𝐭𝐚: ${artist}
┇❐ 𝐀𝐥𝐛𝐮𝐦: ${album}
┇❐ 𝐋𝐚𝐧𝐳𝐚𝐦𝐢𝐞𝐧𝐭𝐨: ${release}
┇❐ 𝐆𝐞𝐧𝐞𝐫𝐨: ${genresText}
┇❐ 𝐓𝐚𝐦𝐚𝐧𝐨 (𝐜𝐥𝐢𝐩): ${clipSize}
┗┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅≫

┏┅┅▣ 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 - 𝑰𝒏𝑭𝒐 ▣┅≫
┇❐ 𝐓𝐢𝐭𝐮𝐥𝐨: ${video.title}
┇❐ 𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧: ${video.timestamp}
┇❐ 𝐕𝐢𝐬𝐭𝐚𝐬: ${video.views.toLocaleString()}
┇❐ 𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨: ${published}
┇❐ 𝐂𝐚𝐧𝐚𝐥: ${video.author.name}
┇❐ 𝐄𝐧𝐥𝐚𝐜𝐞: ${video.url}
┗┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅≫`
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
                      display_text: "Ver en YouTube",
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

handler.help = ['whatmusic <audio/video>']
handler.tags = ['tools']
handler.command = ['shazam', 'whatmusic']
handler.register = true

export default handler