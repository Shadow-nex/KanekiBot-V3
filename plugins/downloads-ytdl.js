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

  log(m) {
    console.log('[yt] ' + m)
  },

  resolveConverterPayload(link, f = '128k') {
    const formatos = ['128k', '320k', '144p', '240p', '360p', '720p', '1080p']
    if (!formatos.includes(f))
      throw Error(`Formato inválido (${formatos.join(', ')})`)

    const tipo = f.endsWith('k') ? 'mp3' : 'mp4'
    return {
      link,
      format: tipo,
      audioBitrate: tipo === 'mp3' ? f.replace('k', '') : '128',
      videoQuality: tipo === 'mp4' ? f.replace('p', '') : '720',
      filenameStyle: 'pretty',
      vCodec: 'h264'
    }
  },

  sanitizeFileName(name) {
    const ext = name.match(/\.[^.]+$/)?.[0] || ''
    return (
      name
        .replace(ext, '')
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .toLowerCase() + ext
    )
  },

  async getKey() {
    const r = await fetch(this.static.baseUrl + '/v2/sanity/key', {
      headers: this.static.headers
    })
    if (!r.ok) throw Error('Key error')
    return await r.json()
  },

  async convert(url, f) {
    const { key } = await this.getKey()
    const payload = this.resolveConverterPayload(url, f)
    const r = await fetch(this.static.baseUrl + '/v2/converter', {
      method: 'POST',
      headers: { ...this.static.headers, key },
      body: new URLSearchParams(payload)
    })
    if (!r.ok) throw Error('Convert error')
    return await r.json()
  }
}

/* =======================
   VIDEO FASTSTART ROBUSTO
======================= */

async function convertToFast(buffer) {
  const input = `./in_${Date.now()}.mp4`
  const output = `./out_${Date.now()}.mp4`

  fs.writeFileSync(input, buffer)

  const tryCopy = () =>
    new Promise((res, rej) => {
      const ff = spawn('ffmpeg', [
        '-y',
        '-i', input,
        '-c', 'copy',
        '-movflags', '+faststart',
        output
      ])
      ff.on('close', c => (c === 0 ? res() : rej()))
    })

  const reEncode = () =>
    new Promise((res, rej) => {
      const ff = spawn('ffmpeg', [
        '-y',
        '-i', input,
        '-map', '0:v:0',
        '-map', '0:a?',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-c:a', 'aac',
        '-movflags', '+faststart',
        output
      ])
      ff.on('close', c => (c === 0 ? res() : rej()))
    })

  try {
    await tryCopy()
  } catch {
    await reEncode()
  }

  const newBuffer = fs.readFileSync(output)
  fs.unlinkSync(input)
  fs.unlinkSync(output)

  return newBuffer
}

/* =======================
        HANDLER
======================= */

let handler = async (m, { conn, args, command }) => {
  try {
    if (!args[0])
      return m.reply(`Ejemplo:\n.${command} https://youtu.be/xxxx`)

    const isAudio = command.startsWith('yta')
    const wait = isAudio
      ? '🎧 Descargando audio...'
      : '🎥 Descargando video...'

    const msg = await conn.sendMessage(m.chat, { text: wait }, { quoted: m })

    const formato = args[1] || (isAudio ? '128k' : '720p')
    const data = await yt.convert(args[0], formato)

    const fileName = yt.sanitizeFileName(data.filename)

    /* ===== AUDIO LARGO → STREAM ===== */
    if (isAudio && data.size && data.size > 80 * 1024 * 1024) {
      await conn.sendMessage(
        m.chat,
        {
          document: { url: data.url },
          mimetype: 'audio/mpeg',
          fileName
        },
        { quoted: m }
      )
    } else {
      const r = await fetch(data.url, { headers: { range: 'bytes=0-' } })
      const buffer = Buffer.from(await r.arrayBuffer())

      if (isAudio) {
        await conn.sendMessage(
          m.chat,
          { audio: buffer, mimetype: 'audio/mpeg', fileName },
          { quoted: m }
        )
      } else {
        const fixed = await convertToFast(buffer)
        await conn.sendMessage(
          m.chat,
          { video: fixed, mimetype: 'video/mp4', fileName },
          { quoted: m }
        )
      }
    }

    await conn.sendMessage(m.chat, { delete: msg.key })
  } catch (e) {
    m.reply('❌ Error: ' + e.message)
  }
}

handler.help = ['ytv2', 'yta2']
handler.tags = ['descargas']
handler.command = ['ytv2', 'yta2']

export default handler