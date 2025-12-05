
import axios from "axios"
import https from "https"
import baileys from "@whiskeysockets/baileys"

let handler = async (m, { conn, args }) => {
  const text = args.join(" ")
  if (!text) return m.reply("❗ Ingresa un texto o link de Pinterest")

  if (isPinterestUrl(text)) {
    try {
      let media = await scrapePinterestLink(text)
      if (!media) return m.reply("⚠️ No pude obtener contenido del link.")

      if (media.type === "video") {
        await conn.sendFile(m.chat, media.url, "pinterest.mp4", "🎬 *Video de Pinterest*", m)
      } else if (media.type === "gif") {
        await conn.sendFile(m.chat, media.url, "pinterest.gif", "🌀 *GIF de Pinterest*", m)
      } else {
        await conn.sendFile(m.chat, media.url, "pinterest.jpg", "📌 *Imagen de Pinterest*", m)
      }

      return
    } catch (e) {
      console.log(e)
      return m.reply("⚠️ Error al procesar el link.")
    }
  }

  try {
    const results = await searchPinterestAPI(text, 10)
    if (!results.length) return m.reply("⚠️ No encontré resultados.")

    for (let url of results) {
      await conn.sendFile(m.chat, url, "pin.jpg", `📍 *${text}*`, m)
      await wait(800)
    }

  } catch (e) {
    console.log(e)
    m.reply("⚠️ Error en el scraper de Pinterest.")
  }
}

handler.command = ["pinterest2", "pin2"]
export default handler

function isPinterestUrl(url) {
  return /(pinterest\.com|pin\.it)/i.test(url)
}

async function scrapePinterestLink(url) {
  try {
    let html = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    }).then(r => r.data)

    let videoMatch = html.match(/"video_list":\s*(\{.*?\})/)
    if (videoMatch) {
      let json = JSON.parse(videoMatch[1])
      let qualities = Object.values(json)
      let best = qualities.sort((a, b) => b.width - a.width)[0]
      return { type: "video", url: best.url }
    }

    let gifMatch = html.match(/"images":\s*\{[^}]*"orig".*?"url":"(.*?)"/)
    if (gifMatch && gifMatch[1].endsWith(".gif")) {
      return { type: "gif", url: clean(gifMatch[1]) }
    }

    let imgMatch = html.match(/"images":\s*\{[^}]*?"url":"(.*?)"/)
    if (imgMatch) {
      return { type: "image", url: clean(imgMatch[1]) }
    }

    return null
  } catch (e) {
    console.log(e)
    return null
  }
}

function clean(u) {
  return u.replace(/\\u002F/g, "/")
}

async function getInitialAuth() {
  return new Promise((resolve, reject) => {
    https.get(
      {
        hostname: "id.pinterest.com",
        path: "/",
        headers: { "User-Agent": "Mozilla/5.0" }
      },
      res => {
        const cookies = res.headers["set-cookie"]
        const csrf = cookies.find(c => c.startsWith("csrftoken="))
        const sess = cookies.find(c => c.startsWith("_pinterest_sess="))

        if (csrf && sess) {
          resolve({
            token: csrf.split("=")[1].split(";")[0],
            cookie: `${csrf.split(";")[0]}; ${sess.split(";")[0]}`
          })
        } else reject("No cookies")
      }
    )
  })
}

async function searchPinterestAPI(query, limit) {
  try {
    const { token, cookie } = await getInitialAuth()
    let results = [], bookmark = null, keepGoing = true

    while (keepGoing && results.length < limit) {
      const post = {
        options: { query, page_size: 25, bookmarks: bookmark ? [bookmark] : [] },
        context: {}
      }

      const res = await axios.post(
        "https://id.pinterest.com/resource/BaseSearchResource/get/",
        `source_url=/search/pins/?q=${encodeURIComponent(query)}&data=${encodeURIComponent(JSON.stringify(post))}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": token,
            Cookie: cookie
          }
        }
      )

      let pins = res.data?.resource_response?.data?.results || []
      bookmark = res.data?.resource_response?.bookmark

      pins.forEach(p => {
        if (p.images?.["736x"]) results.push(p.images["736x"].url)
      })

      if (!bookmark || !pins.length) keepGoing = false
    }

    return results.slice(0, limit)

  } catch (e) {
    console.log(e)
    return []
  }
}

function wait(ms) {
  return new Promise(r => setTimeout(r, ms))
}