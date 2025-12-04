import fs from 'fs'
import fetch from 'node-fetch'

let apkSession = new Map()

let handler = async (m, { conn, text, usedPrefix, command }) => {

 
  if (command === 'apk2') {
    if (!text)
      return conn.reply(m.chat, `❗ Ingresa un nombre de app\nEjemplo:\n${usedPrefix}apk2 WhatsApp`, m)

    try {
      await m.react('🔍')

      const res = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`)
      const json = await res.json()

      if (!json.status || !json.data) throw new Error("No se encontraron aplicaciones.")

      let results = json.data.results || [json.data] // por si solo devuelve 1

      if (!Array.isArray(results)) results = [results]

  
      apkSession.set(m.chat, results)

      let msg = `🌱 *Resultados encontrados para:* ${text}\n\n`
      results.forEach((app, i) => {
        msg += `*${i + 1}.* ${app.name}\n   📦 ${app.id}\n   ⭐ ${app.stats?.rating?.average || "N/A"}\n   ⚖️ ${app.size}\n\n`
      })

      msg += `📥 *Escribe el número de la app para descargar el APK.*\nEjemplo: 1`

      await m.react('✅')
      return conn.sendMessage(m.chat, { text: msg }, { quoted: m })

    } catch (e) {
      console.log(e)
      await m.react('❌')
      return conn.reply(m.chat, `❌ Error: ${e.message}`, m)
    }
  }

 
  if (command === 'apkget') {
    return conn.reply(m.chat, `Usa así:\n${usedPrefix}apk2 WhatsApp`, m)
  }

  // Si el usuario envía un número después de buscar apps
  if (/^\d+$/.test(m.text)) {
    let results = apkSession.get(m.chat)
    if (!results) return

    let index = parseInt(m.text) - 1
    let app = results[index]

    if (!app)
      return conn.reply(m.chat, `❗ Número inválido.`, m)

    try {
      await m.react('⌛')

      await conn.sendMessage(
        m.chat,
        {
          document: { url: app.download },
          fileName: `${app.name}.apk`,
          mimetype: 'application/vnd.android.package-archive',
          caption: `📦 *${app.name}*`
        },
        { quoted: m }
      )

      await m.react('☑️')

    } catch (err) {
      console.log(err)
      await m.react('❌')
      conn.reply(m.chat, `❌ No se pudo descargar el APK.`, m)
    }
  }
}

handler.tags = ['descargas']
handler.help = ['apk2 <nombre>']
handler.command = ['apk2', 'apkget']

export default handler