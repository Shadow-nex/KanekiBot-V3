/*
	* Create By Brayan330
	* Follow https://github.com/El-brayan502 
	* Whatsapp : https://whatsapp.com/channel/0029Vb6BDQc0lwgsDN1GJ31i
*/

import https from 'https'
import baileys, { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import axios from 'axios'

async function sendAlbumMessage(conn, jid, medias, options = {}) {
  if (typeof jid !== 'string') throw new TypeError('jid debe ser string')
  if (medias.length < 1) throw new RangeError('Se requieren al menos 1 imagen')

  const caption = options.caption || ''
  const delay = !isNaN(options.delay) ? options.delay : 500

  const album = await baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(m => m.type === 'image').length,
        expectedVideoCount: medias.filter(m => m.type === 'video').length,
        ...(options.quoted ? {
          contextInfo: {
            remoteJid: options.quoted.key.remoteJid,
            fromMe: options.quoted.key.fromMe,
            stanzaId: options.quoted.key.id,
            participant: options.quoted.key.participant || options.quoted.key.remoteJid,
            quotedMessage: options.quoted.message
          }
        } : {})
      }
    },
    {}
  )

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id })

  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i]
    const img = await baileys.generateWAMessage(
      album.key.remoteJid,
      { [type]: { ...data }, ...(i === 0 ? { caption } : {}) },
      { upload: conn.waUploadToServer }
    )
    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key }
    }
    await conn.relayMessage(img.key.remoteJid, img.message, { messageId: img.key.id })
    await baileys.delay(delay)
  }

  return album
}

const getInitialAuth = () => new Promise((resolve, reject) => {
  const options = {
    hostname: 'id.pinterest.com',
    path: '/',
    method: 'GET',
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }
  https.get(options, res => {
    const cookies = res.headers['set-cookie']
    if (cookies) {
      const csrfCookie = cookies.find(c => c.startsWith('csrftoken='))
      const pinterestSessCookie = cookies.find(c => c.startsWith('_pinterest_sess='))
      if (csrfCookie && pinterestSessCookie) {
        const csrftoken = csrfCookie.split(';')[0].split('=')[1]
        const sess = pinterestSessCookie.split(';')[0]
        resolve({ csrftoken, cookieHeader: `csrftoken=${csrftoken}; ${sess}` })
        return
      }
    }
    reject(new Error('No se pudo obtener el token CSRF o la cookie de sesión.'))
  }).on('error', e => reject(e))
})

const searchPinterestAPI = async (query, limit) => {
  try {
    const { csrftoken, cookieHeader } = await getInitialAuth()
    let results = [], bookmark = null, keepFetching = true
    while (keepFetching && results.length < limit) {
      const postData = { options: { query, scope: 'pins', bookmarks: bookmark ? [bookmark] : [] }, context: {} }
      const sourceUrl = `/search/pins/?q=${encodeURIComponent(query)}`
      const dataString = `source_url=${encodeURIComponent(sourceUrl)}&data=${encodeURIComponent(JSON.stringify(postData))}`
      const options = {
        hostname: 'id.pinterest.com',
        path: '/resource/BaseSearchResource/get/',
        method: 'POST',
        headers: {
          Accept: 'application/json, text/javascript, */*, q=0.01',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': csrftoken,
          'X-Pinterest-Source-Url': sourceUrl,
          Cookie: cookieHeader
        }
      }

      const responseBody = await new Promise((resolve, reject) => {
        const req = https.request(options, res => {
          let body = ''
          res.on('data', chunk => body += chunk)
          res.on('end', () => resolve(body))
        })
        req.on('error', e => reject(e))
        req.write(dataString)
        req.end()
      })

      const jsonResponse = JSON.parse(responseBody)
      if (jsonResponse.resource_response?.data?.results) {
        const pins = jsonResponse.resource_response.data.results
        pins.forEach(pin => { if (pin.images?.['736x']) results.push(pin.images['736x'].url) })
        bookmark = jsonResponse.resource_response.bookmark
        if (!bookmark || pins.length === 0) keepFetching = false
      } else keepFetching = false
    }
    return results.slice(0, limit)
  } catch (e) {
    throw new Error(e.message)
  }
}

async function sendCustomPedido(m, conn, texto) {
  try {
    const img = 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763343577509_839557.jpeg'
    const res = await axios.get(img, { responseType: 'arraybuffer' })
    const imgBuffer = Buffer.from(res.data)

    const orderMessage = {
      orderId: 'FAKE-' + Date.now(),
      thumbnail: imgBuffer,
      itemCount: 1,
      status: 1,
      surface: 1,
      message: texto,
      orderTitle: 'Pinterest Bot',
      token: null,
      sellerJid: null,
      totalAmount1000: '0',
      totalCurrencyCode: 'GTQ',
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: '',
          thumbnailUrl: img,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }

    const msg = generateWAMessageFromContent(m.chat, { orderMessage }, { quoted: m })
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  } catch (err) {
    console.error(err)
    m.reply('⚠️ Error enviando el pedido.', m)
  }
}

let handler = async (m, { conn, args, rcanal }) => {
  try {
    const text = args.join(' ')
    if (!text) return sendCustomPedido(m, conn, '*🌳* `Por favor, ingresa lo que deseas buscar en Pinterest.`')

    const parts = text.split(',')
    const query = parts[0].trim()
    const limit = parts[1] ? Math.min(parseInt(parts[1].trim()), 12) : 12

    const res = await searchPinterestAPI(query, limit)
    if (!res.length) return sendCustomPedido(m, conn, `⚠️ No se encontraron resultados para "${query}".`)

    const medias = res.map(url => ({ type: 'image', data: { url } }))
    await sendAlbumMessage(conn, m.chat, medias, { caption: `🌿 Resultados de Pinterest - "${query}"`, quoted: m })

  } catch (e) {
    return sendCustomPedido(m, conn, `⚠️ Se produjo un error:\n${e.message}`)
  }
}

handler.help = ['pin']
handler.tags = ['search']
handler.command = ['pin', 'pinterest']
export default handler