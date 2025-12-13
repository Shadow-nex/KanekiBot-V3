import { spawn } from 'child_process'
import fs from 'fs'

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

    return {
      buffer,
      fileName: this.sanitizeFileName(filename)
    }
  }
}

// Optimiza el mp4 (faststart)
async function convertToFast(buffer) {
  const inFile = './temp_in.mp4'
  const outFile = './temp_out.mp4'

  fs.writeFileSync(inFile, buffer)

  await new Promise((res, rej) => {
    const ff = spawn('ffmpeg', [
      '-i', inFile,
      '-c', 'copy',
      '-movflags', 'faststart',
      outFile
    ])
    ff.on('close', c => (c === 0 ? res() : rej()))
  })

  const newBuffer = fs.readFileSync(outFile)
  fs.unlinkSync(inFile)
  fs.unlinkSync(outFile)

  return newBuffer
}

let handler = async (m, { conn, args, command }) => {
  try {
    if (!args[0])
      return m.reply(`📌 *Ejemplo:* .${command} https://youtu.be/JiEW1agPqNY`)

    const waitMsg = await conn.sendMessage(
      m.chat,
      { text: '🎥 Descargando video en 480p, espera...' },
      { quoted: m }
    )

    let { buffer, fileName } = await yt.download(args[0])
    buffer = await convertToFast(buffer)

    await conn.sendMessage(
      m.chat,
      {
        video: buffer,
        mimetype: 'video/mp4',
        fileName
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { delete: waitMsg.key })
  } catch (e) {
    m.reply(`❌ Error: ${e.message}`)
  }
}

handler.help = ['yt']
handler.tags = ['descargador']
handler.command = ['yt']

export default handler