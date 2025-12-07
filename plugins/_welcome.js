import fs from 'fs'
import fetch from 'node-fetch'
import { WAMessageStubType } from '@whiskeysockets/baileys'

let thumb = await fetch('https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763586769709_495967.jpeg')
  .then(res => res.arrayBuffer()).catch(() => null)

const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', id: 'Halo' },
  message: {
    locationMessage: {
      name: '❥ᰰຼ⚡ 𝐊𝐀𝐍𝐄𝐊𝐈 - 𝐀𝐈  🌿',
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

// ⚡ Generador rápido de imagen
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

// ✅ EXPORTABLES
async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
  return generarMensaje({
    conn,
    userId,
    groupMetadata,
    chat,
    tipo: 'welcome'
  })
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
  return generarMensaje({
    conn,
    userId,
    groupMetadata,
    chat,
    tipo: 'bye'
  })
}

// ⚡ Base optimizada
async function generarMensaje({ conn, userId, groupMetadata, chat, tipo }) {

  // ✅ NOMBRE REAL DEL USUARIO (FIX)
  let nombreReal = await conn.getName(userId).catch(() => null)

  const username = nombreReal
    ? `@${nombreReal.replace(/[\n\r]/g, '').trim()}`
    : `@${userId.split('@')[0]}`

  const pp = await conn.profilePictureUrl(userId, 'image')
    .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  const groupSize =
    tipo === 'welcome'
      ? groupMetadata.participants.length + 1
      : groupMetadata.participants.length - 1

  const descGrupo = groupMetadata.desc || 'Sin descripción'
  const fecha = fechaPeru()

  const texto =
    (tipo === 'welcome' ? chat.sWelcome : chat.sBye || '')
      .replace(/{usuario}/g, username)
      .replace(/{grupo}/g, groupMetadata.subject)
      .replace(/{desc}/g, descGrupo)

  const caption =
`*꒰ ✿ ${tipo === 'welcome' ? '¡Bienvenido/a!' : '¡Hasta pronto!'} ${username} ✿ ꒱*

 ⋅˚₊‧🪽‧₊˚ ⋅ *Grupo:* ${groupMetadata.subject}
 ⋅˚₊‧🌱‧₊˚ ⋅ *Miembros:* ${groupSize}
 ⋅˚₊‧🍁‧₊˚ ⋅ *Fecha:* ${fecha}

> • .˚🌊 *${texto || '✨ Disfruta tu estancia en el grupo'}*`

  const image = await generarImagen({
    title: tipo === 'welcome' ? '🌹 Bienvenido/a al grupo' : '🌳 Hasta pronto',
    desc: tipo === 'welcome' ? '¡Disfruta tu estadía!' : '¡Te esperamos de nuevo!',
    avatar: pp,
    background:
      tipo === 'welcome'
        ? 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1764381430380_705529.jpeg'
        : 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1764382807653_64665.jpeg'
  })

  return { image, caption, pp, username }
}

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  try {
    if (!m.isGroup || !m.messageStubType) return true

    const chat = global.db.data.chats[m.chat]
    const userId = m.messageStubParameters[0]

    if (!chat?.welcome) return true

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const { image, caption, pp } = await generarBienvenida({
        conn,
        userId,
        groupMetadata,
        chat
      })

      await conn.sendMessage(m.chat, {
        image,
        caption,
        mentions: [userId],
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: '❂ Welcome ♡',
            mediaType: 1,
            mediaUrl: redes,
            sourceUrl: redes,
            thumbnail: await (await fetch(pp)).buffer(),
            renderLargerThumbnail: false
          }
        }
      }, { quoted: fkontak })
    }

    if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    ) {
      const { image, caption, pp } = await generarDespedida({
        conn,
        userId,
        groupMetadata,
        chat
      })

      await conn.sendMessage(m.chat, {
        image,
        caption,
        mentions: [userId],
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: '❂ Bye ♡',
            mediaType: 1,
            mediaUrl: redes,
            sourceUrl: redes,
            thumbnail: await (await fetch(pp)).buffer(),
            renderLargerThumbnail: false
          }
        }
      }, { quoted: fkontak })
    }

  } catch (err) {
    console.error(err)
  }
}

export { generarBienvenida, generarDespedida }
export default handler