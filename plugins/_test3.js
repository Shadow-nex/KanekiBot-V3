/*
> Play
By *JTxs*

> ₊·( ✿ ) *g𐐲upᦅ »*
https://chat.whatsapp.com/BTjlRCGYgJrDzHf9dGUSwY 

> ₊·( ✿ ) *cα𝗇α𝗅𝖾s »*
*🜸 hαsumꪱ - bᦅł - Chα𝗇𝗇𝖾𝗅 ✿ »* https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n
*🜸 hαsumꪱ - bᦅł  木 Cᦅdᧉs - Chα𝗇𝗇𝖾𝗅 ✿ »* https://whatsapp.com/channel/0029VbC5WdJAu3aUfqRb091e
*( 木 ) Kᦅ𝗅𝖾dα  - bᦅł »* https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W
*/

import yts from "yt-search"
import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import os from "os"

let HS = async (m, { conn, args, text, command }) => {
let isDoc = /--doc|doc$/i.test(text || args[0])

if (!args[0] || (isDoc && !text.replace(/--doc|doc$/i, '').trim())) {
return conn.reply(m.chat, `\`»\` Ingresa un texto o link de YouTube\n\n\`»\` *.${command} --doc* para enviar como documento`, m)
}
   
let audioPath
try {
let res = await search(args.join(" "))

let txt = `\`✿\`  ${res[0].title || 'Sin título'}

✰ *Duracion »* ${res[0].timestamp}
⚘ *Canal »* ${res[0].author.name || 'Desconocido'}
❒ *Calidad »* 128K
❀ *Link »* ${res[0].url}`

await conn.sendMessage(m.chat, { image: { url: res[0].thumbnail }, caption: txt }, { quoted: m })

let dl = await yt.download(res[0].url)
let fileName = `${res[0].title}.mp3`
audioPath = await downloadToTmp(dl.downloadUrl, fileName)

if (isDoc) {
await conn.sendMessage(m.chat, { document: fs.readFileSync(audioPath), fileName, mimetype: "audio/mpeg" }, { quoted: m })
} else {
await conn.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: "audio/mpeg", fileName }, { quoted: m })
}

} catch (error) {
console.error(error)
} finally {
if (audioPath && fs.existsSync(audioPath)) {
fs.unlinkSync(audioPath)
}}}

HS.help = ["play1 + [texto]"]
HS.tags = ["dl"]
HS.command = ["play1", "ytplay"]

export default HS

async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl: "ES", ...options })
  return search.videos
}

const TMP_DIR = path.join(process.cwd(), "tmp")

if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true })
}

async function downloadToTmp(url, filename) {
    const filePath = path.join(TMP_DIR, filename)

    const res = await fetch(url)
    if (!res.ok) throw new Error("Error descargando el audio")

    const stream = fs.createWriteStream(filePath)
    await new Promise((resolve, reject) => {
        res.body.pipe(stream)
        res.body.on("error", reject)
        stream.on("finish", resolve)
    })
    return filePath
}


const yt = {
    url: Object.freeze({
        audio128: "https://api.apiapi.lat",
        video: "https://api5.apiapi.lat",
        else: "https://api3.apiapi.lat",
        referrer: "https://ogmp3.pro/"
    }),

    encUrl: s => s.split("").map(c => c.charCodeAt()).reverse().join(";"),
    xor: s => s.split("").map(v => String.fromCharCode(v.charCodeAt() ^ 1)).join(""),
    genRandomHex: () =>
        Array.from({ length: 32 }, () =>
            "0123456789abcdef"[Math.floor(Math.random() * 16)]
        ).join(""),

    init: async function (rpObj) {
        const { apiOrigin, payload } = rpObj
        const api =
            apiOrigin +
            "/" +
            this.genRandomHex() +
            "/init/" +
            this.encUrl(this.xor(payload.data)) +
            "/" +
            this.genRandomHex() +
            "/"

        const r = await fetch(api, {
            method: "post",
            body: JSON.stringify(payload)
        })

        if (!r.ok) throw new Error(await r.text())
        return r.json()
    },

    genFileUrl: function (i, pk, rpObj) {
        const { apiOrigin } = rpObj
        const pkValue = pk ? pk + "/" : ""
        const downloadUrl =
            apiOrigin +
            "/" +
            this.genRandomHex() +
            "/download/" +
            i +
            "/" +
            this.genRandomHex() +
            "/" +
            pkValue
        return { downloadUrl }
    },

    statusCheck: async function (i, pk, rpObj) {
        const { apiOrigin } = rpObj
        let json
        let count = 0

        do {
            await new Promise(r => setTimeout(r, 5000))
            count++

            const pkVal = pk ? pk + "/" : ""
            const api =
                apiOrigin +
                "/" +
                this.genRandomHex() +
                "/status/" +
                i +
                "/" +
                this.genRandomHex() +
                "/" +
                pkVal

const r = await fetch(api, {
method: "post",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ data: i })
})

if (!r.ok) throw new Error(await r.text())
json = await r.json()

if (count >= 100)
throw new Error("pooling alcanzó 100 intentos")
} while (json.s === "P")

        if (json.s === "E") throw new Error(JSON.stringify(json))
        return this.genFileUrl(i, pk, rpObj)
    },

    resolvePayload: function (ytUrl, userFormat) {
        const valid = [
            "64k",
            "96k",
            "128k",
            "192k",
            "256k",
            "320k",
            "240p",
            "360p",
            "480p",
            "720p",
            "1080p"
        ]
        if (!valid.includes(userFormat))
            throw Error(`Formato inválido. Opciones: ${valid.join(", ")}`)

        let apiOrigin = this.url.audio128
        let data = this.xor(ytUrl)
        let referer = this.url.referrer
        let format = "0"
        let mp3Quality = "128"
        let mp4Quality = "720"

        if (/^\d+p$/.test(userFormat)) {
            apiOrigin = this.url.video
            format = "1"
            mp4Quality = userFormat.replace("p", "")
        } else if (userFormat !== "128k") {
            apiOrigin = this.url.else
            mp3Quality = userFormat.replace("k", "")
        }

        return {
            apiOrigin,
            payload: {
                data,
                format,
                referer,
                mp3Quality,
                mp4Quality,
                userTimeZone: "-480"
            }
        }
    },

    download: async function (url, fmt = "128k") {
        const rpObj = this.resolvePayload(url, fmt)
        const initObj = await this.init(rpObj)
        const { i, pk, s } = initObj

        if (s === "C") return this.genFileUrl(i, pk, rpObj)
        return this.statusCheck(i, pk, rpObj)
    }
}