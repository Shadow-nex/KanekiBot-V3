import fs from 'fs'
import path from 'path'
import Jimp from 'jimp'

const bannerDir = global.banner
if (!fs.existsSync(bannerDir)) fs.mkdirSync(bannerDir, { recursive: true })

function getBannerPath(botJid) {
  const botId = botJid.replace(/[:@.]/g, '_')
  return path.join(bannerDir, `banner_${botId}.jpg`)
}

function getDefaultBanner() {
  return banner
}

const handler = async (m, { conn, command }) => {
  const isSubBot = [
    conn.user.jid,
    ...global.owner.map(([num]) => `${num}@s.whatsapp.net`)
  ].includes(m.sender)

  if (!isSubBot) return m.reply(`❀ El comando *${command}* solo puede ser usado por el SubBot.`)

  const botJid = conn.user.jid
  const bannerFile = getBannerPath(botJid)

  try {

    if (command === 'setbanner') {
      const q = m.quoted || m
      const mime = (q.msg || q).mimetype || ''

      if (!/image\/(png|jpe?g)/.test(mime))
        return m.reply(`❀ Envía o responde a una imagen (JPG/PNG) válida.`)

      const media = await q.download()
      if (!media) return m.reply(`❎ No se pudo obtener la imagen.`)

      const img = await Jimp.read(media)
      const buffer = await img.getBufferAsync(Jimp.MIME_JPEG)

      fs.writeFileSync(bannerFile, buffer)
      global.banner = buffer // solo aplica al SubBot actual

      return m.reply(`✅ Banner actualizado para este SubBot.`)
    }

    if (command === 'resetbanner') {
      const defaultBanner = getDefaultBanner()

      if (!fs.existsSync(defaultBanner))
        return m.reply(`⚠︎ El banner original no existe: ${defaultBanner}`)

      const buffer = fs.readFileSync(defaultBanner)

      fs.writeFileSync(bannerFile, buffer)
      global.banner = buffer

      return m.reply(`♻️ Banner restaurado a su imagen original.`)
    }

  } catch (e) {
    console.error(e)
    m.reply(`⚠︎ Error al procesar el banner:\n${e.message}`)
  }
}

handler.help = ['setbanner','resetbanner']
handler.tags = ['subbot']
handler.command = ['setbanner','resetbanner']

export default handler