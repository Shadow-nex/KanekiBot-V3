import yts from "yt-search"
import fetch from "node-fetch"

function convertirDuracion(timestamp) {
  const partes = timestamp.split(":").map(Number)

  let horas = 0, minutos = 0, segundos = 0

  if (partes.length === 3) {
    horas = partes[0]
    minutos = partes[1]
    segundos = partes[2]
  } else if (partes.length === 2) {
    minutos = partes[0]
    segundos = partes[1]
  }

  const arr = []
  if (horas) arr.push(`${horas} hora${horas > 1 ? 's' : ''}`)
  if (minutos) arr.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`)
  if (segundos) arr.push(`${segundos} segundo${segundos > 1 ? 's' : ''}`)

  return arr.join(", ")
}

function calcularTamano(duracionSeg) {
  const kbps = 380
  const mb = (duracionSeg * kbps) / 8 / 1024
  return mb.toFixed(2) + " MB"
}

let handler = async (m, { conn, text, command }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `*❀ Ingresa el nombre del video o un enlace de YouTube.*`,
      m
    )

  await m.react("🔎")

  try {
    const r = await yts(text)
    if (!r.videos.length)
      return conn.reply(m.chat, "*No encontré nada.*", m)

    const v = r.videos[0]

    const partes = v.timestamp.split(":").map(Number)
    let duracionSeg = 0

    if (partes.length === 3) {
      duracionSeg = partes[0] * 3600 + partes[1] * 60 + partes[2]
    } else {
      duracionSeg = partes[0] * 60 + partes[1]
    }

    const tamaño = calcularTamano(duracionSeg)
    const duracionBonita = convertirDuracion(v.timestamp)

    const info = `  *▥ Y O U T U B E - D O W N L O A D*

> *• ᴛɪᴛᴜʟᴏ »* ${v.title}
> *• ɪᴅ »* ${v.videoId}
> *• ᴄᴀʟɪᴅᴀᴅ »* 480p
> *• ᴄᴀɴᴀʟ »* ${v.author.name}
> *• ᴠɪsᴛᴀs »* ${v.views.toLocaleString()}
> *• ᴅᴜʀᴀᴄɪᴏɴ »* ${duracionBonita}
> *• ᴘᴜʙʟɪᴄᴀᴅᴏ »* ${v.ago}
> *• ᴛᴀᴍᴀɴ̃ᴏ »* ${tamaño}
> *• ʟɪɴᴋ »* ${v.url}`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: v.thumbnail },
        caption: info
      },
      { quoted: m }
    )

    const api = `${global.APIs.vreden.url}/api/v1/download/youtube/video?url=${encodeURIComponent(v.url)}&quality=480`

    const res = await fetch(api)
    const json = await res.json()

    if (!json?.result?.download?.url)
      return conn.reply(m.chat, "> *No pude obtener el video.*", m)

    const downloadUrl = json.result.download.url
    const meta = json.result.metadata

    const kbps = 1000
    const sizeMB = ((meta.seconds * kbps) / 8 / 1024).toFixed(2)

    const sendAs = sizeMB > 100 ? "document" : "video"

    await conn.sendMessage(
      m.chat,
      {
        [sendAs]: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: `${meta?.title || "video"}.mp4`,
        caption: null
      },
      { quoted: m }
    )

    await m.react("✅")

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠ Error al buscar o descargar el video.", m)
  }
}

handler.command = ['ytmp4']
handler.tags = ['download']
handler.help = ['ytmp4 <texto o link>']
handler.group = true
handler.register = true

export default handler
/*

import yts from "yt-search"
import fetch from "node-fetch"
import { spawn } from "child_process"
import fs from "fs"

const yt = {
  static: Object.freeze({
    baseUrl: 'https://cnv.cx',
    headers: {
      'accept-encoding': 'gzip, deflate, br, zstd',
      'origin': 'https://frame.y2meta-uk.com',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
    }
  }),

  resolveConverterPayload(link) {
    return {
      link,
      format: 'mp4',
      audioBitrate: '128',
      videoQuality: '480',
      filenameStyle: 'pretty',
      vCodec: 'h264'
    }
  },

  sanitizeFileName(n) {
    const ext = n.match(/\.[^.]+$/)[0]
    const name = n
      .replace(new RegExp(`\\${ext}$`), '')
      .replaceAll(/[^A-Za-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase()
    return name + ext
  },

  async getBuffer(u) {
    const h = structuredClone(this.static.headers)
    h.referer = 'https://v6.www-y2mate.com/'
    h.range = 'bytes=0-'
    delete h.origin

    const r = await fetch(u, { headers: h })
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)
    return Buffer.from(await r.arrayBuffer())
  },

  async getKey() {
    const r = await fetch(this.static.baseUrl + '/v2/sanity/key', {
      headers: this.static.headers
    })
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)
    return r.json()
  },

  async convert(u) {
    const { key } = await this.getKey()
    const payload = this.resolveConverterPayload(u)

    const r = await fetch(this.static.baseUrl + '/v2/converter', {
      method: 'POST',
      headers: { key, ...this.static.headers },
      body: new URLSearchParams(payload)
    })
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)
    return r.json()
  },

  async download(u) {
    const { url, filename } = await this.convert(u)
    const buffer = await this.getBuffer(url)
    return { buffer, fileName: this.sanitizeFileName(filename) }
  }
}

async function convertToFast(buffer) {
  const inFile = './temp_in.mp4'
  const outFile = './temp_out.mp4'
  fs.writeFileSync(inFile, buffer)

  await new Promise((res, rej) => {
    const ff = spawn('ffmpeg', ['-i', inFile, '-c', 'copy', '-movflags', 'faststart', outFile])
    ff.on('close', c => (c === 0 ? res() : rej()))
  })

  const newBuffer = fs.readFileSync(outFile)
  fs.unlinkSync(inFile)
  fs.unlinkSync(outFile)
  return newBuffer
}

function convertirDuracion(timestamp) {
  const p = timestamp.split(":").map(Number)
  let h = 0, m = 0, s = 0
  if (p.length === 3) [h, m, s] = p
  else [m, s] = p
  const a = []
  if (h) a.push(`${h} hora${h > 1 ? 's' : ''}`)
  if (m) a.push(`${m} minuto${m > 1 ? 's' : ''}`)
  if (s) a.push(`${s} segundo${s > 1 ? 's' : ''}`)
  return a.join(", ")
}

function calcularTamano(seg) {
  const kbps = 380
  return ((seg * kbps) / 8 / 1024).toFixed(2) + " MB"
}

let handler = async (m, { conn, text }) => {
  if (!text)
    return conn.reply(m.chat, `*❀ Ingresa el nombre del video o un enlace de YouTube.*`, m)

  await m.react("🔎")

  try {
    const r = await yts(text)
    if (!r.videos.length)
      return conn.reply(m.chat, "*No encontré nada.*", m)

    const v = r.videos[0]
    const p = v.timestamp.split(":").map(Number)
    const duracionSeg = p.length === 3 ? p[0]*3600 + p[1]*60 + p[2] : p[0]*60 + p[1]

    const info = `*▥ Y O U T U B E - D O W N L O A D*

> *• ᴛɪᴛᴜʟᴏ »* ${v.title}
> *• ɪᴅ »* ${v.videoId}
> *• ᴄᴀʟɪᴅᴀᴅ »* 480p
> *• ᴄᴀɴᴀʟ »* ${v.author.name}
> *• ᴠɪsᴛᴀs »* ${v.views.toLocaleString()}
> *• ᴅᴜʀᴀᴄɪᴏɴ »* ${convertirDuracion(v.timestamp)}
> *• ᴘᴜʙʟɪᴄᴀᴅᴏ »* ${v.ago}
> *• ᴛᴀᴍᴀɴ̃ᴏ »* ${calcularTamano(duracionSeg)}
> *• ʟɪɴᴋ »* ${v.url}`

    await conn.sendMessage(
      m.chat,
      { image: { url: v.thumbnail }, caption: info },
      { quoted: m }
    )

    const waitMsg = await conn.sendMessage(
      m.chat,
      { text: '> 🌾 Descargando video en calidad 480p, espera un momento...' },
      { quoted: m }
    )

    let { buffer, fileName } = await yt.download(v.url)
    buffer = await convertToFast(buffer)

    await conn.sendMessage(
      m.chat,
      { video: buffer, mimetype: 'video/mp4', fileName },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { delete: waitMsg.key })
    await m.react("✅")

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "⚠ Error al buscar o descargar el video.", m)
  }
}

handler.command = ['ytmp4']
handler.tags = ['download']
handler.help = ['ytmp4 <texto o link>']
handler.group = true
handler.register = true

export default handler*/