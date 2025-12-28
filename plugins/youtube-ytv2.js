import fetch from 'node-fetch'
import yts from 'yt-search'
import Jimp from 'jimp'
import axios from "axios"
import crypto from "crypto"

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    cdn: "/random-cdn",
    info: "/v2/info",
    download: "/download"
  },
  headers: {
    'accept': '*/*',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  },

  crypto: {
    hexToBuffer: (hexString) => {
      const matches = hexString.match(/.{1,2}/g);
      return Buffer.from(matches.join(''), 'hex');
    },

    decrypt: async (enc) => {
      const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
      const data = Buffer.from(enc, 'base64');
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      const key = savetube.crypto.hexToBuffer(secretKey);

      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return JSON.parse(decrypted.toString());
    }
  },

  isUrl: str => { 
    try { new URL(str); return true } 
    catch { return false } 
  },

  youtube: url => {
    const patterns = [
      /watch\?v=([a-zA-Z0-9_-]{11})/,
      /embed\/([a-zA-Z0-9_-]{11})/,
      /v\/([a-zA-Z0-9_-]{11})/,
      /shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let r of patterns) if (r.test(url)) return url.match(r)[1];
    return null;
  },

  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return { status: true, data: response };
    } catch (e) {
      return { status: false, error: e.message };
    }
  },

  getCDN: async () => {
    const cdn = await savetube.request(savetube.api.cdn, {}, "get");
    if (!cdn.status) return cdn;
    return { status: true, cdn: cdn.data.cdn };
  },

  getVideoDownload: async (url, quality) => {
    const id = savetube.youtube(url)
    if (!id) return { status: false, error: "❌ No se pudo extraer el ID del video." }

    try {
      const cdn = await savetube.getCDN()
      if (!cdn.status) return cdn

      // INFO
      const info = await savetube.request(
        `https://${cdn.cdn}${savetube.api.info}`,
        { url: `https://www.youtube.com/watch?v=${id}` }
      )
      if (!info.status) return info

      const decrypted = await savetube.crypto.decrypt(info.data.data)

      // DESCARGA
      const dl = await savetube.request(
        `https://${cdn.cdn}${savetube.api.download}`,
        { id, key: decrypted.key, downloadType: "video", quality }
      )

      return {
        status: true,
        title: decrypted.title,
        thumbnail: decrypted.thumbnail,
        downloadUrl: dl.data.data.downloadUrl
      }

    } catch (e) {
      return { status: false, error: e.message }
    }
  }
}


let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return m.reply(`🎥 *Ingresa un título o enlace de YouTube.*`)

  try {
    let url = ''
    let videoData = null

    if (/^https?:\/\/(www\.)?youtu/.test(text)) {
      url = text.trim()
      const id = url.split("v=")[1] || url.split("/").pop()
      const search = await yts({ videoId: id })
      videoData = search.videos[0]
    } else {
      const search = await yts(text)
      if (!search?.videos?.length) return m.reply('❌ No encontré resultados.')
      videoData = search.videos[0]
      url = videoData.url
    }

    const caption = `
╭━━━〔 🎞️ *YOUTUBE DOWNLOADER* 〕━━⬣
┃ ✦ *Título:* ${videoData.title}
┃ ✦ *Canal:* ${videoData.author.name}
┃ ✦ *Duración:* ${videoData.timestamp}
┃ ✦ *Vistas:* ${videoData.views.toLocaleString()}
┃ ✦ *Publicado:* ${videoData.ago}
┃ ✦ *Link:* ${videoData.url}
╰━━━━━━━━━━━━━━━━━━⬣

🎋 *Elige la calidad que deseas descargar:*
1️⃣ 144p
2️⃣ 240p
3️⃣ 360p
4️⃣ 480p
5️⃣ 720p
6️⃣ 1080p
`.trim()

    const thumb = await (await fetch(videoData.thumbnail)).arrayBuffer()
    const msg = await conn.sendMessage(
      m.chat,
      { image: Buffer.from(thumb), caption },
      { quoted: m }
    )

    conn.ytdl = conn.ytdl || {}
    conn.ytdl[m.sender] = {
      url,
      title: videoData.title,
      thumb: videoData.thumbnail,
      msgId: msg.key.id,
      timeout: setTimeout(() => delete conn.ytdl[m.sender], 5 * 60 * 1000)
    }

  } catch (e) {
    console.error(e)
    m.reply("❌ Error inesperado.")
  }
}

handler.before = async (m, { conn }) => {
  conn.ytdl = conn.ytdl || {}
  const ses = conn.ytdl[m.sender]

  if (!ses || !m.quoted || m.quoted.id !== ses.msgId) return

  const num = parseInt(m.text.trim())
  const qualities = ["144", "240", "360", "480", "720", "1080"]
  const quality = qualities[num - 1]

  if (!quality) return m.reply("❌ Opción no válida.")

  await m.reply(`📥 *Descargando ${ses.title} en ${quality}p...*`)
  m.react("⌛")

  try {
    const res = await savetube.getVideoDownload(ses.url, quality)
    if (!res.status) throw new Error(res.error)

    const { downloadUrl } = res

    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: `${ses.title} [${quality}p].mp4`,
        caption: `🎞️ *${ses.title}*\n✨ Calidad: *${quality}p*`
      },
      { quoted: m }
    )

    m.react("✅")
    clearTimeout(ses.timeout)
    delete conn.ytdl[m.sender]

  } catch (e) {
    console.error(e)
    m.reply("❌ Error descargando el video.")
  }
}

handler.command = ['ytv-v2', 'ytvpro']
handler.help = ['ytv-v2 <título o URL>']
handler.tags = ['download']

export default handler