import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix, __dirname, participants }) => {
  try {

    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[m.sender] || {}
    let name = await conn.getName(m.sender)
    //let premium = user.premium ? '✔️ Sí' : 'free'
    let totalreg = Object.keys(global.db.data.users).length
    let groupUserCount = m.isGroup ? participants.length : '-'
    let groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length
    let uptime = clockString(process.uptime() * 1000)
    let fecha = new Date(Date.now())
    let locale = 'es-PE'
    let dia = fecha.toLocaleDateString(locale, { weekday: 'long' })
    let fechaTxt = fecha.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let hora = fecha.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })

    let totalCommands = Object.keys(global.plugins).length
    let readMore = String.fromCharCode(8206).repeat(4001)

    let userIdNum = m.sender.split('@')[0]
    let phone = PhoneNumber('+' + userIdNum)
    let pais = phone.getRegionCode() || 'Desconocido 🌐'
 
    let tags = {
      'info': 'ɪ́ɴғᴏ',
      'main': 'šᴛᴀᴛᴜs',
      'anime': 'ᴀ̊ɴɪᴍᴇ',
      'menu': 'ᴍᴇɴᴜš',
      'search': 'ʙᴜšǫᴜᴇᴅᴀš',
      'download': 'Đᴇsᴄᴀʀɢᴀš',
      'socket': 'šᴏᴄᴋᴇᴛs',
      'rg': 'ᴘᴇʀғɪʟ',
      'fun': 'ғᴜɴ',
      'rpg': 'ᴇᴄᴏɴᴏᴍɪ́ᴀ',
      'gacha': 'ɢᴀᴄʜᴀ',
      'game': 'ɢᴀᴍᴇ',
      'group': 'ɢʀᴜᴘᴏ',
      'nable': 'ᴏɴ/ᴏғғ',
      'ia': 'ɪɴᴛᴇʟɪɢᴇɴᴄɪᴀ',
      'stalk': 'sᴛᴀʟᴋ',
      'maker': 'ʟᴏɢᴏᴛɪᴘᴏs',
      'tools': 'ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs',
      'sticker': 'sᴛɪᴄᴋᴇʀs',
      'owner': 'ᴅᴇᴠᴇʟᴏᴘᴇʀ',
      'nsfw': 'ɴsғᴡ (+18)',
    }

    let commands = Object.values(global.plugins)
      .filter(v => v.help && v.tags)
      .map(v => {
        return {
          help: Array.isArray(v.help) ? v.help : [v.help],
          tags: Array.isArray(v.tags) ? v.tags : [v.tags]
        }
      })

    let menuTexto = ''
    for (let tag in tags) {
      let comandos = commands
        .filter(cmd => cmd.tags.includes(tag))
        .map(cmd => cmd.help.map(e => `*│ׄꤥㅤׅ*  ${usedPrefix}${e}`).join('\n'))
        .join('\n')
      if (comandos) {
        menuTexto += `\n\n*╭──･ ̸̷∵* \`${tags[tag]}\`  *݁ 🌸՞*
*├───────────── 𔐼ֹ֪*
${comandos}
*│ׄ╭─── 𝆺𝅥 ֙⋆*
*╰╯*\n`
      }
    }

    let date = `${dia}, ${fechaTxt}, ${hora}`
    let infoUser = `> ✰ *¡ʜᴏʟᴀ!* ${name}, ᴀǫᴜɪ ᴛɪᴇɴᴇs ʟᴀ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs..
> . ﹡ ﹟ 🌱 ׄ ⬭ ${ucapan()}  ִ ࣪ᗣ𓈒 

﹙🫛 ﹚੭੭ ─ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎𝐍  ﾟ𓏸𓈒𑇛
  ׄ ⬭ㅤׄ *ʙᴏᴛ ɴᴀᴍᴇ ::* ${conn.user?.name || 'Bot'}
  ׄ ⬭ㅤׄ *ᴛɪᴘᴏ ::* ${(conn.user.jid == global.conn.user.jid ? 'Principal' : 'Sub-Bot')}
  ׄ ⬭ㅤׄ *ᴄᴏᴍᴀɴᴅᴏs ::* ${totalCommands}
  ׄ ⬭ㅤׄ *ᴀᴄᴛɪᴠᴏ ::* ${uptime}
  ׄ ⬭ㅤׄ *ᴘᴀɪs ::* ${pais}
  ׄ ⬭ㅤׄ *ᴜsᴜᴀʀɪᴏs ʀᴇɢ ::* ${totalreg}
  ׄ ⬭ㅤׄ *ɢʀᴜᴘᴏs ::* ${groupsCount}
  ׄ ⬭ㅤׄ *ʟɪʙʀᴇʀɪᴀ ::* ${libreria}
  ׄ ⬭ㅤׄ *ᴅᴀᴛᴇ/ᴛɪᴍᴇ ::* ${date}

${readMore}
  乂 *ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs* 乂`.trim()


   const icon = [
     'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766860960881_784501.jpeg',
     'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766860957838_177118.jpeg'
   ]
   let icons = icon[Math.floor(Math.random() * icon.length)]
    
  const Shadow_url = await (await fetch(icons)).buffer()
  const fkontak = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      productMessage: {
        product: {
          productImage: {
            mimetype: "image/jpeg",
            jpegThumbnail: Shadow_url
          },
          title: "⌗ֶㅤ𝐌𝐞𝐧𝐮 - 𝐌𝐢𝐤𝐮 𝐀𝐈 𝅄🥢",
          description: "",
          currencyCode: "USD",
          priceAmount1000: 10000,
          retailerId: "menu"
        },
        businessOwnerJid: "51919199620@s.whatsapp.net"
      }
    }
  }
