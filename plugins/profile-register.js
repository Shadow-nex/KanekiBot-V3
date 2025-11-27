import db from '../lib/database.js'
import fs from 'fs'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'
import baileys from '@whiskeysockets/baileys'

const { proto } = baileys
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  const who = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.fromMe
    ? conn.user.jid
    : m.sender

  const user = global.db.data.users[m.sender]
  const name2 = await conn.getName(m.sender)
  const pp = await conn.profilePictureUrl(who, 'image').catch(() => banner)

  let bio
  try {
    const info = await conn.fetchStatus(who)
    bio = info?.status?.trim() || "Sin descripción personal..."
  } catch {
    bio = "Sin descripción personal..."
  }

  const thumbBuffer = await fetch('https://i.postimg.cc/rFfVL8Ps/image.jpg')
    .then(v => v.arrayBuffer())
    .then(v => Buffer.from(v))
    .catch(() => null)

  const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: '🧣' },
    message: { locationMessage: { name: '🎄 Registro Kaneki', jpegThumbnail: thumbBuffer } },
    participant: '0@s.whatsapp.net'
  }

  if (user.registered) {
    const caption = `🌿✨ *Ya estás registrado* ✨🌿

No necesitas volver a hacerlo 🎁

Si deseas borrar tu registro:
> *${usedPrefix}unreg*

Que la buena energía continúe contigo 🦋🍃`
    
    const productMessage = {
      product: {
        productImage: { url: 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1764274472720_304571.jpeg' },
        productId: '8888888888888',
        title: '🎄 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐨 𝐄𝐱𝐢𝐬𝐭𝐞𝐧𝐭𝐞 🍇',
        description: global.textbot,
        currencyCode: 'USD',
        priceAmount1000: '100000',
        retailerId: 2001,
        url: `https://wa.me/${who.split('@')[0]}`,
        productImageCount: 1
      },
      businessOwnerJid: who,
      footer: caption,
      mentions: [m.sender]
    }
    return await conn.sendMessage(m.chat, productMessage, { quoted: fkontak })
  }

  if (!Reg.test(text)) {
    const caption = `🍄 *Uso correcto del registro* 🍄

🌱 *${usedPrefix + command} nombre.edad*

Ejemplo:
> *${usedPrefix + command} ${name2}.18*

🌼 Escribe tu nombre, luego un punto, y tu edad.`
    
    const productMessage = {
      product: {
        productImage: { url: 'https://files.catbox.moe/59ddu4.jpg' },
        productId: '9999999999999',
        title: '⛄ 𝐅𝐨𝐫𝐦𝐚𝐭𝐨 𝐈𝐧𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐨 🌠',
        description: global.textbot,
        currencyCode: 'USD',
        priceAmount1000: '100000',
        retailerId: 2002,
        productImageCount: 1
      },
      businessOwnerJid: who,
      footer: caption,
      mentions: [m.sender]
    }
    return await conn.sendMessage(m.chat, productMessage, { quoted: fkontak })
  }
  
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) return m.reply("🌿 El nombre no puede estar vacío.")
  if (!age) return m.reply("🍃 La edad es necesaria.")
  if (name.length >= 100) return m.reply("🦋 El nombre es demasiado largo.")
  age = parseInt(age)
  if (age > 100) return m.reply("🎅 Ajá papá Noel inmortal? 😭")
  if (age < 15) return m.reply("🍼 Muy pequeñ@ para registrarte.")

  user.name = `${name} ✓`
  user.age = age
  user.regTime = +new Date()
  user.registered = true

  const hora = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' })
  const fechaObj = new Date()
  const fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' })
  const dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: 'America/Lima' })
  const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  const texto1 = `
 ╔═•═•|•═•═••═•
 ャ 🍃🎄 *REGISTRO COMPLETADO* 🎄🍃
 ╚═•═•|•═•═••═•═•═•═•═•═•═•|

▭ ▬▬▬▬▬▟ 🎅 ▙▬▬▬▬▬ ▭
 ◉ 🪷 ᴜsᴇʀ: ${name2}
 ◉ 🧃 ɴᴜᴍᴇʀᴏ: ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
 ◉   ────────────────
 ◉ 🪹 𝐍𝐨𝐦𝐛𝐫𝐞 ➪ \`\`\`${name}\`\`\`
 ◉ 🪵 𝐄𝐝𝐚𝐝 ➪ \`\`\`${age} años\`\`\`
 ◉ 🪀 𝐁𝐢𝐨 ➪ \`\`\`${bio}\`\`\`
 ◉ 🪾 𝐍𝐒 ➪ \`\`\`${sn}\`\`\`
 ◉ 🍄 𝐅𝐞𝐜𝐡𝐚 ➪ \`\`\`${hora}, ${dia}, ${fecha}
◥▬▭▭▭▭▭◺✿◿◰▭▭▭▭▭▬◤


> ャ 🎁 *Bienvenido(a) tu registro a sido completo con éxito 💫*
`

  await m.react?.('🍃')

  const productMessage = {
    product: {
      productImage: { url: pp },
      productId: '51919199620',
      title: `🌿 Registro Completado 🎄`,
      description: global.textbot,
      currencyCode: 'USD',
      priceAmount1000: '100000',
      retailerId: 2025,
      productImageCount: 1,
    },
    footer: `${texto1}`,
    headerType: 1,
    viewOnce: true,
    businessOwnerJid: m.sender,
  }

  await conn.sendMessage(m.chat, productMessage, { quoted: fkontak })
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler