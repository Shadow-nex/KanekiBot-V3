/*import fs from 'fs'
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

const caption = `ׅㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌱 𝐖𝐄𝐋𝐂𝐎𝐌𝐄! * ㅤ֢ㅤ⸱ㅤᯭִ
*✎ Bienvenido/a* ${username} *Disfruta tu estadía en el grupo uwu*

 ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* › \`\`\`${groupMetadata.subject}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏs* › \`\`\`${groupSize}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ʜᴏʀᴀ* › \`\`\`${hora}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* › \`\`\`${fecha}\`\`\`

> ● ${mensaje}
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

const caption = `ׅㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌱 𝐖𝐄𝐋𝐂𝐎𝐌𝐄! * ㅤ֢ㅤ⸱ㅤᯭִ

*✎ Adiós!* ${username} *Te esperamos pronto 7w7*

 ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* › \`\`\`${groupMetadata.subject}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏs* › \`\`\`${groupSize}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ʜᴏʀᴀ* › \`\`\`${hora}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* › \`\`\`${fecha}\`\`\`

> ● ${mensaje}`

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

---


import fs from 'fs'
import { WAMessageStubType } from '@whiskeysockets/baileys'
import Jimp from 'jimp' // ← agregado

async function generarDoc(iconUrl, caption) {
  const icon = await Jimp.read(iconUrl)
  icon.resize(120, 120)

  const image = new Jimp(900, 900, '#FFFFFF')
  image.composite(icon, 30, 30)

  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
  image.print(font, 30, 200, caption, 840)

  const temp = './doc_welcome_fake.jpg'
  await image.writeAsync(temp)
  return temp
}

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

const groupSize = groupMetadata.participants.length + 1
const desc = groupMetadata.desc?.toString() || 'Sin descripción'

const mensaje = (chat.sWelcome || 'Edita con el comando "setwelcome"')
.replace(/{usuario}/g, `${username}`)
.replace(/{grupo}/g, `*${groupMetadata.subject}*`)
.replace(/{desc}/g, `${desc}`)

const caption = `ׅㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌱 𝐖𝐄𝐋𝐂𝐎𝐌𝐄! * ㅤ֢ㅤ⸱ㅤᯭִ
*✎ Bienvenido/a* ${username} *Disfruta tu estadía en el grupo uwu*

 ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* › \`\`\`${groupMetadata.subject}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏs* › \`\`\`${groupSize}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ʜᴏʀᴀ* › \`\`\`${hora}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* › \`\`\`${fecha}\`\`\`

> ● ${mensaje}
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

const caption = `ׅㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌱 𝐖𝐄𝐋𝐂𝐎𝐌𝐄! * ㅤ֢ㅤ⸱ㅤᯭִ

*✎ Adiós!* ${username} *Te esperamos pronto 7w7*

 ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* › \`\`\`${groupMetadata.subject}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏs* › \`\`\`${groupSize}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ʜᴏʀᴀ* › \`\`\`${hora}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* › \`\`\`${fecha}\`\`\`

> ● ${mensaje}`

return { pp, caption, mentions: [userId] }
}

let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {

if (!m.messageStubType || !m.isGroup) return !0

const primaryBot = global.db.data.chats[m.chat].primaryBot
if (primaryBot && conn.user.jid !== primaryBot) throw !1

const chat = global.db.data.chats[m.chat]
const userId = m.messageStubParameters[0]

const iconMini = "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765413098347_567654.jpeg"

// WELCOME
if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {

const { pp, caption, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat })
rcanal.contextInfo.mentionedJid = mentions

const fakeDoc = await generarDoc(iconMini, caption)

await conn.sendMessage(m.chat, {
  document: fs.readFileSync(fakeDoc),
  mimetype: 'image/jpeg',
  fileName: 'welcome.jpg',
  caption,
  image: { url: pp }, // ← FOTO REAL DEL USUARIO
  jpegThumbnail: Buffer.from(await (await fetch(pp)).arrayBuffer()),
  ...rcanal
}, { quoted: null })

try { fs.unlinkSync(fakeDoc) } catch {}
}

// BYE
if (chat.welcome && (
m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {

const { pp, caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat })
rcanal.contextInfo.mentionedJid = mentions

const fakeDoc = await generarDoc(iconMini, caption)

await conn.sendMessage(m.chat, {
  document: fs.readFileSync(fakeDoc),
  mimetype: 'image/jpeg',
  fileName: 'goodbye.jpg',
  caption,
  image: { url: pp }, // ← FOTO DEL USER
  jpegThumbnail: Buffer.from(await (await fetch(pp)).arrayBuffer()),
  ...rcanal
}, { quoted: null })

try { fs.unlinkSync(fakeDoc) } catch {}
}}

export { generarBienvenida, generarDespedida }
export default handler*/

import fs from 'fs'
import fetch from 'node-fetch'
import { WAMessageStubType } from '@whiskeysockets/baileys'
import Jimp from 'jimp' // JIMP USADO PARA TODO

