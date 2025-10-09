import yts from "yt-search"
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from "@whiskeysockets/baileys"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply("🍉 *Ingresa un título para buscar en YouTube.*")
  await m.react("🕓")

  try {
    const res = await yts(args.join(" "))
    const video = res.videos[0]
    if (!video) return m.reply("✖️ *No se encontraron resultados.*")

    const caption = `
╭━━━〔 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 - 𝐏𝐋𝐀𝐘 〕━━⬣
🍧 *${video.title}*
│✧ *Canal:* ${video.author.name}
│⌛ *Duración:* ${video.duration.timestamp}
│👁️ *Vistas:* ${video.views.toLocaleString()}
│📅 *Publicado:* ${video.ago}
│🔗 *Link:* ${video.url}
╰━━━━━━━━━━━━━━⬣
`.trim()

    // 🔹 Carga la miniatura correctamente
    const media = await prepareWAMessageMedia(
      { image: { url: video.thumbnail } },
      { upload: conn.waUploadToServer }
    )

    // 🔹 Estructura correcta de mensaje interactivo
    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadataVersion: 2,
              deviceListMetadata: {},
            },
            interactiveMessage: {
              header: {
                title: "🎧 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗣𝗟𝗔𝗬",
                hasMediaAttachment: true,
                imageMessage: media.imageMessage, // ✅ se coloca aquí correctamente
              },
              body: { text: caption },
              footer: { text: "🩵 𝙍𝙞𝙣 𝙄𝙩𝙤𝙨𝙝𝙞 | 𝘽𝙊𝙏" },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "🎧 AUDIO DOC",
                      id: `${usedPrefix}ytmp3doc ${video.url}`,
                    }),
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "🎬 VIDEO DOC",
                      id: `${usedPrefix}ytmp4doc ${video.url}`,
                    }),
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "🎶 AUDIO",
                      id: `${usedPrefix}yta ${video.url}`,
                    }),
                  },
                  {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                      display_text: "📹 VIDEO",
                      id: `${usedPrefix}ytmp4 ${video.url}`,
                    }),
                  },
                ],
              },
            },
          },
        },
      },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react("✅")
  } catch (err) {
    console.error(err)
    await m.react("✖️")
    m.reply("✖️ *Error al buscar o enviar el video.*")
  }
}

handler.help = ["play1"]
handler.tags = ["descargas"]
handler.command = ["play1"]
export default handler