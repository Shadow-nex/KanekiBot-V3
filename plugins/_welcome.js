/*import fs from 'fs'
import fetch from 'node-fetch'
import { WAMessageStubType } from '@whiskeysockets/baileys'

let thumb = await fetch('https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763586769709_495967.jpeg')
  .then(res => res.arrayBuffer()).catch(() => null)

const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast',
    id: 'Halo'
  },
  message: {
    locationMessage: {
      name: botname,
      jpegThumbnail: Buffer.from(thumb || [])
    }
  }
}

function fechaPeru() {
  return new Date().toLocaleDateString("es-PE", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: "America/Lima"
  })
}

async function generarImagen({ title, desc, avatar, background }) {
  try {
    const url = `https://canvas-8zhi.onrender.com/api/welcome3?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(desc)}&profile=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}`
    const res = await fetch(url)
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
  return generarMensaje({ conn, userId, groupMetadata, chat, tipo: 'welcome' })
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
  return generarMensaje({ conn, userId, groupMetadata, chat, tipo: 'bye' })
}

async function generarMensaje({ conn, userId, groupMetadata, chat, tipo }) {
  const username = `@${userId.split('@')[0]}`
  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  const groupSize = tipo === 'welcome'
    ? groupMetadata.participants.length + 1
    : groupMetadata.participants.length - 1

  const descGrupo = groupMetadata.desc || 'Sin descripción'
  const fecha = fechaPeru()

  const texto = (tipo === 'welcome' ? chat.sWelcome : chat.sBye || '')
    .replace(/{usuario}/g, username)
    .replace(/{grupo}/g, groupMetadata.subject)
    .replace(/{desc}/g, descGrupo)

  const caption = 
`ׅㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌱* ㅤ֢ㅤ⸱ㅤᯭִ
*${tipo === 'welcome' ? `¡𝐁𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐨/𝐚! ${username} ᴅɪsғʀᴜᴛᴀ ᴛᴜ ᴇsᴛᴀᴅɪᴀ ᴇɴ ᴇʟ ɢʀᴜᴘᴏ` : `¡𝐀𝐝𝐢𝐨𝐬! ${username} ᴛᴇ ᴇsᴘᴇʀᴀᴍᴏs ᴘʀᴏɴᴛᴏ`}*

 ׅㅤ𓏸𓈒ㅤׄ *Grupo ›* ${groupMetadata.subject}
 ׅㅤ𓏸𓈒ㅤׄ *Miembros ›* ${groupSize}
 ׅㅤ𓏸𓈒ㅤׄ *Fecha ›* ${fecha}

> • .˚ *${texto || 'Ekizde'}*`

  const image = await generarImagen({
    title: tipo === 'welcome' ? '🌹 Bienvenido/a al grupo' : '🌳 Hasta pronto',
    desc: tipo === 'welcome' ? '¡Disfruta tu estadía!' : '¡Te esperamos de nuevo!',
    avatar: pp,
    background: tipo === 'welcome'
      ? 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765379008015_718175.jpeg'
      : 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765379008015_718175.jpeg'
  })

  return { image, caption }
}

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  try {
    if (!m.isGroup || !m.messageStubType) return true

    const chat = global.db.data.chats[m.chat]
    const userId = m.messageStubParameters?.[0]
    if (!userId) return true

    if (!chat?.welcome) return true
    
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const { image, caption } = await generarBienvenida({
        conn, userId, groupMetadata, chat
      })
      
     const JT = {
      contextInfo: {
      mentionedJid: [userId],
        externalAdReply: {
          title: 'Welcome!',
          body: dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: redes,
          sourceUrl: 'https://chat.whatsapp.com/FvKyGFv5i1s8Dj2XAQ74WT?mode=hqrt1',
          thumbnail: image || Buffer.from([]),
          renderLargerThumbnail: true,
        },
      },
    }
    await conn.reply(m.chat, caption, fkontak, JT)
    }

    if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    ) {
      const { image, caption } = await generarDespedida({
        conn, userId, groupMetadata, chat
      })

      const JT = {
      contextInfo: {
      mentionedJid: [userId],
        externalAdReply: {
          title: '🌿 Welcome!',
          body: dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: redes,
          sourceUrl: 'https://chat.whatsapp.com/FvKyGFv5i1s8Dj2XAQ74WT?mode=hqrt1',
          thumbnail: image || Buffer.from([]),
          renderLargerThumbnail: true,
        },
      },
    }
    await conn.reply(m.chat, caption, fkontak, JT)
    }

  } catch (err) {
    console.error(err)
  }
}

export { generarBienvenida, generarDespedida }
export default handler*/

import fs from 'fs'
import { WAMessageStubType } from '@whiskeysockets/baileys'

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
const username = `@${userId.split('@')[0]}`
const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

const fecha = new Date().toLocaleDateString("es-ES", { 
  timeZone: "America/Lima",
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const hora = new Date().toLocaleTimeString("es-ES", { 
  timeZone: "America/Lima",
  hour: 'numeric',
  minute: 'numeric',
  hour12: true 
})

let thumb = await fetch('https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763586769709_495967.jpeg')
  .then(res => res.arrayBuffer()).catch(() => null)

const groupSize = groupMetadata.participants.length + 1
const desc = groupMetadata.desc?.toString() || 'Sin descripción'

const mensaje = (chat.sWelcome || 'Edita con el comando "setwelcome"')
.replace(/{usuario}/g, `${username}`)
.replace(/{grupo}/g, `*${groupMetadata.subject}*`)
.replace(/{desc}/g, `${desc}`)

const caption = `❀ Bienvenido a *"_${groupMetadata.subject}_"*
✰ _Usuario_ » ${username}
● ${mensaje}
◆ _Ahora somos ${groupSize} Miembros._
ꕥ Fecha » ${fecha}
ꕥ Hora » ${hora}
`

return { pp, caption, mentions: [userId] }
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
const username = `@${userId.split('@')[0]}`
const pp = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

const fecha = new Date().toLocaleDateString("es-ES", { 
  timeZone: "America/Lima",
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const hora = new Date().toLocaleTimeString("es-ES", { 
  timeZone: "America/Lima",
  hour: 'numeric',
  minute: 'numeric',
  hour12: true 
})

const groupSize = groupMetadata.participants.length - 1
const desc = groupMetadata.desc?.toString() || 'Sin descripción'

const mensaje = (chat.sBye || 'Edita con el comando "setbye"')
.replace(/{usuario}/g, `${username}`)
.replace(/{grupo}/g, `${groupMetadata.subject}`)
.replace(/{desc}/g, `*${desc}*`)

const caption = `❀ Adiós de *"_${groupMetadata.subject}_"*
✰ _Usuario_ » ${username}
● ${mensaje}
◆ _Ahora somos ${groupSize} Miembros._
ꕥ Fecha » ${fecha}
ꕥ Hora » ${hora}
`

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
try { fs.unlinkSync(img) } catch {}
}

if (chat.welcome && (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
const { pp, caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat })
rcanal.contextInfo.mentionedJid = mentions
await conn.sendMessage(m.chat, { image: { url: pp }, caption, ...rcanal }, { quoted: null })
try { fs.unlinkSync(img) } catch {}
}}

export { generarBienvenida, generarDespedida }
export default handler