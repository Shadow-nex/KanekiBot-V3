import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const handler = async (m, { conn }) => {
  const stikerxd = [
    'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206411174_96183.webp',
    'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206396554_438808.webp',
    'https://raw.githubusercontent.com/El-brayan502/dat1/main/uploads/caf9ab-1762063306221.webp',
    'https://raw.githubusercontent.com/El-brayan502/dat4/main/uploads/a96e48-1762063311159.webp',
     'https://raw.githubusercontent.com/El-brayan502/dat1/main/uploads/ea45de-1762063545565.webp',
  ]
  
  const url = pickRandom(stikerxd)
  const imgBuffer = await fetch(url).then(res => res.buffer())
  const webpBuffer = await sticker(imgBuffer, false, `BrayanX330`)

  await conn.sendMessage(m.chat, { sticker: webpBuffer }, { quoted: m })
}

handler.customPrefix = /Ayuda|ayuda|Puto|puto|xd|Xd|vrg/
handler.command = new RegExp()
export default handler