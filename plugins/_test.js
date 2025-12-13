import fetch from 'node-fetch'
import FormData from 'form-data'

async function uploadToCatbox(buffer, mime) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, {
    filename: `banner.${mime.split('/')[1] || 'bin'}`,
    contentType: mime
  })

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  })

  const text = await res.text()

  if (!text.startsWith('https://')) {
    throw new Error('Catbox error: ' + text)
  }

  return text.trim()
}

let handler = async (m, { conn, args }) => {
  const idBot = conn.user.id.split(':')[0] + '@s.whatsapp.net'
  const isOwner = [idBot, ...global.owner.map(v => v + '@s.whatsapp.net')].includes(m.sender)

  if (!isOwner) return m.reply('*🌿 Solo el owner puede usar este comando*')

  const value = args.join(' ').trim()

  if (!value && !m.quoted && !m.message?.imageMessage && !m.message?.videoMessage) {
    return m.reply('🍃 Responde o envía una imagen o video.')
  }

  if (value.startsWith('http')) {
    global.banner = value
    return m.reply(`🌿 Banner actualizado correctamente`)
  }

  const q = m.quoted || m

  const mime =
    q.msg?.mimetype ||
    q.message?.imageMessage?.mimetype ||
    q.message?.videoMessage?.mimetype ||
    ''

  if (!/^(image\/(png|jpe?g|gif)|video\/mp4)$/.test(mime)) {
    return m.reply('🌿 Solo imágenes (jpg/png/gif) o video mp4.')
  }

  const media = await q.download()
  if (!media) return m.reply('🍃 No se pudo descargar el archivo.')

  const link = await uploadToCatbox(media, mime)
  global.banner = link

  m.reply(`🌿 Banner actualizado con éxito`)
}

handler.help = ['setbanner']
handler.tags = ['owner']
handler.command = ['setbanner', 'setmenubanner']
handler.owner = true

export default handler