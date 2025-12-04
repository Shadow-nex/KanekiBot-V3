import fetch from "node-fetch"

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `*❗ Ingresa una búsqueda*\nEjemplo:\n${usedPrefix + command} whatsapp`, m)

  try {
    await m.react('🔎')

    const url = `https://api.delirius.store/search/ani1?query=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const json = await res.json()

    if (!json.estado || !json.datos?.length) {
      return conn.reply(m.chat, `😿 *No encontré resultados para:* ${text}`, m)
    }

    let results = json.datos
    let msg = `*🔍 Resultados de búsqueda para:* _${text}_\n\n`

    results.forEach((item, index) => {
      msg += `*${index + 1}* ➤ ${item.nombre || item.name}\n`
      msg += `📌 *Versión:* ${item.versión}\n`
      msg += `📱 *Android:* ${item.sistema}\n`
      msg += `⭐ *Rating:* ${item.calificación}\n`
      msg += `📥 Descargar: enviar *${index + 1}*\n\n`
    })

    msg += `🟢 *Responde con el número del APK que deseas descargar.*`


    conn.an1Search = conn.an1Search || {}
    conn.an1Search[m.sender] = results

    await conn.reply(m.chat, msg, m, {
      mentions: [m.sender],
      contextInfo: {
        isForwarded: true
      }
    })

    conn.awaitReply(m.chat, m, {
      pattern: /^[0-9]+$/,
      command,
      text,
    })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "Error al buscar resultados.", m)
  }
}

handler.before = async (m, { conn }) => {
  if (!conn.an1Search) return
  if (!conn.an1Search[m.sender]) return
  if (!/^[0-9]+$/.test(m.text)) return

  let num = parseInt(m.text)
  let list = conn.an1Search[m.sender]

  if (num < 1 || num > list.length) {
    return conn.reply(m.chat, "❗ Número inválido.", m)
  }

  let app = list[num - 1]

  let info = `*📲 ${app.nombre || app.name}*\n
🔹 *Versión:* ${app.versión}
🔹 *Tamaño:* ${app.tamaño}
🔹 *Android:* ${app.sistema}
🔹 *Rating:* ${app.calificación} (${app.voto} votos)
🔹 *Desarrollador:* ${app.desarrollador}

📄 *Descripción:* 
${app.description || app.Descripción || "Sin descripción disponible."}

📥 *Descargar APK:* 
${app.descargar}
`

  await m.react("✅")
  await conn.sendMessage(m.chat, { image: { url: app.imagen }, caption: info }, { quoted: m })

  delete conn.an1Search[m.sender]
}

handler.help = ["anisearch <texto>"]
handler.tags = ["apk"]
handler.command = ["anisearch"]

export default handler