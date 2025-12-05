import axios from "axios"
import { generateWAMessageFromContent, proto } from "@whiskeysockets/baileys"

let handler = async (m, { conn, args }) => {
  const link = args[0]
  if (!link || !link.includes("chat.whatsapp.com"))
    return m.reply("❗ *Ingresa un link de grupo válido*\nEjemplo: .invitar https://chat.whatsapp.com/XXXXXX")

  // PERSONALIZAR:
  const titulo = "Welcome To Grupo"
  const descripcion = "Disfruta tu estadía en el grupo."
  const autor = "Shado 🍀"
  const imagen = banner// URL de imagen que quieras

  try {
    // Descargar la imagen
    let getImg = await axios.get(imagen, { responseType: "arraybuffer" })
    let img = getImg.data

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            "messageContextInfo": { "deviceListMetadata": {}, "deviceListMetadataVersion": 2 },
            templateMessage: {
              hydratedTemplate: {
                hydratedContentText: `✨ *${titulo}*\n${descripcion}\n\n👤 *By:* ${autor}`,
                locationMessage: { jpegThumbnail: img },
                hydratedButtons: [
                  {
                    urlButton: {
                      displayText: "Unirme al grupo",
                      url: link
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, {})
  } catch (e) {
    console.log(e)
    m.reply("❗ Error al enviar la tarjeta.")
  }
}

handler.help = ["invitar <link>"]
handler.tags = ["grupo"]
handler.command = ["invitar"]

export default handler