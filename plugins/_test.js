import fetch from "node-fetch"

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`✨ *Uso correcto:*\n.${command} <tema>\n\nEjemplo:\n.${command} itachi`)

  await m.reply("🔎 Buscando fondos 4K, espera un momento...")

  const total = 15

  const query = encodeURIComponent(text)
  const url = `https://wallhaven.cc/api/v1/search?q=${query}&categories=111&purity=100&atleast=3840x2160&sorting=random&order=desc`

  try {
    let res = await fetch(url)
    let json = await res.json()
    let wallpapers = json.data.slice(0, total)

    if (!wallpapers.length) return m.reply("⚠️ No encontré fondos, intenta otro nombre.")

    for (let img of wallpapers) {
      await conn.sendFile(m.chat, img.path, "wallpaper.jpg", `✨ Fondo de pantalla 4K\nTema: *${text}*`, m)
    }

    await m.reply(`📁 Se enviaron *${wallpapers.length} fondos 4K* de *${text}*.`)

  } catch (e) {
    console.error(e)
    m.reply("❌ Ocurrió un error al buscar fondos.")
  }
}

handler.help = ["fondos2 <tema>"]
handler.tags = ["internet"]
handler.command = /^fondos2?$/i

export default handler