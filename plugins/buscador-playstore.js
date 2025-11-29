import axios from 'axios'
import * as cheerio from 'cheerio'

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return conn.reply(
    m.chat,
    '🌿 Ingresa el nombre de la aplicación.\n\nEjemplo:\n' + `> *${usedPrefix}playstore* whatsapp`,
    m
  )

  await m.react('🕓')

  const searchPlayStore = async (query) => {
    try {
      const url = `https://play.google.com/store/search?q=${encodeURIComponent(query)}&c=apps`
      const { data } = await axios.get(url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0'
        }
      })

      const $ = cheerio.load(data)
      const apps = []

      $('a.Si6A0c.Gy4nib').each((i, el) => {
        if (i >= 5) return

        const link = 'https://play.google.com' + $(el).attr('href')
        const nombre = $(el).find('.DdYX5').text().trim()
        const desarrollador = $(el).find('.wMUdtb').text().trim()
        const calificacion = $(el).find('span.w2kbF').text().trim()

        apps.push({
          nombre: nombre || 'Sin nombre',
          desarrollador: desarrollador || 'Sin desarrollador',
          calificacion: calificacion || 'Sin calificación',
          link,
          link_desarrollador:
            desarrollador
              ? `https://play.google.com/store/apps/developer?id=${desarrollador.replace(/\s+/g, '+')}`
              : 'No disponible',
          img: 'https://files.catbox.moe/dklg5y.jpg'
        })
      })

      return apps
    } catch (e) {
      console.error(e)
      return []
    }
  }

  const resultados = await searchPlayStore(text)

  if (!resultados.length)
    return m.reply('❌ No se encontraron resultados.')

  let txt = `*💙 Resultados de Play Store para "${text}"*\n\n`

  for (let app of resultados) {
    txt += `🌿 *Nombre:* ${app.nombre}\n`
    txt += `💮 *Desarrollador:* ${app.desarrollador}\n`
    txt += `✨ *Calificación:* ${app.calificacion}\n`
    txt += `🔥 *Link:* ${app.link}\n`
    txt += `🍋 *Link del Desarrollador:* ${app.link_desarrollador}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n`
  }

  await conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: {
      externalAdReply: {
        title: resultados[0].nombre,
        body: `Resultados en Play Store`,
        thumbnailUrl: resultados[0].img,
        sourceUrl: resultados[0].link,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  })

  await m.react('✔️')
}

handler.help = ['playstore <texto>']
handler.tags = ['search']
handler.command = ['playstore', 'ps']
handler.limit = false

export default handler