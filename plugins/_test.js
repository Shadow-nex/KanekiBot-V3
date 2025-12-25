import axios from "axios"

let HS = async (m, { conn, command, text, usedPrefix }) => {
if (!text) 
  return conn.reply(m.chat, `\`\»\` Ingresa un *texto o link* de *YouTube*`, m)

try {
let type = "mp3" // fijo solo audio
let data = await ytdl(text, type)

let txt = `❀ *Título »* ${data.searchResult.title}
❀ *Duración »* ${data.searchResult.duration}
❀ *Autor »* ${data.searchResult.uploader}
❀ *Vistas »* ${data.searchResult.viewCount}`

await conn.sendMessage(
  m.chat,
  { image: { url: data.searchResult.thumbnail }, caption: txt },
  { quoted: m }
)

await conn.sendMessage(
  m.chat,
  {
    audio: { url: data.download.dl_url },
    mimetype: "audio/mpeg",
    fileName: data.download.filename
  },
  { quoted: m }
)

} catch (error) {
console.error(error)
await m.react("❌")
}}

HS.help = ["yt + [texto/link]"]
HS.tags = ["dl"]
HS.command = ["yt"]

export default HS

async function ytdl(query, type) {
try {
const searchResponse = await axios.get(
  `https://yt-extractor.y2mp3.co/api/youtube/search?q=${encodeURIComponent(query)}`,
  {
    headers: {
      'authority': 'yt-extractor.y2mp3.co',
      'accept': 'application/json',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
    },
    timeout: 30000
  }
)

if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
  return { success: false, error: 'No se encontró el video.' }
}

const firstResult = searchResponse.data.items[0]

let downloadResponse = await axios.post(
  'https://sv-190.y2mp3.co/',
  {
    url: firstResult.id,
    downloadMode: "audio",
    brandName: "ytmp3.gg",
    audioFormat: "mp3",
    audioBitrate: "320"
  },
  {
    headers: {
      'authority': 'sv-190.y2mp3.co',
      'accept': 'application/json',
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
    },
    timeout: 45000
  }
)

return {
  success: true,
  query,
  searchResult: {
    title: firstResult.title,
    duration: firstResult.duration,
    uploader: firstResult.uploaderName,
    viewCount: firstResult.viewCount,
    uploadDate: firstResult.uploadDate,
    thumbnail: firstResult.thumbnailUrl
  },
  download: {
    status: downloadResponse.data.status,
    dl_url: downloadResponse.data.url,
    filename: downloadResponse.data.filename
  }
}

} catch (error) {
return { success: false, error: error.message, query }
}
}