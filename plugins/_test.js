import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  let url = args[0]

  if (!url && m.quoted && m.quoted.mimetype?.includes("image")) {
    const img = await m.quoted.download()
    const up = await conn.uploadFile(img)
    url = up.url || up
  }

  if (!url) return m.reply("❗ Envía una imagen o un link.\n\nEjemplo:\n.unblur <link>\nO responde a una imagen con: `.unblur`")

  try {
    await m.reply("🌀 *Mejorando imagen, espera...*")

    const api = `https://akirax-api.vercel.app/tools/unblur?url=${encodeURIComponent(url)}`
    const res = await fetch(api)
    const data = await res.json()

    if (!data.status) throw "❌ No se pudo procesar la imagen."

    const output = data.result.output

    await conn.sendMessage(
      m.chat,
      { image: { url: output }, caption: `✨ Imagen mejorada con éxito` },
      { quoted: m }
    )

  } catch (e) {
    console.log(e)
    m.reply("❌ Error al mejorar la imagen.")
  }
}

handler.help = ["unblur"]
handler.tags = ["tools"]
handler.command = ["unblur"]

export default handler