import fetch from "node-fetch"

async function fixUrl(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36",
        "Accept": "*/*"
      }
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
      `🍃 *Ingresa un enlace de YouTube*\nEjemplo:\n${usedPrefix + command} https://youtu.be/TdrL3QxjyVw`,
      m
    )

  try {
    await m.react('⏳')

    
    const api = `https://api.delirius.store/download/ytmp4?url=${encodeURIComponent(text)}`

    const res = await fetch(api, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36",
        "Accept": "application/json"
      }
    })

    if (res.status === 403) throw "🚫 *La API está bloqueando la petición (403)*"
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
    conn.reply(m.chat, `⚠️ Error:\n${err}`, m)
  }
}

handler.command = ["yt", "ytv"]
export default handler