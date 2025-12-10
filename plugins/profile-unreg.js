import fs from 'fs'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn, usedPrefix }) => {
  let user = global.db.data.users[m.sender]
  let nombre = user.name || 'Sin nombre'
  let edad = user.age || 'Desconocida'
  let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender

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

  await conn.sendMessage(m.chat, {
    caption: caption,
    contextInfo: {
      mentionedJid: [mentionedJid],
      externalAdReply: { 
        title: `𓈒𓏸 𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐎 𝐄𝐋𝐈𝐌𝐈𝐍𝐀𝐃𝐎 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀𝐌𝐄𝐍𝐓𝐄 ⿻`,
        body: dev,
        thumbnailUrl: pp,
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['unreg']
handler.tags = ['rg']
handler.command = ['unreg']

export default handler