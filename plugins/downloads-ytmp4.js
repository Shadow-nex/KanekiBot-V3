import axios from "axios"
import fetch from "node-fetch"
import { sizeFormatter } from "human-readable"

let calidadPredeterminada = "360"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {

    if (command === "setcalidad" || command === "setquality") {
      const calidad = text.trim()

      if (!calidad)
        return m.reply(
          `🌱 *Debes especificar la calidad de descarga.*\n\n🌿 Ejemplo:\n${usedPrefix + command} 720`
        )

      const opciones = ["144", "240", "360", "480", "720", "1080"]
      if (!opciones.includes(calidad))
        return m.reply(`🎋 *Calidad inválida.* Usa una de estas:\n> ${opciones.join("p, ")}p`)

      calidadPredeterminada = calidad
      return m.reply(`✅ *Calidad predeterminada actualizada a:* ${calidad}p`)
    }

    if (command === "ytmp4") {
      if (!text)
        return conn.reply(
          m.chat,
          `🍷 *Ingresa el enlace de YouTube que deseas descargar en formato MP4.*\n\n👻 Ejemplo:\n${usedPrefix + command} https://youtu.be/HWjCStB6k4o`,
          m
        )

      await conn.reply(
        m.chat,
        `☁️ *Procesando tu solicitud...*\n🕸️ Calidad actual: *${calidadPredeterminada}p*`,
        m
      )

      let apiUsada = "Vreden"
      let meta, dl, fileSize, sizeMB

      try {
        const apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(text)}&quality=${calidadPredeterminada}`
        const res = await axios.get(apiUrl)
        if (!res.data?.status) throw new Error("Fallo en la API principal")

        const result = res.data.result
        meta = result.metadata
        dl = result.download

        const head = await fetch(dl.url, { method: "HEAD" })
        const size = head.headers.get("content-length")
        const formatSize = sizeFormatter({ std: "JEDEC", decimalPlaces: 2 })
        fileSize = size ? formatSize(parseInt(size)) : "Desconocido"
        sizeMB = size ? parseInt(size) / 1024 / 1024 : 0

      } catch (e) {
        console.log("⚠️ Error en la API principal, intentando con la API de respaldo...")

        apiUsada = "Starlight"
        const backupUrl = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${encodeURIComponent(text)}&format=${calidadPredeterminada}p`
        const res2 = await axios.get(backupUrl)

        if (!res2.data?.dl_url) throw new Error("No se pudo obtener el enlace de descarga (API de respaldo)")

        meta = {
          title: res2.data.title,
          duration: { timestamp: "Desconocido" },
          author: { name: res2.data.author },
          views: "-",
          ago: "Desconocido",
          url: res2.data.url,
          thumbnail: res2.data.thumbnail,
        }

        dl = {
          url: res2.data.dl_url,
          filename: `${res2.data.title}.mp4`,
          quality: res2.data.quality,
        }

        const head = await fetch(dl.url, { method: "HEAD" })
        const size = head.headers.get("content-length")
        const formatSize = sizeFormatter({ std: "JEDEC", decimalPlaces: 2 })
        fileSize = size ? formatSize(parseInt(size)) : "Desconocido"
        sizeMB = size ? parseInt(size) / 1024 / 1024 : 0
      }

      const info = `🎶 *ＹＯＵＴＵＢＥ • ＭＰ4*  🍎
────────────────────
> °𓃉𐇽ܳ𓏸🎋ᮬᩬִּ〫᪲۟. 𝐓𝐢𝐭𝐮𝐥𝐨: *${meta.title}*
> °𓃉𐇽ܳ𓏸🌿ᮬᩬִּ〫᪲۟. 𝐃𝐮𝐫𝐚𝐜𝐢𝐨𝐧: *${meta.duration?.timestamp || meta.timestamp}*
> °𓃉𐇽ܳ𓏸🍏ᮬᩬִּ〫᪲۟. 𝐂𝐚𝐧𝐚𝐥: *${meta.author?.name || "-"}*
> °𓃉𐇽ܳ𓏸🍄ᮬᩬִּ〫᪲۟. 𝐕𝐢𝐬𝐭𝐚𝐬: *${meta.views?.toLocaleString() || "-"}*
> °𓃉𐇽ܳ𓏸⚽ᮬᩬִּ〫᪲۟. 𝐓𝐚𝐦𝐚𝐧̃𝐨: *${fileSize}*
> °𓃉𐇽ܳ𓏸☁️ᮬᩬִּ〫᪲۟. 𝐂𝐚𝐥𝐢𝐝𝐚𝐝: *${dl.quality}*
> °𓃉𐇽ܳ𓏸🌷ᮬᩬִּ〫᪲۟. 𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨: *${meta.ago}*
> °𓃉𐇽ܳ𓏸🕸️ᮬᩬִּ〫᪲۟. 𝐋𝐢𝐧𝐤: *${meta.url}*
> °𓃉𐇽ܳ𓏸⚙️ᮬᩬִּ〫᪲۟. 𝐒𝐞𝐫𝐯𝐢𝐝𝐨𝐫: *${apiUsada}*
────────────────────

> \`N O T A:\`
> ρєяѕσиαℓιzα ℓα ¢αℓι∂α∂ ∂єℓ νι∂єσ ¢σи /setquality`

  await conn.sendMessage(m.chat, {
    text:  info,
    mentions: [m.sender],
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        serverMessageId: '',
        newsletterName: channelRD.name
      },
      externalAdReply: {
        title: '🎬 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 - 𝗦𝗘𝗔𝗥𝗖𝗛 🏔️',
        body: '',
        thumbnailUrl: meta.thumbnail,
        sourceUrl: meta.url,
        mediaType: 1,
        renderLargerThumbnail: true
      },
     mentionedJid: null
    }
  }, { quoted: m })


      if (sizeMB > 100) {
        await conn.sendMessage(
          m.chat,
          {
            document: { url: dl.url },
            mimetype: "video/mp4",
            fileName: dl.filename,
            caption: `> *${meta.title}*\n> Tamaño: ${fileSize}\n> Calidad: ${dl.quality}\n> Servidor: ${apiUsada}\n> Enviado como documento (más de 100 MB).`,
          },
          { quoted: m }
        )
      } else {
        await conn.sendMessage(
          m.chat,
          {
            video: { url: dl.url },
            mimetype: "video/mp4",
            fileName: dl.filename,
            caption: `> 🎋 *${meta.title}*\n> *🍧 Tamaño:* ${fileSize}\n> ⚙️ *Calidad:* ${dl.quality}\n> ☁️ *Servidor:* ${apiUsada}`,
          },
          { quoted: m }
        )
      }
    }
  } catch (err) {
    console.error(err)
    conn.reply(
      m.chat,
      "❌ *Ocurrió un error al procesar tu solicitud.*\nVerifica el enlace o intenta con otro video.",
      m
    )
  }
}

