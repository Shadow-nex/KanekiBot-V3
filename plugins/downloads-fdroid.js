import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `🌿 Ingresa el enlace del paquete de F-Droid.\n\nEjemplo:\n> ${usedPrefix + command} https://f-droid.org/en/packages/com.termux`, m, rcanal)

try {
await m.react('🕒')

let api = await fetch(`${global.APIs.vreden.url}/api/v1/download/fdroid?url=${encodeURIComponent(text)}`)
let res = await api.json()

if (!res.result) {
await m.react('❌')
return conn.reply(m.chat, `✦ No se pudo obtener información del paquete.`, m)
}

let { name, summary, versions } = res.result

let latest = versions[0]
if (!latest) return conn.reply(m.chat, `⚠ No se encontraron versiones disponibles.`, m)

let info = ` 🎇☃️  𝐅𝐃𝐑𝐎𝐈𝐃 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 🦌🎄
🍃 *Nombre:* ${name}
🍄 *Versión:* ${latest.version}
✨ *Tamaño:* ${latest.size}
🌸 *Requiere:* ${latest.requirements}

🜸 *Descripción:* ${summary}
                🎅
🌿 *Descargando APK...*
`

await conn.reply(m.chat, info, m, rcanal)

let apk = await fetch(latest.link)
let buff = await apk.buffer()

await conn.sendMessage(m.chat, {
document: buff,
fileName: `${name}.apk`,
mimetype: 'application/vnd.android.package-archive'
}, { quoted: fkontak })

await m.react('✔️')

} catch (e) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ Error al descargar.\n> Usa *${usedPrefix}report* para informarlo.\n\n` + e.message, m)
}
}

handler.help = ['fdroid']
handler.tags = ['download']
handler.command = ['fdroidapk', 'apkfdroid', 'fdapk', 'fdroid']
handler.group = true
handler.register = true

export default handler