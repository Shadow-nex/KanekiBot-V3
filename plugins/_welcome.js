import fs from 'fs'
import { WAMessageStubType } from '@whiskeysockets/baileys'

/* Detectar país */
function detectarPais(numero) {
  const codigos = {
    "1": "🇺🇸 EE.UU / 🇨🇦 Canadá", "7": "🇷🇺 Rusia / 🇰🇿 Kazajistán",
    "20": "🇪🇬 Egipto", "27": "🇿🇦 Sudáfrica", "30": "🇬🇷 Grecia",
    "31": "🇳🇱 Países Bajos", "32": "🇧🇪 Bélgica", "33": "🇫🇷 Francia",
    "34": "🇪🇸 España", "36": "🇭🇺 Hungría", "39": "🇮🇹 Italia",
    "40": "🇷🇴 Rumania", "44": "🇬🇧 Reino Unido", "49": "🇩🇪 Alemania",
    "51": "🇵🇪 Perú", "52": "🇲🇽 México", "53": "🇨🇺 Cuba",
    "54": "🇦🇷 Argentina", "55": "🇧🇷 Brasil", "56": "🇨🇱 Chile",
    "57": "🇨🇴 Colombia", "58": "🇻🇪 Venezuela", "591": "🇧🇴 Bolivia",
    "593": "🇪🇨 Ecuador", "595": "🇵🇾 Paraguay", "598": "🇺🇾 Uruguay",
    "502": "🇬🇹 Guatemala", "503": "🇸🇻 El Salvador",
    "504": "🇭🇳 Honduras", "505": "🇳🇮 Nicaragua",
    "506": "🇨🇷 Costa Rica", "507": "🇵🇦 Panamá",
    "60": "🇲🇾 Malasia", "61": "🇦🇺 Australia", "62": "🇮🇩 Indonesia",
    "63": "🇵🇭 Filipinas", "64": "🇳🇿 Nueva Zelanda",
    "65": "🇸🇬 Singapur", "66": "🇹🇭 Tailandia",
    "81": "🇯🇵 Japón", "82": "🇰🇷 Corea del Sur", "84": "🇻🇳 Vietnam",
    "86": "🇨🇳 China", "90": "🇹🇷 Turquía", "91": "🇮🇳 India",
    "212": "🇲🇦 Marruecos", "213": "🇩🇿 Argelia",
    "216": "🇹🇳 Túnez", "218": "🇱🇾 Libia",
    "234": "🇳🇬 Nigeria", "254": "🇰🇪 Kenia",
    "255": "🇹🇿 Tanzania", "256": "🇺🇬 Uganda",
    "258": "🇲🇿 Mozambique", "260": "🇿🇲 Zambia",
    "263": "🇿🇼 Zimbabue"
  }
  for (const code in codigos) {
    if (numero.startsWith(code)) return codigos[code]
  }
  return "🌎 Desconocido"
}

/* Fecha y hora Perú */
function fechaHoraPeru() {
  const fecha = new Date().toLocaleDateString("es-PE", {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: "America/Lima"
  })
  const hora = new Date().toLocaleTimeString("es-PE", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZone: "America/Lima"
  })
  return { fecha, hora }
}

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`
  const numero = userId.split("@")[0]
  const pais = detectarPais(numero)

  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  const { fecha, hora } = fechaHoraPeru()

  const groupSize = groupMetadata.participants.length + 1
  const desc = groupMetadata.desc?.toString() || 'Sin descripción'

  const mensaje = (chat.sWelcome || 'Edita con el comando "setwelcome"')
    .replace(/{usuario}/g, `${username}`)
    .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
    .replace(/{desc}/g, `${desc}`)

  const caption = 
`❀ Bienvenido a *"_${groupMetadata.subject}_"*
✰ Usuario » ${username}
✰ País » ${pais}

● ${mensaje}
◆ Ahora somos ${groupSize} miembros
ꕥ Fecha » ${fecha}
ꕥ Hora 🇵🇪 » ${hora}

૮꒰ ˶• ᴗ •˶꒱ა ¡Disfruta tu estadía!
> Usa *#help* para ver la lista de comandos.`

  return { pp, caption, mentions: [userId] }
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
  const username = `@${userId.split('@')[0]}`
  const numero = userId.split("@")[0]
  const pais = detectarPais(numero)

  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  const { fecha, hora } = fechaHoraPeru()

  const groupSize = groupMetadata.participants.length - 1
  const desc = groupMetadata.desc?.toString() || 'Sin descripción'

  const mensaje = (chat.sBye || 'Edita con el comando "setbye"')
    .replace(/{usuario}/g, `${username}`)
    .replace(/{grupo}/g, `${groupMetadata.subject}`)
    .replace(/{desc}/g, `*${desc}*`)

  const caption =
`❀ Adiós de *"_${groupMetadata.subject}_"*
✰ Usuario » ${username}
✰ País » ${pais}

● ${mensaje}
◆ Ahora somos ${groupSize} miembros
ꕥ Fecha » ${fecha}
ꕥ Hora 🇵🇪 » ${hora}

(˶˃⤙˂˶) ¡Te esperamos pronto!
> Usa *#help* para ver la lista de comandos.`

  return { pp, caption, mentions: [userId] }
}

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  const primaryBot = global.db.data.chats[m.chat].primaryBot
  if (primaryBot && conn.user.jid !== primaryBot) throw !1

  const chat = global.db.data.chats[m.chat]
  const userId = m.messageStubParameters[0]

  if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const { pp, caption, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat })
    rcanal.contextInfo.mentionedJid = mentions
    await conn.sendMessage(m.chat, { image: { url: pp }, caption, ...rcanal }, { quoted: null })
  }

  if (chat.welcome && 
    (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || 
     m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {

    const { pp, caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat })
    rcanal.contextInfo.mentionedJid = mentions
    await conn.sendMessage(m.chat, { image: { url: pp }, caption, ...rcanal }, { quoted: null })
  }
}

export { generarBienvenida, generarDespedida }
export default handler