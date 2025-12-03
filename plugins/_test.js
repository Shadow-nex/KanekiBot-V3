// videomp3.js
import ffmpeg from "fluent-ffmpeg"
import { PassThrough } from "stream"

let handler = async (m, { conn }) => {
  try {
    // detectar video enviado o citado
    const q = m.quoted || m
    const mime = q.mtype || ""

    if (!/video/.test(mime))
      return m.reply("🎥 *Envía o cita un video para convertirlo a MP3.*")

    await m.react?.("🔄")

    // descargar video como buffer
    const videoBuffer = await conn.downloadMediaMessage(q)

    // convertir el buffer a un stream
    const inputStream = new PassThrough()
    inputStream.end(videoBuffer)

    // salida en memoria
    const outputStream = new PassThrough()
    let audioChunks = []

    outputStream.on("data", (chunk) => audioChunks.push(chunk))

    const convert = () =>
      new Promise((resolve, reject) => {
        ffmpeg(inputStream)
          .audioCodec("libmp3lame")
          .audioBitrate("96k") // baja calidad
          .format("mp3")
          .on("error", reject)
          .on("end", resolve)
          .pipe(outputStream, { end: true })
      })

    await convert()

    const mp3Buffer = Buffer.concat(audioChunks)

    // enviar audio
    await conn.sendMessage(m.chat, {
      audio: mp3Buffer,
      mimetype: "audio/mpeg",
      fileName: "audio.mp3",
    }, { quoted: m })

    await m.react?.("✅")

  } catch (err) {
    console.error(err)
    m.reply("❌ Error al convertir el video.")
  }
}

handler.help = ["tomp3"]
handler.command = ["tomp3"]
export default handler