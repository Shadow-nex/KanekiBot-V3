import fetch from 'node-fetch'
import Jimp from 'jimp'
import baileys from '@whiskeysockets/baileys'
const { proto, generateWAMessageContent, generateWAMessageFromContent } = baileys

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(
      `*🍂 ingresa un link de spotify.*`
    )

  await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } })

  try {

    let spotifyUrl = text.includes('spotify.com/track') ? text : null

    if (!spotifyUrl) {
      const search = await fetch(
        `https://api.yupra.my.id/api/search/spotify?q=${encodeURIComponent(text)}`
      )
      if (!search.ok) throw 'Error al buscar en la API Yupra.'

      const sdata = await search.json()
      const first = sdata.result?.[0]
      if (!first) throw '❌ No se encontraron canciones.'

      spotifyUrl = first.spotify_preview || first.url
    }


    const res = await fetch(
      `https://api.stellarwa.xyz/dl/spotifyv2?url=${encodeURIComponent(
        spotifyUrl
      )}&key=stellar-3j2706f1`
    )
    if (!res.ok) throw 'Error al conectar con la API Stellar.'

    const data = await res.json()
    if (!data.status || !data.data?.dl)
      throw '❌ No pude obtener la descarga del audio.'

    const d = data.data

    const song = {
      title: d.title,
      artist: d.artist,
      album: d.album,
      release: d.release_date,
      duration: d.duration,
      image: d.image,
      card: d.card,
      download: d.dl,
      spotify: spotifyUrl,
    }

    let thumb = null
    try {
      const img = await Jimp.read(song.image)
      img.resize(500, Jimp.AUTO)
      thumb = await img.getBufferAsync(Jimp.MIME_JPEG)
    } catch {}

    const caption = `🎧 *𝐓𝐢𝐭𝐮𝐥𝐨:* ${song.title}
👤 *𝐀𝐫𝐭𝐢𝐬𝐭𝐚:* ${song.artist}
💽 *𝐀𝐥𝐛𝐮𝐦:* ${song.album}
📆 *𝐋𝐚𝐧𝐳𝐚𝐦𝐢𝐞𝐧𝐭𝐨:* ${song.release}
⏱️ *𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧:* ${song.duration}

🔗 *𝐄𝐧𝐥𝐚𝐜𝐞:* [⚡ Spotify](${song.spotify})
`.trim()

    const { imageMessage } = await generateWAMessageContent(
      { image: { url: song.card || song.image } },
      { upload: conn.waUploadToServer }
    )

    const docMessage = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              header: proto.Message.InteractiveMessage.Header.fromObject({
                hasMediaAttachment: true,
                imageMessage
              }),
              body: proto.Message.InteractiveMessage.Body.fromObject({
                text: caption
              }),
              footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: "✨ Descarga lista"
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                  {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                      display_text: "🎵 Escuchar en Spotify",
                      url: song.spotify
                    })
                  },
                  {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                      display_text: "📥 :v",
                      url: song.download
                    })
                  }
                ]
              })
            })
          }
        }
      },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, docMessage.message, { messageId: docMessage.key.id })

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: song.download },
        mimetype: 'audio/mpeg',
        ptt: false, // nota de voz xd
        fileName: `${song.title}.mp3`,
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ Error al procesar la descarga de Spotify.')
  }
}

handler.help = ['music <url|nombre>']
handler.tags = ['download']
handler.command = ['music', 'spotifydl']
handler.group = true
handler.register = true

export default handler