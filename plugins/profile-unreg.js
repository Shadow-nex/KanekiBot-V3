import fs from 'fs'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import baileys from '@whiskeysockets/baileys'
const { proto } = baileys

let handler = async (m, { conn, usedPrefix }) => {
  const user = global.db.data.users[m.sender]
  const nombre = user.name || 'Sin nombre'
  const edad = user.age || 'Desconocida'

  if (!user.registered)
    return m.reply(`❌ 𝗡𝗼 𝘁𝗶𝗲𝗻𝗲𝘀 𝗿𝗲𝗴𝗶𝘀𝘁𝗿𝗼 𝗮𝗰𝘁𝗶𝘃𝗼.\n\n𝗣𝘂𝗲𝗱𝗲𝘀 𝗿𝗲𝗴𝗶𝘀𝘁𝗿𝗮𝗿𝘁𝗲 𝗰𝗼𝗻:\n*${usedPrefix}verificar nombre.edad*`)

  let pp
  try {
    pp = await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    pp = 'https://i.postimg.cc/rFfVL8Ps/image.jpg'
  }

  user.registered = false
  await m.react('🎄')

  const caption = `╭─━━━━━━━━━━━━━━━━━─⊷
🎄 *𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗢 𝗘𝗟𝗜𝗠𝗜𝗡𝗔𝗗𝗢* 🎄
╰─━━━━━━━━━━━━━━━━━─⊷

🌿 *Nombre:* ${nombre}
🍃 *Edad:* ${edad} años
🕸️ *Estado:* Eliminado correctamente

✨ Puedes volver a registrarte cuando desees:
> *${usedPrefix}reg ${nombre}.18*

🌟 *Kaneki Bot* siempre estará contigo.`

  const msg = {
    productMessage: {
      product: {
        productImage: {
          mimetype: 'image/jpeg',
          jpegThumbnail: await (await fetch(pp)).buffer()
        },
        productId: '7777777777',
        title: '🎄 Registro Eliminado Correctamente 🎄',
        description: `🌿 Nombre: ${nombre} | 🍃 Edad: ${edad} años`,
        currencyCode: 'USD',
        priceAmount1000: '100000',
        retailerId: '666',
        url: 'https://wa.me/0'
      },
      businessOwnerJid: m.sender
    }
  }

  await conn.sendMessage(m.chat, msg, { quoted: m })
  await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
}

handler.help = ['unreg']
handler.tags = ['rg']
handler.command = ['unreg']

export default handler