import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.botNumber = ""  //Ejemplo: 51919199620

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
"51919199620",  //   ׄ 몽🎄 ۪sһᥲძ᥆ᥕ.᥊ᥡz 🌿ᰫ
"51936592936",
"51934053286",
"573244418299"
]

global.suittag = ["51919199620"] 
global.prems = ["51919199620"]

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = "Baileys Multi Device"
global.vs = "^1.8.2 • Latest"
global.nameqr = "ᴋᴀɴᴇᴋɪ-ʙᴏᴛ.ᴍᴅ"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.kanekiAIJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.botname = "ㅤׁ෨ 🌾 𝙆𝙖𝙣𝙚𝙠𝙞𝘽𝙤𝙩-,𝘼𝙄 🌱. り"
global.textbot = "🌾 кαиєкι вσт ν3 • мα∂є ву sһᥲძ᥆ᥕ.᥊ᥡz"
global.dev = "© ⍴᥆ᥕᥱrᥱძ ᑲᥡ ׅ  ׄ 몽 ۪sһᥲძ᥆ᥕ.᥊ᥡz おịᰫ"
global.author = "© mᥲძᥱ ᥕі𝗍һ ᑲᥡ shadow.xz"
global.etiqueta = "✫ shadow.xyz "

global.currency = "¥enes"
global.banner = "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1764274989061_832350.jpeg"
global.icono2 = "https://i.pinimg.com/originals/b3/67/d5/b367d513d861de468305c32c6cd22756.jpg"
global.logo = "https://files.catbox.moe/9yxzua.jpg"

global.catalogo = fs.readFileSync('./lib/catalogo.jpg')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.group = "https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f"
global.community = "https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f"
global.channel = "https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f"
global.github = "https://github.com/shadox-xyz/KanekiBot-V3"
global.gmail = "shadowcore.xyz@gmail.com"
global.ch = {
ch1: "120363422142340004@newsletter"
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.APIs = {
xyro: { url: "https://xyro.site", key: null },
yupra: { url: "https://api.yupra.my.id", key: null },
vreden: { url: "https://api.vreden.web.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
zenzxz: { url: "https://api.zenzxz.my.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null },
adonix: { url: "https://api-adonix.ultraplus.click", key: 'the.shadow' }
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'configXD.js'"))
import(`${file}?update=${Date.now()}`)
})
