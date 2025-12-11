import fetch from "node-fetch"

async function fixUrl(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow"
    })
    return res.url || url
  } catch (e) {
    console.log("FixURL Error:", e)
    return url
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text)
    return conn.reply(
      m.chat,
      `🍃 *Ingresa un enlace de YouTube*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/TdrL3QxjyVw`,
      m
    )

  try {
    await m.react('⏳')

    const api = `https://api.delirius.store/download/ytmp4?url=${encodeURIComponent(text)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json.status) throw "❌ La API no devolvió datos."

    const data = json.data
    const dl = data.download

    
    const finalUrl = await fixUrl(dl.url)

    
    await conn.sendMessage(
      m.chat,
      {
        document: { url: finalUrl },
        mimetype: "video/mp4",
        fileName: dl.filename || "video.mp4"
      },
      { quoted: m }
    )

    await m.react('✅')

  } catch (err) {
    console.log(err)
    await m.react('❌')
    conn.reply(m.chat, "⚠️ No pude enviar el video.", m)
  }
}

handler.help = ["yt <url>"]
handler.tags = ["downloader"]
handler.command = ["yt", "ytv"]

export default handler