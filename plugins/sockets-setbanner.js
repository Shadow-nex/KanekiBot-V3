import axios from 'axios'
import FormData from 'form-data'

async function uploadCatbox(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, 'banner.jpg')

  const { data } = await axios.post(
    'https://catbox.moe/user/api.php',
    form,
    { headers: form.getHeaders() }
  )

  return data.trim()
}

let handler = async (m, { conn }) => {

  // 🔒 solo creador o el socket
  const isOwner = Array.isArray(global.owner)
    ? global.owner.some(o => m.sender === o || m.sender === o + '@s.whatsapp.net')
    : m.sender === global.owner

  if (!isOwner && m.sender !== conn.user.jid) {
    return m.reply('❌ Solo el creador o este subbot')
  }

  if (!m.quoted || !m.quoted.mimetype?.startsWith('image/')) {
    return m.reply('✳️ Responde a una imagen')
  }

  let img = await m.quoted.download()
  if (!img) return m.reply('❌ Error al descargar')

  let url
  try {
    url = await uploadCatbox(img)
  } catch {
    return m.reply('❌ Error al subir a Catbox')
  }

  // ✅ SOLO global.banner
  global.banner = url

  m.reply(`✅ Banner actualizado\n🌐 ${url}`)
}

handler.command = ['setbanner']
export default handler