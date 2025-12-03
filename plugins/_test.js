import fetch from "node-fetch"
import FormData from "form-data"

let handler = async (m, { conn, isOwner, usedPrefix, command }) => {
  if (!isOwner) return m.reply("❌ Solo el owner puede usar este comando.")

  if (!m.quoted || !m.quoted.mime) 
    return m.reply(`📸 *Responde a una imagen para usar este comando.*`)

  let mime = m.quoted.mime
  if (!/image\/(jpe?g|png)/.test(mime))
    return m.reply("⚠️ El archivo debe ser una imagen JPG o PNG.")

  try {
    let img = await m.quoted.download()
    if (!img) return m.reply("❌ No pude descargar la imagen.")

    // Subir a Catbox
    let form = new FormData()
    form.append("reqtype", "fileupload")
    form.append("userhash", "") // opcional
    form.append("fileToUpload", img, "banner.jpg")

    let upload = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: form
    })

    let url = await upload.text()
    if (!url.startsWith("https://")) 
      return m.reply("❌ Error al subir la imagen a Catbox.")

    global.banner = url.trim()

    m.reply(`✅ *Banner actualizado correctamente*\n\n📌 **Nuevo banner:**\n${global.banner}`)
  } catch (e) {
    console.error(e)
    m.reply("⚠️ Ocurrió un error inesperado.")
  }
}

handler.command = ["setbanner"]
handler.owner = true

export default handler