import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import moment from 'moment-timezone'

let handler = async (m, { conn, args, participants }) => {

let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
let totalreg = Object.keys(global.db.data.users).length
let totalCommands = Object.keys(global.plugins).length

let user = global.db.data.users[m.sender] || {}
let name = await conn.getName(m.sender)
let premium = user.premium ? '✔️ Sí' : 'free'
let limit = user.limit || 10
let groupUserCount = m.isGroup ? participants?.length || 0 : '-'
let groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length
let uptime = clockString(process.uptime() * 1000)

let fecha = new Date(Date.now())
let locale = 'es-PE'
let dia = fecha.toLocaleDateString(locale, { weekday: 'long' })
let fechaTxt = fecha.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
let hora = fecha.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })

let readMore = String.fromCharCode(8206).repeat(4001)

let userIdNum = m.sender.split('@')[0]
let phone = PhoneNumber('+' + userIdNum)
let pais = phone.getRegionCode() || 'Desconocido 🌐'

let txt = `.     ִ ࣪ 𓈒 ᗣ  ${ucapan()}  ࣫ㅤׅ 🎄۫ 
    ᗞᗞ @${userIdNum}  ⌒᷼🍋‍🟩
̮═͜═࣪͜═͜═࣪͜═͜═࣪͜═͜═࣪͜═͜═࣪͜ ִ  ۫ 𔐼ֹ ⸼ ࣪࣪ ۪ ═͜═࣪͜═͜═࣪͜═͜═࣪͜═͜═࣪͜═͜═

﹙🥦 ﹚🪽  ੭੭ ─ 𝐈𝐍𝐅𝐎 𝐁𝐎𝐓'𝐬  ﾟ･:𑇛

 ⌗ֶㅤ֯𝅄⿻ 🪹 ׄ ⬭ 🄿remium: *${premium}*
 ⌗ֶㅤ֯𝅄⿻ 🪴 ׄ ⬭ 🄿ais: *${pais}*
 ⌗ֶㅤ֯𝅄⿻ 🪵 ׄ ⬭ 🄻imite: *${limit}*
 ⌗ֶㅤ֯𝅄⿻ 🌿 ׄ ⬭ 🅄sers registrados: *${totalreg}*
 ⌗ֶㅤ֯𝅄⿻ 🍄 ׄ ⬭ 🄶rupos activos: *${groupsCount}*
 ⌗ֶㅤ֯𝅄⿻ 🌟 ׄ ⬭ 🅁untime: *${uptime}*
${readMore}

 ᦷᩘᦷ  ⃪֪݊🥢໑ٜ࣪ ㅤ🄱ot: *${(conn.user.jid == global.conn.user.jid ? 'Principal' : 'Sub-Bot')}*
 ᦷᩘᦷ  ⃪֪݊🎋໑ٜ࣪ ㅤ🄲omandos: *${totalCommands}*
 ᦷᩘᦷ  ⃪֪݊☃️໑ٜ࣪ ㅤ🅅ersion: *${vs}*
 ᦷᩘᦷ  ⃪֪݊🥙໑ٜ࣪ ㅤ🄻ibreria: *${libreria}*
 ᦷᩘᦷ  ⃪֪݊🎍໑ٜ࣪ ㅤ🄵echa: *${hora}, ${dia}, ${fechaTxt}*

═͜═࣪͜═͜═࣪͜═͜═࣪͜═͜═࣪͜═͜═࣪͜ ִ  ۫ 𔐼ֹ ⸼ ࣪࣪ ۪ ═͜═࣪͜═͜═࣪͜═͜═࣪͜═͜═࣪͜═͜═

${readMore}`.trim()

await conn.sendMessage(m.chat, { 
text: txt,
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
   body: textbot,
   mediaType: 1,
   mediaUrl: redes,
   sourceUrl: redes,
   thumbnail: await (await fetch(banner)).buffer(),
   showAdAttribution: false,
   containsAutoReply: true,
   renderLargerThumbnail: true
 }}}, { quoted: m })

}

handler.help = ['test']
handler.tags = ['main']
handler.command = ['test']

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