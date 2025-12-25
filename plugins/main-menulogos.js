import fs from 'fs'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'maker': '`ᴍᴇɴᴜ ʟᴏɢᴏᴛɪᴘᴏs`',
}

function toFancyText(text) {
  const normal = 'abcdefghijklmnopqrstuvwxyz1234567890'
  const fancy = ['ᥲ','ᑲ','ᥴ','ძ','ᥱ','𝖿','g','һ','і','ȷ','k','ᥣ','m','ᥒ','᥆','⍴','𝗊','r','s','𝗍','ᥙ','᥎','ᥕ','᥊','ᥡ','z','1','2','3','4','5','6','7','8','9','0']
  return text.split('').map(c => {
    let index = normal.indexOf(c.toLowerCase())
    return index !== -1 ? fancy[index] : c
  }).join('')
}

const menuStyle = {
  before: `╭─╼| ${botname}
│ 𝙈𝙀𝙉𝙐 𝘿𝙀 𝙇𝙊𝙂𝙾𝙎 🧊
╰─╼|━━━━━━━━⬣

🦌 Usuario: %name
🎄 Nivel: %level
❄️ Exp: %exp / %maxexp
🍄 Modo: %mode
🍃 Usuarios Totales: %totalreg
⏱ Uptime: %muptime

🌳 Fecha: %fecha
🌸 Hora: %hora
🌱 País: %pais

%readmore`.trim(),

  header: `❦ %category ♧\n━━━━━━━━━━━━━━━━━`,
  body: `> 🧊 %cmd`,
  footer: `━━━━━━━━━━━━━━━━━`,
  after: `\n${dev}`
}

let handler = async (m, { conn, usedPrefix }) => {
  try {
    let { exp, level } = global.db.data.users[m.sender]
    let { min, xp } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let mode = global.opts.self ? 'Privado' : 'Público'
    let muptime = clockString(await getMuptime())
    let totalreg = Object.keys(global.db.data.users).length

    let fecha = new Date()
    let opciones = { timeZone: 'America/Lima', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    let fechaFormat = fecha.toLocaleDateString('es-PE', opciones)
    let hora = fecha.toLocaleTimeString('es-PE', { timeZone: 'America/Lima' })
    let pais = '🇵🇪 Perú'

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
    }))

    let text = [
      menuStyle.before,
      ...Object.keys(tags).map(cat => {
        return menuStyle.header.replace('%category', tags[cat]) + '\n' +
        help
          .filter(p => p.tags && p.tags.includes(cat))
          .map(p => p.help.map(cmd =>
            menuStyle.body.replace('%cmd', toFancyText(usedPrefix + cmd))
          ).join('\n'))
          .join('\n')
        + '\n' + menuStyle.footer
      }),
      menuStyle.after
    ].join('\n')

    text = text.replace(/%name/g, name)
      .replace(/%exp/g, exp - min)
      .replace(/%level/g, level)
      .replace(/%maxexp/g, xp)
      .replace(/%totalreg/g, totalreg)
      .replace(/%mode/g, mode)
      .replace(/%muptime/g, muptime)
      .replace(/%fecha/g, fechaFormat)
      .replace(/%hora/g, hora)
      .replace(/%pais/g, pais)
      .replace(/%readmore/g, readMore)

    await conn.sendMessage(m.chat, { 
      document: fs.readFileSync("./package.json"),
      fileName: `「 🦌 𝐌𝐄𝐍𝐔 𝐋𝐎𝐆𝐎𝐒 ❄️ 」`,
      mimetype: 'application/vnd.ms-excel',
      caption: text.trim(),
      contextInfo: {
      isForwarded: true,
         forwardedNewsletterMessageInfo: {
           newsletterJid: channelRD.id,
           serverMessageId: '',
           newsletterName: channelRD.name
         },
        externalAdReply: { 
          title: botname,
          body: `🎍 𝘓𝘰𝘴 𝘭𝘰𝘨𝘰𝘴 𝘥𝘦𝘮𝘰𝘯𝘪𝘢𝘤𝘰𝘴 𝘦𝘴𝘵𝘢𝘯 𝘭𝘪𝘴𝘵𝘰𝘴 𝑥𝐷...`,
          thumbnailUrl: banner,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fkontak })

    m.react('❄️')

  } catch {
    m.reply('🌿 ᴇʀʀᴏʀ ᴀʟ ᴇɴᴠɪᴀʀ ᴇʟ ᴍᴇɴᴜ xᴅ.')
  }
}

handler.help = ['menulogos']
handler.tags = ['menu']
handler.command = ['menulogos', 'menu logos', 'logosmenu']
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

async function getMuptime() {
  if (process.send) {
    process.send('uptime')
    return await new Promise(resolve => process.once('message', resolve)) * 1000
  }
  return process.uptime() * 1000
}

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}