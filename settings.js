import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = "" //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
"51919199620",
"51971285104"
]

global.suittag = ["51919199620"] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = "Baileys Multi Device"
global.vs = "^1.8.2 • Latest"
global.nameqr = "ᴋᴀɴᴇᴋɪ-ʙᴏᴛ.ᴍᴅ"
global.sessions = "Sessions/Principal"
global.jadi = "Sessions/SubBot"
global.kanekiAIJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.botname = "🍏 𝙆𝙖𝙣𝙚𝙠𝙞𝘽𝙤𝙩-𝙑𝟯 🕸️"
global.textbot = "кαиєкι вσт ν3 • мα∂є ву ѕнα∂σω-χуz"
global.dev = "© ⍴᥆ᥕᥱrᥱძ ᑲᥡ 𝚂𝙷𝙰𝙳𝙾𝚆`°𝙲𝚘𝚛𝚎"
global.author = "© mᥲძᥱ ᥕі𝗍һ ᑲᥡ ѕнα∂σω`¢σяє"
global.etiqueta = "✫.ƚԋҽ ʂԋαԃσɯ ƈσɾҽ  ⊹꙰ "
global.currency = "¥enes"
global.banner = "https://i.pinimg.com/originals/90/c8/58/90c858c65f0b3b2fca9a226fa369aa2b.png"
//global.icono = "https://i.pinimg.com/originals/b3/67/d5/b367d513d861de468305c32c6cd22756.jpg"
global.catalogo = fs.readFileSync('./lib/catalogo.jpg')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.group = "https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f"
global.community = "https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f"
global.channel = "https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f"
global.github = "https://github.com/Shadow-nex/KanekiBot-V3"
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
siputzx: { url: "https://api.siputzx.my.id", key: null }
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'settings.js'"))
import(`${file}?update=${Date.now()}`)
})
