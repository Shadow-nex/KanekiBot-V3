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
    bio = info?.status?.trim() || "Sin bio..."
  } catch {
    bio = "Sin bio :cl..."
  }

  const thumbBuffer = await fetch('https://i.postimg.cc/rFfVL8Ps/image.jpg')
    .then(v => v.arrayBuffer())
    .then(v => Buffer.from(v))
    .catch(() => null)

  const fkontak = {
    key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: '🌾' },
    message: { locationMessage: { name: 'Kaneki MD', jpegThumbnail: thumbBuffer } },
    participant: '0@s.whatsapp.net'
  }

  if (user.registered) {
    const caption = `『🌳』Ya estás registrado.

*¿Quiere volver a registrarse?*

Use este comando para eliminar su registro.
› *${usedPrefix}unreg*`
    
    const productMessage = {
      product: {
        productImage: { url: 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766670717926_743070.jpeg' },
        productId: '8888888888888',
        title: '🌱 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐨 𝐄𝐱𝐢𝐬𝐭𝐞𝐧𝐭𝐞',
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

🌼 Escribe tu nombre, luego un punto, y tu edad xD.`
    
    const productMessage = {
      product: {
        productImage: { url: 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766670717926_743070.jpeg' },
        productId: '9999999999999',
        title: '🌾 𝐅𝐨𝐫𝐦𝐚𝐭𝐨 𝐈𝐧𝐜𝐨𝐫𝐫𝐞𝐜𝐭𝐨',
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
  if (age < 10) return m.reply("🍼 Muy pequeñ@ para registrarte.")

  user.name = `${name} ✓`
  user.age = age
  user.regTime = +new Date()
  user.registered = true

  const hora = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' })
  const fechaObj = new Date()
  const fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' })
  const dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: 'America/Lima' })
  const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  const info = `> .  ֺ    ﾺ  ۪  ﹙🌾 ֺ    𔓗 _*/Registro Completado../*_  ̷̸̸̷ׁ່֢݁ᮢ

性ᅠࣲ🌱᷐ᷣ   🄸⃓꯭ื🄽⃓꯭ื🄵⃓꯭ื🄾⃓꯭ื    ᗤᗤ

 ݁  🫧՞ *Nombre* › ${name}
 ݁  🫛՞ *Edad* › ${age} años
 ݁  🍃՞ *Clave SN* › ${sn}
 ݁  🌸՞ ──────────────
 ݁  🪽՞ *Usuario* › ${name2}
 ݁  🐸՞ *Numero* › ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
 ݁  💥՞ *Bio* › ${bio}

> ャ 🎁 *Bienvenido(a) su registro a sido completado con éxito 7w7.*`

    await m.react?.('📩')
    await conn.sendMessage(m.chat, {
        text: info,
        contextInfo: {
            externalAdReply: {
                title: 'ㅤꨶ〆⁾  𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐨 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐨 𑁍┊',
                body: dev,
                thumbnailUrl: pp,
                sourceUrl: redes,
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });  
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler