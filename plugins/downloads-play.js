import fetch from "node-fetch"
import yts from "yt-search"

const handler = async (m, { conn, text, usedPrefix, command }) => {
try {
if (!text.trim()) return conn.reply(
m.chat,
`*🪴 Por favor, ingresa el nombre de la música a descargar.*`,
m,
rcanal
)

await m.react('🕒')
const videoMatch = text.match(
/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/))([a-zA-Z0-9_-]{11})/
)

const query = videoMatch
? 'https://youtu.be/' + videoMatch[1]
: text

const search = await yts(query)
const result = videoMatch
? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0]
: search.all[0]

if (!result) throw 'ꕥ No se encontraron resultados.'

const { title, thumbnail, timestamp, views, ago, url, author } = result
const vistas = formatViews(views)

const info = `🌱 *Resultado encontrado*

> ◦ 🎵 *Título:* ${title}
> ◦ 👤 *Canal:* ${author.name}
> ◦ 👁️ *Vistas:* ${vistas}
> ◦ ⏱️ *Duración:* ${timestamp}
> ◦ 📅 *Publicado:* ${ago}
> ◦ 🔗 *Link:* ${url}

${global.dev}`

const thumb = (await conn.getFile(thumbnail)).data
conn.sendMessage(
m.chat,
{ image: thumb, caption: info },
{ quoted: m }
)

if (['play', 'mp3'].includes(command)) {

const audio = await getAud(url)
if (!audio?.url) throw '⚠ No se pudo obtener el audio.'

await conn.sendMessage(
m.chat,
{
audio: { url: audio.url },
fileName: `${title}.mp3`,
mimetype: 'audio/mpeg'
},
{ quoted: m }
)

await m.react('✔️')
}

else if (['play2', 'mp4'].includes(command)) {

const video = await getVid(url)
if (!video?.url) throw '⚠ No se pudo obtener el video.'

await conn.sendFile(
m.chat,
video.url,
`${title}.mp4`,
`🌱 ${title}`,
m
)

await m.react('✔️')
}

} catch (e) {
await m.react('✖️')
return conn.reply(
m.chat,
typeof e === 'string'
? e
: `⚠︎ Error inesperado\n> Usa *${usedPrefix}report*\n\n${e.message}`,
m
)
}}

handler.command = handler.help = ['play', 'mp3', 'play2', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

async function getAud(url) {
const apis = [
{
api: 'Adonix',
endpoint: `${global.APIs.adonix.url}/download/ytaudio?apikey=${global.APIs.adonix.key}&url=${encodeURIComponent(url)}`,
extractor: res => res?.data?.url
},
{
api: 'Vreden',
endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/audio?url=${encodeURIComponent(url)}&quality=128`,
extractor: res => res?.result?.download?.url
}
]

for (const api of apis) {
try {
const res = await fetch(api.endpoint).then(r => r.json())
const link = api.extractor(res)
if (link) return { url: link }
} catch {
continue
}
}
return null
}

async function getVid(url) {
try {
const endpoint = `https://api.soymaycol.icu/ytdl?url=${encodeURIComponent(url)}&type=mp4&quality=720&apikey=may-1a3ecc37`
const res = await fetch(endpoint).then(r => r.json())
const link = res?.result?.url
if (!link) return null
return { url: link }
} catch {
return null
}
}

function formatViews(views) {
if (views === undefined) return "No disponible"
if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
return views.toString()
}