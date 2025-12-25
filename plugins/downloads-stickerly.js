import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import { sticker } from "../lib/sticker.js"

const API_STICKERLY = "https://delirius-apiofc.vercel.app/download/stickerly"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0])
    return m.reply(
      `🍧 Ingresa la URL de un pack de *Stickerly*.\n\n🌱 Ejemplo:\n> ${usedPrefix + command} https://sticker.ly/s/4I2FC0`
    )

  await m.react("🕓")

  try {
    const res = await fetch(`${API_STICKERLY}?url=${encodeURIComponent(args[0])}`)
    if (!res.ok) throw new Error(`❌ Error al conectar con la API (${res.status})`)
    const json = await res.json()

    if (!json.status || !json.data || !json.data.stickers?.length)
      throw new Error("⚠️ No se pudo obtener el pack. Verifica el enlace.")

    const data = json.data

    const info = `⿻ STICKERLY - DOWNLOADS\n\n◌ *Nombre* › ${data.name}\n◌ *Usuario* ${data.username}\n◌ *Followers* ${data.followers}\n◌ *Autor* › ${data.author}\n◌ *Stickers* › ${data.total}\n◌ *Vistas* › ${data.viewCount}\n◌ *Exportados* › ${data.exportCount}\n◌ *Animado* › ${data.isAnimated ? "Sí" : "No"}\n◌ *Enlace* › ${data.url}`.trim()

    await conn.sendMessage(
      m.chat,
      {
        text: info,
        contextInfo: {
          externalAdReply: {
            title: `${data.name}`,
            body: `🍃 Autor: ${data.author || "Desconocido"} • ${data.total} stickers`,
            thumbnailUrl: data.preview,
            sourceUrl: data.url,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    )

    let success = 0
    let failed = 0

    for (const stick of data.stickers) {
      try {
        const imgRes = await fetch(stick)
        if (!imgRes.ok) throw new Error("No se pudo descargar el sticker")

        const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
        const stickerBuf = await sticker(imgBuffer, false, data.name, data.author)

        await conn.sendMessage(m.chat, { sticker: stickerBuf }, { quoted: m })
        success++
        await new Promise((resolve) => setTimeout(resolve, 600))
      } catch (err) {
        failed++
        console.log("⚠️ Error con un sticker:", err.message)
      }
    }

    await m.react("✅")

    m.reply(`🌱 *Descarga completada*\n🌾 *Stickers enviados:* ${success}\n🚩 *Fallidos:* ${failed}`)

  } catch (e) {
    console.error("❌ Error general:", e)
    m.reply("⚠️ Error al descargar los stickers del pack. Intenta con otro enlace.")
    await m.react("❌")
  }
}

handler.help = ["stickerlydl <url>"]
handler.tags = ["sticker", "download"]
handler.command = ["stickerlydl", "stickerpack", "dls"]
handler.group = true

export default handler