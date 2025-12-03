import speed from 'performance-now'
import { exec } from 'child_process'
import moment from 'moment-timezone'
import fetch from 'node-fetch'
import os from 'os'
import Jimp from 'jimp'

let handler = async (m, { conn }) => {
try {

let timestamp = speed()
let latensi = speed() - timestamp

const start = new Date().getTime()
await conn.sendMessage(m.chat, { text: " " }, { quoted: m })
const end = new Date().getTime()
const latency = end - start

const uptime = process.uptime()
const hours = Math.floor(uptime / 3600)
const minutes = Math.floor((uptime % 3600) / 60)
const secondsUp = Math.floor(uptime % 60)

const uptimeFormatted = `${hours}h ${minutes}m ${secondsUp}s`

const usedRAM_MB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)

const totalRAM_GB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
const freeRAM_GB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
const usedRAM_GB = (totalRAM_GB - freeRAM_GB).toFixed(2)

const percentRAM = Math.round((usedRAM_GB / totalRAM_GB) * 100)

function makeBar(porc) {
  let total = 10
  let filled = Math.round((porc / 100) * total)
  let empty = total - filled
  return `▰`.repeat(filled) + `▱`.repeat(empty)
}

const ramBar = `${makeBar(percentRAM)} ${percentRAM}%`

const cores = os.cpus().length
const modeloCPU = os.cpus()[0].model

const fechaHora = moment().tz('America/Lima').format('YYYY/MM/DD, h:mm A')

let base = await Jimp.read(banner)
let icon = await Jimp.read(banner)
icon.resize(80, 80)

base.composite(icon, 10, 10)
let editedThumb = await base.getBufferAsync(Jimp.MIME_JPEG)

exec(`neofetch --stdout`, async (error, stdout) => {
let sysInfo = stdout?.toString("utf-8")?.replace(/Memory:/, "Ram:") || ""

const Shadow_url = await (await fetch(banner)).buffer()

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
        title: "Ping",
        description: ""
      },
      businessOwnerJid: `51919199620@s.whatsapp.net`
    }
  }
}

const tipoBot = (conn.user.jid === global.conn.user.jid) ? "⭐ Principal" : " Sub-Bot"

let response = `
*Estado del Bot:* ${tipoBot}

*Ping:* ${latency} ms
*Latencia Interna:* ${latensi.toFixed(4)} ms

*CPU:* ${cores} cores
*Modelo:* ${modeloCPU}
*RAM:* ${usedRAM_MB} MB
 ├ • Usada: ${usedRAM_GB} GB
 ├ • Libre: ${freeRAM_GB} GB
 ├ • Total: ${totalRAM_GB} GB
 └ • Uso: ${ramBar}

*Uptime:* ${uptimeFormatted}
*Fecha/Hora:* ${fechaHora}

\`\`\`${sysInfo.trim()}\`\`\`
`

const fakeDoc = {
    document: Buffer.from("KanekiBot-AI"),
    fileName: botname,
    mimetype: "application/zip",
    fileLength: 1_000_000_000,
    caption: response,
    jpegThumbnail: editedThumb
}

await conn.sendMessage(m.chat, fakeDoc, { mentions: [m.sender], quoted: fkontak })
})
} catch (e) {
console.log(e)
m.reply("Error en el comando ping.")
}
}

handler.help = ['ping','p']
handler.tags = ['info']
handler.command = ['ping','p']
handler.register = true

export default handler