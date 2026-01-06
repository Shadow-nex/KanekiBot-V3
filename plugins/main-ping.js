import speed from 'performance-now'
import os from 'os'
import { exec } from 'child_process'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let sentMsg = await conn.reply(m.chat, '❀ Calculando ping...', m)
  let latency = speed() - timestamp

  const totalRAM = os.totalmem()
  const freeRAM = os.freemem()
  const usedRAM = totalRAM - freeRAM

  const usedRAM_MB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
  const usedRAM_GB = (usedRAM / 1024 / 1024 / 1024).toFixed(2)
  const freeRAM_GB = (freeRAM / 1024 / 1024 / 1024).toFixed(2)
  const totalRAM_GB = (totalRAM / 1024 / 1024 / 1024).toFixed(2)

  const uptimeBot = process.uptime()
  const hb = Math.floor(uptimeBot / 3600)
  const mb = Math.floor((uptimeBot % 3600) / 60)
  const sb = Math.floor(uptimeBot % 60)
  const uptimeBotTxt = `${hb}h ${mb}m ${sb}s`

  const uptimeSys = os.uptime()
  const ds = Math.floor(uptimeSys / 86400)
  const hs = Math.floor((uptimeSys % 86400) / 3600)
  const ms = Math.floor((uptimeSys % 3600) / 60)
  const ss = Math.floor(uptimeSys % 60)
  const uptimeSysTxt = `${ds}d ${hs}h ${ms}m ${ss}s`

  const now = new Date()
  const fecha = now.toLocaleDateString('es-ES')
  const hora = now.toLocaleTimeString('es-ES')

  exec(`neofetch --stdout`, (error, stdout) => {
    let child = stdout.toString('utf-8')
      .replace(/Memory:/g, 'Ram:')
      .replace(/OS:/g, 'Sistema:')
      .replace(/Host:/g, 'Host:')

    let result = `
✰ *¡Pong!*

✎ \`𝐏𝐢𝐧𝐠:\` \`\`\`${latency.toFixed(0)} ms\`\`\`
✎ \`𝐑𝐚𝐦 𝐔𝐬𝐚𝐠𝐞:\` \`\`\`${usedRAM_MB} MB\`\`\`
✎ \`𝐑𝐚𝐦:\` \`\`\`${usedRAM_GB} GB / ${freeRAM_GB} GB / ${totalRAM_GB} GB\`\`\`
✎ \`𝐔𝐩𝐭𝐢𝐦𝐞 𝐁𝐨𝐭:\` \`\`\`${uptimeBotTxt}\`\`\`
✎ \`𝐔𝐩𝐭𝐢𝐦𝐞 𝐒𝐢𝐬𝐭𝐞𝐦𝐚:\` \`\`\`${uptimeSysTxt}\`\`\`
✎ \`𝐅𝐞𝐜𝐡𝐚:\` \`\`\`${fecha}\`\`\`
✎ \`𝐇𝐨𝐫𝐚:\` \`\`\`${hora}\`\`\`

${child}
`.trim()

    const fakex = {
      contextInfo: {
        externalAdReply: {
          title: "  ׄꤥ STATUS - PINGㅤꤥ",
          body: dev,
          thumbnailUrl: banner,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: redes
        }
      }
    }

    conn.sendMessage(
      m.chat,
      { text: result, edit: sentMsg.key, ...fakex },
      { quoted: m }
    )
  })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']

export default handler