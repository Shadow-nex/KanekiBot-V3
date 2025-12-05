/*
    * Create By Brayan330
    * Follow https://github.com/El-brayan502 
    * Whatsapp : https://whatsapp.com/channel/0029Vb6BDQc0lwgsDN1GJ31i
*/

import https from 'https'
import baileys, { generateWAMMessageFromContent } from '@whiskeysockets/baileys'
import axios from 'axios'

function isPinterestUrl(text) {
  return /(https?:\/\/)?(www\.)?(ar\.)?pinterest\.[a-z]+\/pin\/\d+/i.test(text)
}

async function downloadPinterest(url) {
  try {
    const api = `https://api.delirius.store/download/pinterest?url=${encodeURIComponent(url)}`
    const res = await axios.get(api)
    if (!res.data || !res.data.status) throw new Error("Link inválido")

    return res.data.data // → { type, url, title }
  } catch {
    throw new Error("No se pudo descargar el contenido de Pinterest.")
  }
}

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

let handler = async (m, { conn, args }) => {
  try {
    const text = args.join(' ')
    if (!text) return sendCustomPedido(m, conn, '*🌳* `Ingresa lo que deseas buscar en Pinterest.`')

    // ⚡ NUEVO: si es link → descarga directa
    if (isPinterestUrl(text)) {
      try {
        await m.react('⬇️')

        const data = await downloadPinterest(text)

        if (data.type === "image") {
          await conn.sendFile(m.chat, data.url, 'img.jpg', '🌿 Imagen de Pinterest', m)
        } else if (data.type === "gif") {
          await conn.sendFile(m.chat, data.url, 'file.gif', '🎞 GIF de Pinterest', m)
        } else if (data.type === "video") {
          await conn.sendFile(m.chat, data.url, 'video.mp4', '🎥 Video de Pinterest', m)
        } else {
          return m.reply("⚠️ No se reconoció el tipo de archivo.")
        }

        return
      } catch (e) {
        return sendCustomPedido(m, conn, `⚠️ Error al descargar:\n${e.message}`)
      }
    }

    const parts = text.split(',')
    const query = parts[0].trim()
    const limit = parts[1] ? Math.min(parseInt(parts[1].trim()), 12) : 12

    const res = await searchPinterestAPI(query, limit)
    if (!res.length) return sendCustomPedido(m, conn, `⚠️ No se encontraron resultados para "${query}".`)

    const medias = res.map(url => ({ type: 'image', data: { url } }))
    await sendAlbumMessage(conn, m.chat, medias, { caption: `🌿 Resultados de Pinterest - "${query}"`, quoted: m })

  } catch (e) {
    return sendCustomPedido(m, conn, `⚠️ Error inesperado:\n${e.message}`)
  }
}

handler.help = ['pin']
handler.tags = ['search']
handler.command = ['pin', 'pinterest']
export default handler