import Jimp from 'jimp'

const handler = async (m, { conn, command }) => {

  const isSubBots = [
    conn.user.jid,
    ...global.owner.map(([number]) => `${number}@s.whatsapp.net`)
  ].includes(m.sender)

  if (!isSubBots) return m.reply(`❀ El comando *${command}* solo puede ser ejecutado por el Socket.`)

  try {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''

    if (!/image\/(png|jpe?g)/.test(mime))
      return conn.reply(m.chat, `❀ Envía o responde una imagen válida para establecer el banner.`, m)

    const media = await q.download()
    if (!media) return conn.reply(m.chat, `ꕥ No se pudo obtener la imagen.`, m)

    const img = await Jimp.read(media)
    const buffer = await img.getBufferAsync(Jimp.MIME_JPEG)

    global.banner = buffer

    conn.reply(m.chat, `❀ El banner global fue actualizado correctamente.`, m)

  } catch (e) {
    m.reply(`⚠︎ Ocurrió un error al intentar cambiar el banner.\n\n${e.message}`)
  }
}

handler.help = ['setbanner']
handler.tags = ['socket']
handler.command = ['setbanner']

export default handler