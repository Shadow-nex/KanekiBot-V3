import fetch from 'node-fetch'

let handler = async (m, { conn, command, text, usedPrefix }) => {

if (!text) return m.reply(`*🪴 Ingresa un texto para generar tu logo.*

🪹 Ejemplo:
> *${usedPrefix + command} Miku*`)

let endpoint
switch (command) {
case '1917style':
endpoint = '1917style'
break

case 'advancedglow':
endpoint = 'advancedglow'
break

case 'blackpinklogo':
endpoint = 'blackpinklogo'
break

case 'blackpinkstyle':
endpoint= 'blackpinkstyle'
break

case 'cartoonstyle':
endpoint = 'cartoonstyle'
break

case 'deletingtext':
endpoint = 'deletingtext'
break

case 'effectclouds':
endpoint = 'effectclouds'
break

case 'flag3dtext':
endpoint = 'flag3dtext'
break

case 'flagtext':
endpoint = 'flagtext'
break

case 'freecreate':
endpoint = 'freecreate'
break

case 'galaxystyle':
endpoint = 'galaxystyle'
break

case 'galaxywallpaper':
endpoint = 'galaxywallpaper'
break

case 'glitchtext':
endpoint = 'glitchtext'
break

case 'glowingtext':
endpoint = 'glowingtext'
break

case 'gradienttext':
endpoint = 'gradienttext'
break

case 'lighteffects':
endpoint = 'lighteffects'
break

case 'logomaker':
endpoint = 'logomaker'
break

case 'luxurygold':
endpoint = 'luxurygold'
break

case 'makingneon':
endpoint = 'makingneon'
break

case 'neonglitch':
endpoint = 'neonglitch'
break

case 'papercutstyle':
endpoint = 'papercutstyle'
break

case 'pixelglitch':
endpoint = 'pixelglitch'
break

case 'royaltext':
endpoint = 'royaltext'
break

case 'sandsummer':
endpoint = 'sandsummer'
break

case 'summerbeach':
endpoint = 'summerbeach'
break

case 'typographytext':
endpoint = 'typographytext'
break

case 'underwatertext':
endpoint = 'underwatertext'
break

case 'watercolortext':
endpoint = 'watercolortext'
break

case 'writetext':
endpoint = 'writetext'
break

default:
return
}

try {
await m.react('⏳')
await conn.reply(m.chat,'*🍃 ᴄʀᴇᴀɴᴅᴏ ᴛᴜ ʟᴏɢᴏ, ᴇsᴘᴇʀᴀ ᴜɴ ᴍᴏᴍᴇɴᴛᴏ...*' , m)

let query = encodeURIComponent(text)
let url = `${global.APIs.vreden.url}/api/v1/maker/ephoto/${endpoint}?text=${query}`
let response = await fetch(url)
let data = await response.json()

if (!data.status || !data.result) throw 'No se pudo generar el logo'

const res3 = await fetch("https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766870164342_360832.jpeg")
const thumb3 = Buffer.from(await res3.arrayBuffer())
const shadow_log = {
key: { fromMe: false, participant: '0@s.whatsapp.net' },
message: {
documentMessage: {
title: '𝗟𝗢𝗚𝗢',
fileName: '🐛 𝗟𝗢𝗚𝗢 𝗖𝗥𝗘𝗔𝗗𝗢 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢',
jpegThumbnail: thumb3
}
}
}

await conn.sendMessage(
m.chat,
{
image: { url: data.result },
caption: `\`🌱 ᴀǫᴜɪ ᴛɪᴇɴᴇs ᴛᴜ ʟᴏɢᴏ\`\n\n> ${global.dev}`
},
{ quoted: shadow_log }
)

await m.react('✔️')

} catch (e) {
await m.react('❌')
return m.reply(`⚠️ *Ocurrió un error al crear el logo*
> Usa *${usedPrefix}report* para informarlo

📄 Error:
${e}`)
}}

handler.help = [
'1917style + texto',
'advancedglow + texto',
'blackpinklogo + texto',
'blackpinkstyle + texto',
'cartoonstyle + texto',
'deletingtext + texto',
'effectclouds + texto',
'flag3dtext + texto',
'flagtext + texto',
'freecreate + texto',
'galaxystyle + texto',
'galaxywallpaper + texto',
'glitchtext + texto',
'glowingtext + texto',
'gradienttext + texto',
'lighteffects + texto',
'logomaker + texto',
'luxurygold + texto',
'makingneon + texto',
'neonglitch + texto',
'papercutstyle + texto',
'pixelglitch + texto',
'royaltext + texto',
'sandsummer + texto',
'summerbeach + texto',
'typographytext + texto',
'underwatertext + texto',
'watercolortext + texto',
'writetext + texto'
]
handler.tags = ['maker', 'logo']
handler.command = ['1917style', 'advancedglow', 'blackpinklogo', 'blackpinkstyle', 'cartoonstyle', 'deletingtext', 'effectclouds', 'flag3dtext', 'flagtext', 'freecreate', 'galaxystyle', 'galaxywallpaper', 'glitchtext', 'glowingtext', 'gradienttext', 'lighteffects', 'logomaker', 'luxurygold', 'makingneon', 'neonglitch', 'papercutstyle', 'pixelglitch', 'royaltext', 'sandsummer', 'summerbeach', 'typographytext', 'underwatertext', 'watercolortext', 'writetext']
handler.group = true
handler.register = true

export default handler