handler.help = ["ytmp4 <url>", "setcalidad <valor>"]
handler.tags = ["descargas"]
handler.command = ["ytmp4", "setcalidad", "setquality"]

export default handler

/*



import fetch from "node-fetch"

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("🌿 Ingresa un enlace de *YouTube* para descargar el video.")

  try {
    m.react("⏳")

    // Nueva API
    let api = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${encodeURIComponent(text)}&format=360p`
    let res = await fetch(api)
    let json = await res.json()

    if (!json.dl_url) return m.reply("❌ No se pudo obtener el enlace de descarga. Intenta con otro video.")

    let { title, author, thumbnail, quality, dl_url } = json

    // Mensaje decorado
    let caption = `
╭━━━〔 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 𝐕𝐈𝐃𝐄𝐎 🎬 〕━━⬣
┃ 🌿 *Título:* ${title}
┃ 👤 *Autor:* ${author}
┃ 📹 *Calidad:* ${quality}
╰━━━━━━━━━━━━━━⬣
> 🧩 *Descarga completada con éxito.*
`

    await conn.sendMessage(m.chat, {
      video: { url: dl_url },
      caption,
      mimetype: "video/mp4",
      fileName: `${title}.mp4`,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: author,
          thumbnailUrl: thumbnail,
          sourceUrl: text,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    m.react("✅")

  } catch (e) {
    console.error(e)
    m.reply("⚠️ Error al procesar la descarga. Intenta nuevamente más tarde.")
    m.react("❌")
  }
}

handler.help = ["ytmp4"]
handler.tags = ["downloader"]
handler.command = ["ytmp4"]

export default handler*/