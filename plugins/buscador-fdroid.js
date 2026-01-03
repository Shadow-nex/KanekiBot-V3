import fetch from 'node-fetch'

let handler = async (m, { text, conn, command, usedPrefix }) => {
if (!text) return conn.reply(m.chat, `🌳 Ingresa lo que deseas buscar en *F-Droid*.\n\nEjemplo:\n> ${usedPrefix + command} termux`, m, rcanal)

try {
await m.react('🕒')
let api = await fetch(`${global.APIs.vreden.url}/api/v1/search/fdroid?query=${encodeURIComponent(text)}`)
let res = await api.json()

if (!res.result?.search_data?.length) {
await m.react('❓')
return conn.reply(m.chat, `✦ No se encontraron resultados para: *${text}*`, m)
}

let data = res.result.search_data
let count = res.result.count || data.length

let encabezado = `⎔ ʀᴇsᴜʟᴛᴀᴅᴏs ᴘᴀʀᴀ: *${text}*\n❐ ᴛᴏᴛᴀʟ: *${count}* ᴀᴘᴘꜱ \n`

let listado = data.map(v => {
return `꒰🫛 *${v.name}*
꒰🌾 *Descripción:* ${v.summary}
꒰🌱 *Licencia:* ${v.license}
꒰💥 *Link:* ${v.link}`
}).join('\n\n')

let thumb = data[0].icon ? data[0].icon : banner
await conn.sendFile(m.chat, thumb, 'fdroid.png', encabezado + listado, m)
await m.react('✔️')
} catch (e) {
await m.react('✖️')
conn.reply(m.chat, `⚠︎ Ocurrió un error inesperado.\n> Usa *${usedPrefix}report* para informarlo.\n\n` + e.message, m)
}
}

handler.help = ['fdroidsearch', 'fdroid']
handler.tags = ['search']
handler.command = ['fdroidsearch', 'searchfdroid']
handler.group = true
handler.register = true

export default handler