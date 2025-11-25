import fs from 'fs'
import fetch from 'node-fetch'
import { WAMessageStubType } from '@whiskeysockets/baileys'

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

    "1": "🇺🇸 EE.UU / 🇨🇦 Canadá",
    "7": "🇷🇺 Rusia / 🇰🇿 Kazajistán",

    "20": "🇪🇬 Egipto", "27": "🇿🇦 Sudáfrica",
    "30": "🇬🇷 Grecia", "31": "🇳🇱 Países Bajos", "32": "🇧🇪 Bélgica",
    "33": "🇫🇷 Francia", "34": "🇪🇸 España", "36": "🇭🇺 Hungría",
    "39": "🇮🇹 Italia", "40": "🇷🇴 Rumania", "44": "🇬🇧 Reino Unido",
    "49": "🇩🇪 Alemania",

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
  return "Desconocido"
}

const generarBienvenida = async ({ conn, userId, groupMetadata, chat }) => {

  const username = `@${userId.split('@')[0]}`
  const numero = userId.split('@')[0]
  const nacionalidad = detectarPais(numero)

  const pp = await conn.profilePictureUrl(userId, 'image').catch(() =>
    'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg'
  )

  const fecha = new Date()
  const fechaTexto = fecha.toLocaleDateString("es-ES", { timeZone: "America/Lima" })
  const hora = fecha.toLocaleTimeString("es-PE", { timeZone: "America/Lima", hour: "numeric", minute: "numeric" })

  const desc = groupMetadata.desc?.toString() || '*Sin descripción*'
  const finalMsg = (chat.sWelcome || 'Edita con *setwelcome*')
    .replace(/{usuario}/g, username)
    .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
    .replace(/{desc}/g, desc)

  const caption = `
🌸✨ ¡Bienvenid@ ${username}! ✨🌸

🍃 Es un gusto tenerte con nosotros 💚  
🏡 Siéntete como en casa UwU  

🌿 *Información del Grupo*  
• *Miembros:* ${groupMetadata.participants.length + 1}  
• *País:* ${nacionalidad}  
• *Hora:* ${hora}  
• *Fecha:* ${fechaTexto}  

📝 *Descripción:*  
${finalMsg}
`

  const imgWelcome = `https://api.siputzx.my.id/api/canvas/welcomev5?username=${
    encodeURIComponent(numero)
  }&guildName=${
    encodeURIComponent(groupMetadata.subject)
  }&memberCount=${
    groupMetadata.participants.length + 1
  }&avatar=${
    encodeURIComponent(pp)
  }&background=${
    encodeURIComponent("https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763585864348_780365.jpeg")
  }&quality=90`

  return { pp: imgWelcome, caption, username }
}

const generarDespedida = async ({ conn, userId, groupMetadata, chat }) => {

  const username = `@${userId.split('@')[0]}`
  const numero = userId.split('@')[0]
  const nacionalidad = detectarPais(numero)

  const pp = await conn.profilePictureUrl(userId, 'image').catch(() =>
    'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg'
  )

  const fecha = new Date()
  const fechaTexto = fecha.toLocaleDateString("es-ES", { timeZone: "America/Lima" })
  const hora = fecha.toLocaleTimeString("es-PE", { timeZone: "America/Lima", hour: "numeric", minute: "numeric" })

  const desc = groupMetadata.desc?.toString() || '*Sin descripción*'
  const finalMsg = (chat.sBye || 'Edita con *setbye*')
    .replace(/{usuario}/g, username)
    .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
    .replace(/{desc}/g, desc)

  const caption = `
🌸💫 El viento cambia caminos...  
${username} ha salido del grupo *${groupMetadata.subject}* 💐

💭 ${finalMsg}

📉 *Estado Actual:*  
• *Miembros:* ${groupMetadata.participants.length - 1}  
• *País:* ${nacionalidad}  
• *Hora:* ${hora}  
• *Fecha:* ${fechaTexto}
`

  const imgGoodbye = `https://api.siputzx.my.id/api/canvas/goodbyev5?username=${
    encodeURIComponent(numero)
  }&guildName=${
    encodeURIComponent(groupMetadata.subject)
  }&memberCount=${
    groupMetadata.participants.length - 1
  }&avatar=${
    encodeURIComponent(pp)
  }&background=${
    encodeURIComponent("https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763585864348_780365.jpeg")
  }&quality=90`

  return { pp: imgGoodbye, caption, username }
}

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {

  if (!m.messageStubType || !m.isGroup) return !0
  const chat = global.db.data.chats[m.chat]
  const userId = m.messageStubParameters[0]

  let thumb = await fetch('https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763586769709_495967.jpeg')
    .then(res => res.arrayBuffer()).catch(() => null)

  const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', id: 'Halo' },
    message: { locationMessage: { name: '🌲✨  𝐊𝐀𝐍𝐄𝐊𝐈 - 𝐈𝐀  ✨🌲', jpegThumbnail: Buffer.from(thumb || []) } }
  }

  if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {

    const { pp, caption } = await generarBienvenida({ conn, userId, groupMetadata, chat })

    const productMessage = {
      product: {
        productImage: { url: pp },
        productId: '99999123456',
        title: " ˗ˏˋ♡ˎˊ˗ ❏ ¡𝐖 𝐄 𝐋 𝐂 𝐎 𝐌 𝐄! ᯤ ˗ˏˋ♡ˎˊ˗",
        description: "",
        currencyCode: "USD",
        priceAmount1000: "100000",
        retailerId: 1677,
        url: "https://github.com/shadox-xyz",
        productImageCount: 1
      },
      businessOwnerJid: userId,
      footer: caption,
      mentions: [userId]
    }

    await conn.sendMessage(m.chat, productMessage, { quoted: fkontak })
  }

  if (chat.welcome && (
    m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  )) {

    const { pp, caption } = await generarDespedida({ conn, userId, groupMetadata, chat })

    const productMessage = {
      product: {
        productImage: { url: pp },
        productId: '99999123456',
        title: " ˗ˏˋ♡ˎˊ˗ ❏ ¡𝐖 𝐄 𝐋 𝐂 𝐎 𝐌 𝐄! ᯤ ˗ˏˋ♡ˎˊ˗",
        description: "",
        currencyCode: "USD",
        priceAmount1000: "100000",
        retailerId: 1677,
        url: "https://github.com/shadox-xyz",
        productImageCount: 1
      },
      businessOwnerJid: userId,
      footer: caption,
      mentions: [userId]
    }

    await conn.sendMessage(m.chat, productMessage, { quoted: fkontak })
  }
}

export { generarBienvenida, generarDespedida }
export default handler