// GENERA DOCUMENTO FALSO JPG CON ICON PEQUEÑO + CAPTION
async function generarDoc(iconUrl, caption) {
  const icon = await Jimp.read(iconUrl)
  icon.resize(120, 120)

  const image = new Jimp(900, 900, '#FFFFFF')
  image.composite(icon, 30, 30)

  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
  image.print(font, 30, 200, caption, 840)

  const temp = './temp_doc.jpg'
  await image.writeAsync(temp)
  return temp
}

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {

const username = `@${userId.split('@')[0]}`
const pp = await conn.profilePictureUrl(userId, 'image')
  .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

const fecha = new Date().toLocaleDateString("es-ES", { 
  timeZone: "America/Lima",
  day: 'numeric', month: 'long', year: 'numeric'
})

const hora = new Date().toLocaleTimeString("es-ES", { 
  timeZone: "America/Lima",
  hour: 'numeric', minute: 'numeric', hour12: true 
})

const groupSize = groupMetadata.participants.length + 1
const desc = groupMetadata.desc?.toString() || 'Sin descripción'

const mensaje = (chat.sWelcome || 'Edita con el comando "setwelcome"')
.replace(/{usuario}/g, `${username}`)
.replace(/{grupo}/g, `*${groupMetadata.subject}*`)
.replace(/{desc}/g, `${desc}`)

const caption = `ׅㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌱 𝐖𝐄𝐋𝐂𝐎𝐌𝐄! * ㅤ֢ㅤ⸱ㅤᯭִ
*✎ Bienvenido/a* ${username} *Disfruta tu estadía en el grupo uwu*

 ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* › \`\`\`${groupMetadata.subject}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏs* › \`\`\`${groupSize}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ʜᴏʀᴀ* › \`\`\`${hora}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* › \`\`\`${fecha}\`\`\`

> ● ${mensaje}
`

return { pp, caption, mentions: [userId] }
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {

const username = `@${userId.split('@')[0]}`
const pp = await conn.profilePictureUrl(userId, 'image')
  .catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

const fecha = new Date().toLocaleDateString("es-ES", { 
  timeZone: "America/Lima",
  day: 'numeric', month: 'long', year: 'numeric'
})

const hora = new Date().toLocaleTimeString("es-ES", { 
  timeZone: "America/Lima",
  hour: 'numeric', minute: 'numeric', hour12: true 
})

const groupSize = groupMetadata.participants.length - 1
const desc = groupMetadata.desc?.toString() || 'Sin descripción'

const mensaje = (chat.sBye || 'Edita con el comando "setbye"')
.replace(/{usuario}/g, `${username}`)
.replace(/{grupo}/g, `${groupMetadata.subject}`)
.replace(/{desc}/g, `*${desc}*`)

const caption = `ׅㅤꨶ〆⁾ ㅤׄㅤ⸼ㅤׄ *͜🌱 𝐖𝐄𝐋𝐂𝐎𝐌𝐄! * ㅤ֢ㅤ⸱ㅤᯭִ

*✎ Adiós!* ${username} *Te esperamos pronto 7w7*

 ׅㅤ𓏸𓈒ㅤׄ *ɢʀᴜᴘᴏ* › \`\`\`${groupMetadata.subject}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ᴍɪᴇᴍʙʀᴏs* › \`\`\`${groupSize}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ʜᴏʀᴀ* › \`\`\`${hora}\`\`\`
 ׅㅤ𓏸𓈒ㅤׄ *ғᴇᴄʜᴀ* › \`\`\`${fecha}\`\`\`

> ● ${mensaje}`

return { pp, caption, mentions: [userId] }
}

let handler = m => m
handler.before = async function (m, { conn, groupMetadata }) {

if (!m.messageStubType || !m.isGroup) return !0

const primaryBot = global.db.data.chats[m.chat].primaryBot
if (primaryBot && conn.user.jid !== primaryBot) throw !1

const chat = global.db.data.chats[m.chat]
const userId = m.messageStubParameters[0]

const iconMini = "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765413098347_567654.jpeg"

// WELCOME
if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {

const { pp, caption, mentions } = await generarBienvenida({ conn, userId, groupMetadata, chat })
rcanal.contextInfo.mentionedJid = mentions

// documento falso JPG
const fakeDoc = await generarDoc(iconMini, caption)
const docBuffer = fs.readFileSync(fakeDoc)

// imagen del usuario como thumbnail
const thumbUser = await (await fetch(pp)).buffer()

await conn.sendMessage(m.chat, {
  document: docBuffer,
  mimetype: 'image/jpeg',
  fileName: 'welcome.jpg',
  caption,
  jpegThumbnail: thumbUser,
  contextInfo: rcanal.contextInfo
}, { quoted: null })

try { fs.unlinkSync(fakeDoc) } catch {}
}

// DESPEDIDA
if (chat.welcome && (
  m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
  m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE
)) {

const { pp, caption, mentions } = await generarDespedida({ conn, userId, groupMetadata, chat })
rcanal.contextInfo.mentionedJid = mentions

const fakeDoc = await generarDoc(iconMini, caption)
const docBuffer = fs.readFileSync(fakeDoc)
const thumbUser = await (await fetch(pp)).buffer()

await conn.sendMessage(m.chat, {
  document: docBuffer,
  mimetype: 'image/jpeg',
  fileName: 'goodbye.jpg',
  caption,
  jpegThumbnail: thumbUser,
  contextInfo: rcanal.contextInfo
}, { quoted: null })

try { fs.unlinkSync(fakeDoc) } catch {}
}}

export { generarBienvenida, generarDespedida }
export default handler