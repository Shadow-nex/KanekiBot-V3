import { watchFile, unwatchFile } from "fs"
import chalk from "chalk"
import { fileURLToPath } from "url"
import fs from "fs"

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.botNumber = ""  //Ejemplo: 51919199620

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
"51919199620",  //  ׄ 몽🎄 ۪sһᥲძ᥆ᥕ.᥊ᥡz 🌿ᰫ
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

global.botname = " ۫  🌱੭  ׅ  𝐌𝐢𝐤𝐮 𝐈𝐳𝐚𝐲𝐨𝐢 - 𝐀𝐈 ׁ ♡ ⸼"
global.textbot = "₊˚ᴍɪᴋᴜ ɪᴢᴀʏᴏɪ, mᥲძᥱ ᥕі𝗍һ ᑲᥡ sһᥲძ᥆ᥕ.᥊ᥡz˙ꨂﾟ"
global.dev = "°𓃉𐇽ܳお sʜᴀᴅᴏᴡ's xʏᴢ 彡✫"
global.author = "© mᥲძᥱ ᥕі𝗍һ ᑲᥡ shadow.xz"
global.etiqueta = "✫ shadow.xyz "
global.currency = "¥enes"
global.banner = "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766703205423_195279.jpeg"
global.icono = "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766617406305_472904.jpeg"
global.logo = "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1766707384900_16383.jpeg"

global.catalogo = fs.readFileSync('./lib/catalogo.jpg')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.group = "https://chat.whatsapp.com/FvKyGFv5i1s8Dj2XAQ74WT?mode=hqrt1"
global.community = "https://chat.whatsapp.com/FvKyGFv5i1s8Dj2XAQ74WT?mode=hqrt1"
global.channel = "https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f"
global.github = "https://github.com/shadox-xyz/KanekiBot-V3"
global.gmail = "shadowcore.xyz@gmail.com"
global.ch = {
ch1: "120363422142340004@newsletter"
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.APIs = {
yupra: { url: "https://api.yupra.my.id", key: null },
vreden: { url: "https://api.vreden.web.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
zenzxz: { url: "https://api.zenzxz.my.id", key: null },
adonix: { url: "https://api-adonix.ultraplus.click", key: 'shadow.xyz' },
stellar: { url: "https://api.stellarwa.xyz", key: "this-xyz"}
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.redBright("Update 'settings.js'"))
import(`${file}?update=${Date.now()}`)
})