/*
await m.react('🫧')
await conn.sendMessage(m.chat, { 
text: infoUser + menuTexto,
contextInfo: {
 mentionedJid: [mentionedJid],
 isForwarded: true,
 forwardedNewsletterMessageInfo: {
   newsletterJid: channelRD.id,
   serverMessageId: '',
   newsletterName: channelRD.name
 },
 externalAdReply: {
   title: botname,
   body: "＃お sʜᴀ̊ᴅᴏᴡ's xʏᴢ 彡",
   mediaType: 1,
   mediaUrl: null,
   sourceUrl: null,
   thumbnail: await (await fetch(banner)).buffer(),
   showAdAttribution: false,
   containsAutoReply: true,
   renderLargerThumbnail: true
 }}}, { quoted: fkontak })*/

await m.react('🫧')
await conn.sendMessage(
  m.chat,
  {
    video: { url: 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766660971009_17954.mp4' },
    caption: infoUser + menuTexto,
    gifPlayback: true,
    gifAttribution: 0,
    contextInfo: {
      //mentionedJid: [mentionedJid],
      isForwarded: false,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        serverMessageId: 100,
        newsletterName: channelRD.name
      },
      externalAdReply: {
        title: botname,
        body: "⌑ ⟅ㅤׂ۪ㅤㅤ𓄟 𝖿ᥱᥣіz ᥒᥲ᥎іძᥲძ #⁺࣭ㅤ⟆",
        thumbnailUrl: "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766870174208_372730.jpeg",
        mediaType: 1,
        mediaUrl: null,
        sourceUrl: redes,
        renderLargerThumbnail: false
      }
    }
  },
  { quoted: fkontak }
)

} catch (e) {
   console.error(e)
   await conn.sendMessage(m.chat, { 
     text: `✘ Error al enviar el menú: ${e.message}`,
     mentionedJid: [mentionedJid]
   })
 }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu','help','menú', 'allmenu']
handler.register = true
export default handler

function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

function ucapan() {
  const time = moment.tz('America/Lima').format('HH')
  let res = "🅑𝖚𝖊𝖓𝖆𝖘 ɴᴏᴄʜᴇ𝓢 👻"
  
  if (time >= 5 && time < 12)
    res = "🅑𝖚𝖊𝖓𝖔𝖘 𝒟í𝖆𝓢 ☀️"
  else if (time >= 12 && time < 18)
    res = "🅑𝖚𝖊𝖓𝖆𝖘 Ŧ𝖆𝖗𝖉𝖊𝓢 🌤️"
  else if (time >= 18)
    res = "🅑𝖚𝖊𝖓𝖆𝖘 ɴᴏᴄʜᴇ𝓢 🌌"

  return res
}