import fetch from 'node-fetch'
import baileys from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, generateWAMessageContent, proto } = baileys

const USER = "AkiraDevX"
const REPO = "uploads"
const TOKEN = 'no ay XD'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = q.mimetype || ''

  if (!mime) return m.reply('🪴 *Responde a cualquier archivo para subirlo a GitHub.*')

  await m.react('⏳')
  await conn.sendMessage(m.chat, { 
    text: "📤 *Subiendo archivo uwu...*\nEspera un ratito 👉👈" 
  }, { quoted: m })

  let media = await q.download()
  let base64 = media.toString("base64")

  let ext = mime.split('/')[1] || 'bin'
  let type = mime.split('/')[0]

  let filename = Date.now() + "_" + Math.floor(Math.random() * 999999)
  let path = `uploads/${filename}.${ext}`

  const apiURL = `https://api.github.com/repos/${USER}/${REPO}/contents/${path}`

  let res = await fetch(apiURL, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Upload (AkiraDevX Host)",
      content: base64
    })
  })

  let json = await res.json()

  if (!json.content) {
    console.log(json)
    await m.react('❌')
    return m.reply("❌ *Error al subir el archivo a GitHub.*")
  }

  let url = json.content.download_url

  let preview
  if (type === "image") {
    preview = await generateWAMessageContent(
      { image: media },
      { upload: conn.waUploadToServer }
    )
  } else if (type === "video") {
    preview = await generateWAMessageContent(
      { video: media },
      { upload: conn.waUploadToServer }
    )
  }

  const info = `🍃 *Archivo Subido a GitHub*
📦 *Tipo:* ${mime}
📄 *Nombre:* ${filename}.${ext}
🔗 *Link:*  
${url}
`

  let msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: info
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: "Copiar Link",
                  copy_code: url
                })
              },
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: "Abrir en GitHub",
                  url
                })
              }
            ]
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: true,
            ...(type === "image"
              ? { imageMessage: preview?.imageMessage }
              : type === "video"
              ? { videoMessage: preview?.videoMessage }
              : {})
          })
        })
      }
    }
  }, { quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  await m.react('✅')
}

handler.help = ['upload']
handler.tags = ['tools']
handler.command = ['upload', 'subir', 'url']

export default handler