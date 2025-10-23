/*let handler = async (m, { conn, usedPrefix }) => {
if (!db.data.chats[m.chat].economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}
let mentionedJid = await m.mentionedJid
let who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : m.sender
let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
if (!(who in global.db.data.users)) return m.reply(`ꕥ El usuario no se encuentra en mi base de datos.`)
let user = global.db.data.users[who]
let coin = user.coin || 0
let bank = user.bank || 0
let total = (user.coin || 0) + (user.bank || 0)
const texto = `ᥫ᭡ Informacion -  Balance ❀
 
ᰔᩚ Usuario » *${name}*   
⛀ Cartera » *¥${coin.toLocaleString()} ${currency}*
⚿ Banco » *¥${bank.toLocaleString()} ${currency}*
⛁ Total » *¥${total.toLocaleString()} ${currency}*

> *Para proteger tu dinero, ¡depósitalo en el banco usando #deposit!*`
  await conn.sendFile(m.chat, 'https://files.catbox.moe/8xasa6.jpg', 'balance.jpg', texto, mentions: [who], m)
}

handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank'] 
handler.group = true 

export default handler*/


import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
  if (!global.db.data.chats[m.chat].economy && m.isGroup) {
    return m.reply(`《✦》Los comandos de *Economía RPG* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con:\n» *${usedPrefix}economy on*`)
  }

  let mentionedJid = m.mentionedJid && m.mentionedJid[0]
  let who = mentionedJid ? mentionedJid : m.quoted ? m.quoted.sender : m.sender

  if (!(who in global.db.data.users)) 
    return m.reply(`ꕥ El usuario no se encuentra en la base de datos.`)

  let user = global.db.data.users[who]
  let name = user.name || (await conn.getName(who))
  let coin = user.coin || 0
  let bank = user.bank || 0
  let total = coin + bank

  let level = user.level || 0
  let exp = user.exp || 0
  let health = user.health || 100
  let energy = user.energy || 50
  let mission = user.mission || 'Ninguna'
  let playtime = user.playtime || '00h 00m'
  
  const texto = `
╭━━━〔 ⚔️ ʀᴘɢ ꜱʏꜱᴛᴇᴍ - ɪɴꜰᴏʀᴍᴀᴄɪᴏ́ɴ ❖ 〕━━⬣
│ ᥫ᭡ 𝐄𝐬𝐭𝐚𝐝𝐨 𝐝𝐞𝐥 𝐀𝐝𝐯𝐞𝐧𝐭𝐮𝐫𝐨
│
│ 🧙‍♂️ Nombre » *${name}*
│ 💰 Cartera » *¥${coin.toLocaleString()} ${currency}*
│ 🏦 Banco » *¥${bank.toLocaleString()} ${currency}*
│ 💎 Total » *¥${total.toLocaleString()} ${currency}*
│
│ ⚔️ Nivel » *${level}*
│ 📖 Experiencia » *${exp} XP*
│ ❤️ health » *${health} / 100*
│ 🔮 Energía » *${energy} / 50*
│
│ 🎯 Misión Activa » *${mission}*
│ ⏳ Tiempo de Juego » *${playtime}*
╰━━━━━━━━━━━━━━━━━━━━━━━⬣

> *Tip:* Deposita tu dinero con _${usedPrefix}deposit_ para evitar perderlo.`

  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/8xasa6.jpg' },
    caption: texto.trim(),
    mentions: [who],
    fileName: 'rpg-balance.jpg',
    mimetype: 'image/jpeg',
    ...rcanal
  }, { quoted: fkontak })
}

handler.help = ['bal', 'balance', 'bank']
handler.tags = ['rpg', 'economy']
handler.command = ['bal', 'balance', 'bank']
handler.group = true

export default handler