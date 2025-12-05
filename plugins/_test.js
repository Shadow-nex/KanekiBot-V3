import fetch from "node-fetch"

let handler = async (m, { conn }) => {
  let r = await fetch("https://akirax-api.vercel.app/nsfw/waifu")
  let j = await r.json()

  let img = await fetch(j.url)
  let buff = await img.buffer()

  await conn.sendMessage(m.chat, { image: buff, caption: `Creator: ${j.creator}` }, { quoted: m })
}

handler.command = ['test']
export default handler