import axios from "axios"

async function anakbaik(url) {
  try {
    let { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile Safari/604.1"
      },
      maxRedirects: 5
    })

    let video = data.match(/"contentUrl":"(https:\/\/v1\.pinimg\.com\/videos\/[^\"]+\.mp4)"/)
    let image = data.match(/"imageSpec_736x":\{"url":"(https:\/\/i\.pinimg\.com\/736x\/[^\"]+\.(?:jpg|jpeg|png|webp))"/) || 
                data.match(/"imageSpec_564x":\{"url":"(https:\/\/i\.pinimg\.com\/564x\/[^\"]+\.(?:jpg|jpeg|png|webp))"/)

    let thumb = data.match(/"thumbnail":"(https:\/\/i\.pinimg\.com\/videos\/thumbnails\/originals\/[^\"]+\.jpg)"/)
    let title = data.match(/"name":"([^"]+)"/)
    let author = data.match(/"fullName":"([^"]+)".+?"username":"([^"]+)"/)
    let date = data.match(/"uploadDate":"([^"]+)"/)
    let keyword = data.match(/"keywords":"([^"]+)"/)

    return {
      type: video ? "video" : "image",
      title: title ? title[1] : "-",
      author: author ? author[1] : "-",
      username: author ? author[2] : "-",
      media: video ? video[1] : image ? image[1] : "-",
      thumbnail: thumb ? thumb[1] : "-",
      uploadDate: date ? date[1] : "-",
      keywords: keyword ? keyword[1].split(",").map(x => x.trim()) : []
    }

  } catch (e) {
    return { error: e.message }
  }
}

let handler = async (m, { conn, args }) => {
  try {
    let url = args[0]
    if (!url) return m.reply('*Ejemplo :* .pindl2 https://pin.it/4S4R8jDVR')

    let res = await anakbaik(url)
    if (res.error) return m.reply(res.error)

    let caption = `
📌 *Resultado de Pinterest*

🖼️ *Tipo:* ${res.type}
📛 *Título:* ${res.title}
👤 *Autor:* ${res.author}
🔎 *Usuario:* ${res.username}
📅 *Subido:* ${res.uploadDate}
🏷️ *Keywords:* ${res.keywords.join(", ") || "-"}

🔗 *Link Directo:* 
${res.media}

⭐ *Plugin by Shadow UwU*
`.trim()

    if (res.type === 'video') {
      await conn.sendMessage(m.chat, { 
        video: { url: res.media },
        caption 
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, { 
        image: { url: res.media },
        caption 
      }, { quoted: m })
    }

  } catch (e) {
    m.reply(e.message)
  }
}

handler.help = ['pindl2']
handler.command = ['pindl2']
handler.tags = ['downloader']

export default handler