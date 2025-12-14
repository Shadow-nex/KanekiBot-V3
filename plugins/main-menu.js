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
      'info': '🌾 `𝐈𝐍𝐅𝐎` ❐',
      'main': '🍃 `𝐌𝐀𝐈𝐍` ❐',
      'anime': '🍁 `𝐀𝐍𝐈𝐌𝐄` ❐',
      'menu': '🎋 `𝐌𝐄𝐍𝐔𝐒` ❐',
      'search': '🍟 `𝐁𝐔𝐒𝐐𝐔𝐄𝐃𝐀𝐒` ❐',
      'download': '🪽 `𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒` ❐',
      'socket': '🌱 `𝐉𝐀𝐃𝐈-𝐁𝐎𝐓𝐒` ❐',
      'rg': '🌷 `𝐏𝐄𝐑𝐅𝐈𝐋` ❐',
      'fun': '🪷 `𝐅𝐔𝐍` ❐',
      'rpg': '🫛 `𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀` ❐',
      'gacha': '🥗 `𝐆𝐀𝐂𝐇𝐀` ❐',
      'game': '⚡ `𝐆𝐀𝐌𝐄` ❐',
      'group': '🕸️ `𝐆𝐑𝐔𝐏𝐎` ❐',
      'nable': '💫 `𝐎𝐍 / 𝐎𝐅𝐅` ❐',
      'ia': ' 🌿 `𝐈𝐍𝐓𝐄𝐋𝐈𝐆𝐄𝐍𝐂𝐈𝐀` ❐',
      'stalk': '💐 `𝐒𝐓𝐀𝐋𝐊`  ❐',
      'maker': '🚩 `𝐋𝐎𝐆𝐎𝐓𝐈𝐏𝐎𝐒` ❐',
      'tools': '🍬 `𝐓𝐎𝐎𝐋𝐒` ❐',
      'sticker': '🪼 `𝐒𝐓𝐈𝐂𝐊𝐄𝐒` ❐',
      'owner': '🐦‍🔥 `𝐎𝐖𝐍𝐄𝐑` ❐',
      'nsfw': '👾 `𝐍𝐒𝐅𝐖` ❐',
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
        .map(cmd => cmd.help.map(e => ` ۫🌴ֹ 𔐼ֹ֪➩ \`\`\`${usedPrefix}${e}\`\`\``).join('\n'))
        .join('\n')
      if (comandos) {
        menuTexto += `\n\n> ׅ    𓈈 ׁ ${tags[tag]} 𓏽 ֟꒱𑁬
${comandos}\n`
      }
    }

    const infoUser = `> ✰ *¡ʜᴏʟᴀ!* @${userIdNum}, sᴏʏ *${botname}*, ᴀǫᴜɪ ᴛɪᴇɴᴇs ʟᴀ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs.
> . ﹡ ﹟ 🌹 ׄ ⬭ ${ucapan()}  ִ ࣪ᗣ𓈒 

﹙🫛 ﹚੭੭ ─ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎𝐍  ﾟ･:𑇛
 ⌗ֶㅤ֯𝅄⿻ ׄ ⬭ *ʙᴏᴛ* » 𝙺𝚊𝚗𝚎𝚔𝚒 - 𝙺𝚎𝚗
 ⌗ֶㅤ֯𝅄⿻ ׄ ⬭ *ᴛɪᴘᴏ* » ${(conn.user.jid == global.conn.user.jid ? 'Principal' : 'Sub-Bot')}
 ⌗ֶㅤ֯𝅄⿻ ׄ ⬭ *ᴄᴏᴍᴀɴᴅᴏs* » ${totalCommands}
 ⌗ֶㅤ֯𝅄⿻ ׄ ⬭ *ᴀᴄᴛɪᴠᴏ* » ${uptime}
 ⌗ֶㅤ֯𝅄⿻ ׄ ⬭ *ᴘᴀɪs* » ${pais}
 ⌗ֶㅤ֯𝅄⿻ ׄ ⬭ *ᴜsᴜᴀʀɪᴏs ʀᴇɢ* » ${totalreg}
 ⌗ֶㅤ֯𝅄⿻ ׄ ⬭ *ɢʀᴜᴘᴏs* » ${groupsCount}
 ⌗ֶㅤ֯𝅄⿻ ׄ ⬭ *ʟɪʙʀᴇʀɪᴀ* » ${libreria}

${readMore}
   *✎ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs ✰*`.trim()

    const icon = [
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763911352440_131724.jpeg',
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763911305951_36243.jpeg',
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763911237754_990508.jpeg',
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763911566098_479123.jpeg'
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
          title: "𝐌 𝐄 𝐍 𝐔 • 𝐊 𝐀 𝐍 𝐄 𝐊 𝐈",
          description: "",
          currencyCode: "USD",
          priceAmount1000: 10000,
          retailerId: "menu"
        },
        businessOwnerJid: "51919199620@s.whatsapp.net"
      }
    }
  }
await m.react('🍁')
await conn.sendMessage(m.chat, { 
text: infoUser + menuTexto,
contextInfo: {
 //mentionedJid: [mentionedJid],
 isForwarded: true,
 forwardedNewsletterMessageInfo: {
   newsletterJid: channelRD.id,
   serverMessageId: '',
   newsletterName: channelRD.name
 },
 externalAdReply: {
   title: botname,
   body: `❂ ${hora}, ${dia}, ${fechaTxt} ♡`,
   mediaType: 1,
   mediaUrl: redes,
   sourceUrl: redes,
   thumbnail: await (await fetch(banner)).buffer(),
   showAdAttribution: false,
   containsAutoReply: true,
   renderLargerThumbnail: true
 }}}, { quoted: fkontak })

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
handler.command = ['menu','help','menú','allmenu','menucompleto']

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