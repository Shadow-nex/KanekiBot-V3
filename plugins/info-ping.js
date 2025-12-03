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

const cores = os.cpus().length
const modeloCPU = os.cpus()[0].model

const fechaHora = moment().tz('America/Lima').format('YYYY/MM/DD, h:mm A')

const thumbBuffer = Buffer.from(await (await fetch('https://i.pinimg.com/originals/d0/bc/19/d0bc19ccb8e9441e1b3962990bfb09a6.png')).arrayBuffer())

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
      businessOwnerJid: `${numCreador}@s.whatsapp.net`
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
*RAM:*
 ├ • Usada: ${usedRAM_GB} GB
 ├ • Libre: ${freeRAM_GB} GB
 └ • Total: ${totalRAM_GB} GB
 
*Uptime:* ${uptimeFormatted}
*Fecha/Hora:* ${fechaHora}
\`\`\`${sysInfo.trim()}\`\`\`
`

await conn.sendMessage(m.chat, {
  text: response,
  mentions: [m.sender],
  contextInfo: {
    externalAdReply: {
      title: botname,
      body: dev,
      thumbnail: thumbBuffer,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: true
    }
  }
}, { quoted: fkontak })

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