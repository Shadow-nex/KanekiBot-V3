import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix }) => {

  const detectarPais = (numero) => {
    const codigos = {
      "1": "🇺🇸 EE.UU / 🇨🇦 Canadá", "7": "🇷🇺 Rusia / 🇰🇿 Kazajistán",
      "20": "🇪🇬 Egipto", "27": "🇿🇦 Sudáfrica", "30": "🇬🇷 Grecia",
      "31": "🇳🇱 Países Bajos", "32": "🇧🇪 Bélgica", "33": "🇫🇷 Francia",
      "34": "🇪🇸 España", "36": "🇭🇺 Hungría", "39": "🇮🇹 Italia",
      "40": "🇷🇴 Rumania", "44": "🇬🇧 Reino Unido", "49": "🇩🇪 Alemania",
      "51": "🇵🇪 Perú", "52": "🇲🇽 México", "53": "🇨🇺 Cuba",
      "54": "🇦🇷 Argentina", "55": "🇧🇷 Brasil", "56": "🇨🇱 Chile",
      "57": "🇨🇴 Colombia", "58": "🇻🇪 Venezuela", "591": "🇧🇴 Bolivia",
      "593": "🇪🇨 Ecuador", "595": "🇵🇾 Paraguay", "598": "🇺🇾 Uruguay",
      "502": "🇬🇹 Guatemala", "503": "🇸🇻 El Salvador",
      "504": "🇭🇳 Honduras", "505": "🇳🇮 Nicaragua",
      "506": "🇨🇷 Costa Rica", "507": "🇵🇦 Panamá",
      "60": "🇲🇾 Malasia", "61": "🇦🇺 Australia", "62": "🇮🇩 Indonesia",
      "63": "🇵🇭 Filipinas", "64": "🇳🇿 Nueva Zelanda",
      "65": "🇸🇬 Singapur", "66": "🇹🇭 Tailandia",
      "81": "🇯🇵 Japón", "82": "🇰🇷 Corea del Sur", "84": "🇻🇳 Vietnam",
      "86": "🇨🇳 China", "90": "🇹🇷 Turquía", "91": "🇮🇳 India",
      "212": "🇲🇦 Marruecos", "213": "🇩🇿 Argelia",
      "216": "🇹🇳 Túnez", "218": "🇱🇾 Libia",
      "234": "🇳🇬 Nigeria", "254": "🇰🇪 Kenia",
      "255": "🇹🇿 Tanzania", "256": "🇺🇬 Uganda",
      "258": "🇲🇿 Mozambique", "260": "🇿🇲 Zambia",
      "263": "🇿🇼 Zimbabue"
    }

    for (const code in codigos) {
      if (numero.startsWith(code)) return codigos[code]
    }
    return "🌎 Desconocido"
  }

  try {
    let texto = await m.mentionedJid
    let userId = texto.length > 0 ? texto[0] : (m.quoted ? await m.quoted.sender : m.sender)
    let numero = userId.split("@")[0]
    let nacionalidad = detectarPais(numero)
    let waLink = `wa.me/${numero}`

    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.characters) global.db.data.characters = {}

    if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
    const user = global.db.data.users[userId]

    const name = await (async () => {
      try {
        const n = await conn.getName(userId)
        return (typeof n === 'string' && n.trim()) ? n : numero
      } catch {
        return numero
      }
    })()

    const cumpleanos = user.birth || 'Sin especificar :< (#setbirth)'
    const genero = user.genre || 'Sin especificar'
    const pareja = user.marry
    const casado = pareja ? (global.db.data.users[pareja]?.name || pareja.split("@")[0]) : 'Nadie'
    const description = user.description || 'Sin descripción :v'

    const exp = user.exp || 0
    const nivel = user.level || 0
    const coin = user.coin || 0
    const bank = user.bank || 0
    const total = coin + bank

    const sorted = Object.entries(global.db.data.users)
      .map(([k, v]) => ({ ...v, jid: k }))
      .sort((a, b) => (b.level || 0) - (a.level || 0))
    const rank = sorted.findIndex(u => u.jid === userId) + 1

    const progreso = (() => {
      let datos = xpRange(nivel, global.multiplier)
      return `${exp - datos.min} => ${datos.xp} _(${Math.floor(((exp - datos.min) / datos.xp) * 100)}%)_`
    })()
    const premium = user.premium || global.prems.map(v => v.replace(/\D+/g, '') + '@s.whatsapp.net').includes(userId)
    const isLeft = premium ? (global.prems.includes(userId.split('@')[0]) ? 'Permanente' : (user.premiumTime ? await formatTime(user.premiumTime - Date.now()) : '—')) : '—'
    const favId = user.favorite
    const favLine = (favId && global.db.data.characters[favId])
      ? `\n๑ Claim favorito » *${global.db.data.characters[favId].name}*`
      : ''

    const ownedIDs = Object.entries(global.db.data.characters)
      .filter(([, c]) => c.user === userId)
      .map(([id]) => id)

    const haremCount = ownedIDs.length
    const haremValue = ownedIDs.reduce((acc, id) => {
      const char = global.db.data.characters[id] || {}
      return acc + (char.value || 0)
    }, 0)

    const pp = await conn.profilePictureUrl(userId, 'image')
      .catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

    const text = `‿‿‿‿‿ㅤ⋱＼ ׅ    ֺ   ／ ⋆ ‿‿‿‿‿
✿ 𝖯𝖾𝗋𝖿𝗂𝗅 - ${name}
ᰔ \`\`\`${description}\`\`\`

> 𐇡𐇡 💣ᩧۣ  𓈒𓈒𓈒 𝖨𝗇𝖿𝗈 - 𝗎𝗌𝖾𝗋 𓈒ᰔ ִ
 ₊ *ᴄᴜᴍᴘʟᴇᴀɴ̃ᴏs :* ${cumpleanos}
 ₊ *ɢᴇɴᴇʀᴏ :* ${genero}
 ₊ *ᴄᴀsᴀᴅᴏ ᴄᴏɴ :* ${casado}
 ₊ *ᴇᴅᴀᴅ :* ${user.age || '𖠿 Desconocida'}
 ₊ *ɴᴀᴄɪᴏɴᴀʟɪᴅᴀᴅ :* ${nacionalidad}
 ₊ *ʟɪɴᴋ :* ${waLink}
 
 ₊ *ᴇxᴘᴇʀɪᴇɴᴄɪᴀ :* ${exp.toLocaleString()}
 ₊ *ɴɪᴠᴇʟ :* ${nivel}
 ₊ *ᴘᴜᴇsᴛᴏ :* ${rank}
 ₊ *ᴘʀᴏɢʀᴇsᴏ :* ${progreso}
 ₊ *ᴘʀᴇᴍɪᴜᴍ :* ${premium ? `✔️ (*${isLeft}*)` : '✖️'}
 ₊ *ʀᴇɢɪsᴛʀᴀᴅᴏ :* ${user.registered ? '✔ SI' : '✘ NO'}
 
 ₊ *ʜᴀʀᴇᴍ :* ${haremCount}
 ₊ *ᴠᴀʟᴏʀ ᴛᴏᴛᴀʟ :*  ${haremValue.toLocaleString()} / ${favLine}
 ₊ *ᴄᴏɪɴs ᴛᴏᴛᴀʟᴇs :* ${total.toLocaleString()} ${currency}
 ₊ *ᴄᴏᴍᴀɴᴅᴏs ᴛᴏᴛᴀʟᴇs :* ${user.commands || 0}`

    await conn.sendMessage(m.chat, { image: { url: pp }, caption: text, mentions: [userId], ...fake }, { quoted: m })

  } catch (error) {
    await m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`, m)
  }
}

handler.help = ['profile']
handler.tags = ['rg']
handler.command = ['profile', 'perfil', 'perfíl']
handler.group = true
handler.register = true

export default handler

async function formatTime(ms) {
  let s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24)
  let months = Math.floor(d / 30), weeks = Math.floor((d % 30) / 7)
  s %= 60; m %= 60; h %= 24; d %= 7
  let t = months ? [`${months} mes${months > 1 ? 'es' : ''}`] :
    weeks ? [`${weeks} semana${weeks > 1 ? 's' : ''}`] :
      d ? [`${d} día${d > 1 ? 's' : ''}`] : []
  if (h) t.push(`${h} hora${h > 1 ? 's' : ''}`)
  if (m) t.push(`${m} minuto${m > 1 ? 's' : ''}`)
  if (s) t.push(`${s} segundo${s > 1 ? 's' : ''}`)
  return t.length > 1 ? t.slice(0, -1).join(' ') + ' y ' + t.slice(-1) : t[0]
}