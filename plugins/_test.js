import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const handler = async (m, { conn }) => {
  const stikerxd = [
    'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206411174_96183.webp',
    'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206396554_438808.webp',
    'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206481646_48030.webp',
    'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206464183_411585.webp',
    'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206454397_333640.webp',
  '',
  '',
  '',
  ]
  
  const url = pickRandom(stikerxd)
  const imgBuffer = await fetch(url).then(res => res.buffer())
  const webpBuffer = await sticker(imgBuffer, false, `BrayanX330`)

  await conn.sendMessage(m.chat, { sticker: webpBuffer }, { quoted: m })
}

handler.customPrefix = /Ayuda|ayuda|Puto|puto|xd|Xd|vrg/
handler.command = new RegExp()
export default handler