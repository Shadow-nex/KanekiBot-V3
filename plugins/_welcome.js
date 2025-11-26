import fs from 'fs'
import fetch from 'node-fetch'
import { WAMessageStubType, generateWAMessageContent, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

//––––––––––––––––––––––––––––––––––––––––––
//      DETECTAR PAÍS (no toqué nada)
//––––––––––––––––––––––––––––––––––––––––––
const detectarPais = (numero) => {
  const codigos = {
    "593": "🇪🇨 Ecuador", "591": "🇧🇴 Bolivia", "595": "🇵🇾 Paraguay", "598": "🇺🇾 Uruguay",
    "502": "🇬🇹 Guatemala", "503": "🇸🇻 El Salvador", "504": "🇭🇳 Honduras",
    "505": "🇳🇮 Nicaragua", "506": "🇨🇷 Costa Rica", "507": "🇵🇦 Panamá",
    "234": "🇳🇬 Nigeria", "254": "🇰🇪 Kenia", "212": "🇲🇦 Marruecos",
    "213": "🇩🇿 Argelia", "216": "🇹🇳 Túnez", "218": "🇱🇾 Libia",
    "51": "🇵🇪 Perú", "52": "🇲🇽 México", "53": "🇨🇺 Cuba",
    "54": "🇦🇷 Argentina", "55": "🇧🇷 Brasil", "56": "🇨🇱 Chile",
    "57": "🇨🇴 Colombia", "58": "🇻🇪 Venezuela",
    "1": "🇺🇸 EE.UU / 🇨🇦 Canadá", "7": "🇷🇺 Rusia / 🇰🇿 Kazajistán",
    "20": "🇪🇬 Egipto", "27": "🇿🇦 Sudáfrica", "30": "🇬🇷 Grecia",
    "31": "🇳🇱 Países Bajos", "32": "🇧🇪 Bélgica", "33": "🇫🇷 Francia",
    "34": "🇪🇸 España", "36": "🇭🇺 Hungría", "39": "🇮🇹 Italia",
    "40": "🇷🇴 Rumania", "44": "🇬🇧 Reino Unido", "49": "🇩🇪 Alemania",
    "60": "🇲🇾 Malasia", "61": "🇦🇺 Australia", "62": "🇮🇩 Indonesia",
    "63": "🇵🇭 Filipinas", "64": "🇳🇿 Nueva Zelanda",
    "65": "🇸🇬 Singapur", "66": "🇹🇭 Tailandia",
    "81": "🇯🇵 Japón", "82": "🇰🇷 Corea del Sur", "84": "🇻🇳 Vietnam",
    "86": "🇨🇳 China",
    "90": "🇹🇷 Turquía", "91": "🇮🇳 India"
  }

  const keysOrdenadas = Object.keys(codigos).sort((a, b) => b.length - a.length)
  for (const code of keysOrdenadas) {
    if (numero.startsWith(code)) return codigos[code]
  }
  return "Desconocido 🥗"
}

//––––––––––––––––––––––––––––––––––––––––––
//      BIENVENIDA — username arreglado
//––––––––––––––––––––––––––––––––––––––––––
const generarBienvenida = async ({ conn, userId, groupMetadata, chat }) => {

  // 🔥 AQUÍ TU PROBLEMA → username era el número, AHORA ES EL NOMBRE
  const username = `@${await conn.getName(userId) || userId.split('@')[0]}`

  const nacionalidad = detectarPais(userId.split('@')[0])

  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763585864348_780365.jpeg')

  const fecha = new Date()
  const fechaTexto = fecha.toLocaleDateString("es-ES", { timeZone: "America/Lima" })
  const hora = fecha.toLocaleTimeString("es-PE", { timeZone: "America/Lima", hour: "numeric", minute: "numeric" })

  const desc = groupMetadata.desc?.toString() || '*Sin descripción*'

  const finalMsg = (chat.sWelcome || 'Edita con *setwelcome*')
    .replace(/{usuario}/g, username)
    .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
    .replace(/{desc}/g, desc)

  const caption = `✿┆. 🥗 ...  
𝅄 ︵୭୧┈꒰ ${username} ꒱︵
⋅˚₊‧🄿ais:* ${nacionalidad}
⋅˚₊‧🄷ora:* ${hora}
⋅˚₊‧🄵echa:* ${fechaTexto}

• *Descripción:*
• .˚🌊 𓈒𓏸 *\`\`\`${finalMsg}\`\`\`* 𖥻
`

  return { pp, caption, username }
}

//––––––––––––––––––––––––––––––––––––––––––
//      DESPEDIDA — username arreglado
//––––––––––––––––––––––––––––––––––––––––––
const generarDespedida = async ({ conn, userId, groupMetadata, chat }) => {

  const username = `@${await conn.getName(userId) || userId.split('@')[0]}`

  const nacionalidad = detectarPais(userId.split('@')[0])

  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763585864348_780365.jpeg')

  const fecha = new Date()
  const fechaTexto = fecha.toLocaleDateString("es-ES", { timeZone: "America/Lima" })
  const hora = fecha.toLocaleTimeString("es-PE", { timeZone: "America/Lima", hour: "numeric", minute: "numeric" })

  const desc = groupMetadata.desc?.toString() || '*Sin descripción*'

  const finalMsg = (chat.sBye || 'Edita con *setbye*')
    .replace(/{usuario}/g, username)
    .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
    .replace(/{desc}/g, desc)

  const caption = `✿┆. 🥗 ...
𝅄 ︵୭୧┈꒰ ${username} ꒱︵
⋅˚₊‧🄿ais:* ${nacionalidad}
⋅˚₊‧🄷ora:* ${hora}
⋅˚₊‧🄵echa:* ${fechaTexto}

• .˚🌊 𓈒𓏸 "${finalMsg}" 𖥻
`

  return { pp, caption, username }
}

let handler = m => m

//––––––––––––––––––––––––––––––––––––––––––
//      HANDLER — no toqué tu estructura
//––––––––––––––––––––––––––––––––––––––––––
handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  const chat = global.db.data.chats[m.chat]
  const userId = m.messageStubParameters[0]

  let thumb = await fetch('https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763586769709_495967.jpeg')
    .then(res => res.arrayBuffer()).catch(() => null)

  const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', id: 'Halo' },
    message: { locationMessage: { name: '🌲✨  KANEKI - IA ✨🌲', jpegThumbnail: Buffer.from(thumb || []) } }
  }

  try {

    //––––––––– BIENVENIDA ––––––––––
    if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {

      const { pp, caption } = await generarBienvenida({ conn, userId, groupMetadata, chat })

      const { imageMessage } = await generateWAMessageContent(
        { image: { url: pp } },
        { upload: conn.waUploadToServer }
      )

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: { text: caption },
              footer: { text: dev },
              header: {
                title: "",
                hasMediaAttachment: true,
                imageMessage
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: "⌒᷼✿ CANAL ⿻",
                      url: channel,
                      merchant_url: channel
                    })
                  }
                ]
              }
            })
          }
        }
      }, { quoted: fkontak })

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

      await conn.sendMessage(m.chat, {
        audio: { url: "https://qu.ax/GMQnD.m4a" },
        mimetype: "audio/mpeg",
        ptt: true
      })
    }

    //––––––––– DESPEDIDA ––––––––––
    if (chat.welcome && (
      m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
      m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    )) {

      const { pp, caption } = await generarDespedida({ conn, userId, groupMetadata, chat })

      const { imageMessage } = await generateWAMessageContent(
        { image: { url: pp } },
        { upload: conn.waUploadToServer }
      )

      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: { text: caption },
              footer: { text: dev },
              header: {
                title: "",
                hasMediaAttachment: true,
                imageMessage
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                      display_text: "⌒᷼✿ CANAL ⿻",
                      url: channel,
                      merchant_url: channel
                    })
                  }
                ]
              }
            })
          }
        }
      }, { quoted: fkontak })

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

      await conn.sendMessage(m.chat, {
        audio: { url: "https://qu.ax/GMQnD.m4a" },
        mimetype: "audio/mpeg",
        ptt: true
      })
    }

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, {
      text: `✘ Error: ${e.message}`,
      mentions: [m.sender]
    })
  }
}

export { generarBienvenida, generarDespedida }
export default handler