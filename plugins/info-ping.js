import speed from 'performance-now'
import { exec } from 'child_process'
import moment from 'moment-timezone'
import fetch from 'node-fetch'
import os from 'os'

let handler = async (m, { conn }) => {
try {

let timestamp = speed()
let latensi = speed() - timestamp

const start = new Date().getTime()
await m.react('🚀');
await conn.reply(m.chat, "*💛 Calculando ping...*", m);
const end = new Date().getTime()
const latency = end - start

const uptime = process.uptime()
const hours = Math.floor(uptime / 3600)
const minutes = Math.floor((uptime % 3600) / 60)
const secondsUp = Math.floor(uptime % 60)
const uptimer = `${hours}h ${minutes}m ${secondsUp}s`

const usedRAM_MB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
const totalRAM_GB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
const freeRAM_GB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
const usedRAM_GB = (totalRAM_GB - freeRAM_GB).toFixed(2)
const percentRAM = Math.round((usedRAM_GB / totalRAM_GB) * 100)

function makeBar(porc) {
  let total = 10
  let filled = Math.round((porc / 100) * total)
  let empty = total - filled
  return `■`.repeat(filled) + `□`.repeat(empty)
}

const ramBar = `${makeBar(percentRAM)} ${percentRAM}%`

const cores = os.cpus().length
const modeloCPU = os.cpus()[0].model

const date = moment().tz('America/Lima').format('YYYY/MM/DD, h:mm A')

function getDisk() {
  return new Promise((resolve) => {
    exec(`df -h /`, (err, stdout) => {
      if (err) return resolve({ total: "--", used: "--", free: "--", percent: "--" })
      let lines = stdout.trim().split("\n")
      let disk = lines[1].replace(/\s+/g, " ").split(" ")
      resolve({
        total: disk[1],
        used: disk[2],
        free: disk[3],
        percent: disk[4]
      })
    })
  })
}

const disk = await getDisk()
let diskPercent = parseInt(disk.percent.replace("%",""))
const diskBar = `${makeBar(diskPercent)} ${diskPercent}%`

exec(`neofetch --stdout`, async (error, stdout) => {
let sysInfo = stdout?.toString("utf-8")?.replace(/Memory:/, "Ram:") || ""

const tipoBot = (conn.user.jid === global.conn.user.jid) ? "⭐ Principal" : " Sub-Bot"

let response = `˒˓  🌱  ֹ  S Y S T E M - P I N G  ׅ  ♡︪︩১  ֹ

𓋜 𝐄𝐬𝐭𝐚𝐝𝐨 𝐝𝐞𝐥 𝐛𝐨𝐭: \`\`\`${tipoBot}\`\`\` ᨻ꯭🪴᪶᪲ ׅ

✎ \`𝐏𝐢𝐧𝐠:\` \`\`\`${latency} ms\`\`\`
✎ \`𝐋𝐚𝐭𝐞𝐧𝐜𝐲:\` \`\`\`${latensi.toFixed(4)} ms\`\`\`
✎ \`𝐑𝐚𝐦 𝐔𝐬𝐚𝐠𝐞:\` \`\`\`${usedRAM_MB} MB\`\`\`
✎ \`𝐔𝐩𝐭𝐢𝐦𝐞:\` \`\`\`${uptimer}\`\`\`
✎ \`𝐅𝐞𝐜𝐡𝐚:\` \`\`\`${date}\`\`\`
✎ \`𝐍𝐮𝐜𝐥𝐞𝐨𝐬:\` \`\`\`(${cores})\`\`\`
✎ \`𝐌𝐨𝐝𝐞𝐥𝐨:\` \`\`\`${modeloCPU}\`\`\`


╭╼| 🌾 🅁🄰🄼   ᗤᗤ
├ *ʀᴀᴍ ᴜsᴀᴅᴀ* › \`\`\`${usedRAM_GB} GB\`\`\`
├ *ʀᴀᴍ ʟɪʙʀᴇ* › \`\`\`${freeRAM_GB} GB\`\`\`
├ *ʀᴀᴍ ᴛᴏᴛᴀʟ* › \`\`\`${totalRAM_GB} GB\`\`\`
╰╼| \`\`\`${ramBar}\`\`\`

╭╼| 🍃 🄳🄸🅂🄲🄾   ᗤᗤ
├ *ᴅɪsᴄᴏ ᴜsᴀᴅᴏ* › \`\`\`${disk.used}\`\`\`
├ *ᴅɪsᴄᴏ ʟɪʙʀᴇ* › \`\`\`${disk.free}\`\`\`
├ *ᴅɪsᴄᴏ ᴛᴏᴛᴀʟ* › \`\`\`${disk.total}\`\`\`
╰╼| \`\`\`${diskBar}\`\`\`
${sysInfo.trim()}\`\`\``

const banner = await (await fetch("https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1764808441981_100675.jpeg")).buffer()
const fakex = {
  contextInfo: {
    externalAdReply: {
      title: "  ׄꤥ STATUS - PINGㅤׄꤥㅤׅ",
      body: dev,
      thumbnailUrl: "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766606109078_219766.jpeg",
      mediaType: 1,
      renderLargerThumbnail: true,
      sourceUrl: "https://whatsapp.com"
    }
  }
}

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
          jpegThumbnail: banner
        },
        title: botname,
        description: ""
      },
      businessOwnerJid: `51919199620@s.whatsapp.net`
    }
  }
}

  await conn.reply(m.chat, response, fkontak, fakex);
  await m.react('✔️');
})
} catch (e) {
console.log(e)
m.reply("Error en el comando ping..")
}
}

handler.help = ['ping','p']
handler.tags = ['info']
handler.command = ['ping','p']
handler.register = true

export default handler