import fetch from "node-fetch"

let handler = async (m, { conn, text, command }) => {

  if (!text) return m.reply(`🎋 *Uso correcto:*\n.${command} <tema>\n\nEjemplo:\n.${command} itachi`)
  
  await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } })

  await m.reply("🔎 Buscando fondos 4K, espera un momento...")

  const total = 15
  const query = encodeURIComponent(text)
  const url = `https://wallhaven.cc/api/v1/search?q=${query}&categories=111&purity=100&atleast=3840x2160&sorting=random&order=desc`

  try {
    const res = await fetch(url)
    const json = await res.json()

    const wallpapers = json.data.slice(0, total)
    if (!wallpapers.length)
      return m.reply("⚠️ No encontré fondos, intenta otro nombre.")

    await conn.sendFile(
      m.chat,
      wallpapers[0].path,
      "wallpaper.jpg",
      `🌲 *Wallpaper Search* 🪺\n\n❄️ Tema: *${text}*\n🌿 Resultados: *${wallpapers.length}*`,
      m
    )

    for (let i = 1; i < wallpapers.length; i++) {
      await conn.sendFile(m.chat, wallpapers[i].path, "wallpaper.jpg", null, m)
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

   // await m.reply(`🌱 Se enviaron *${wallpapers.length} fondos 4K* de *${text}*.`)

  } catch (e) {
    console.error(e)
    m.reply("❄️ Ocurrió un error al buscar fondos.")
  }
}

handler.help = ['wallpaper']
handler.command = ['wallpaper', 'fondos', 'wall']
handler.tags = ['buscador']
handler.group = true

export default handler