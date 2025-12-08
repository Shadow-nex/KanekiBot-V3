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
  'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206543565_175284.webp',
  'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206554456_58191.webp',
  'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765206577983_237130.webp',
  ]
  
  const url = pickRandom(stikerxd)
  const imgBuffer = await fetch(url).then(res => res.buffer())
  const webpBuffer = await sticker(imgBuffer, false, `ׄ 몽\` ۪sһᥲძ᥆ᥕ.᥊ᥡz おịᰫ`)

  await conn.sendMessage(m.chat, { sticker: webpBuffer }, { quoted: m })
}

handler.customPrefix = /Ayuda|ayuda|Puto|puto|xd|Xd|vrg/
handler.command = new RegExp()
export default handler