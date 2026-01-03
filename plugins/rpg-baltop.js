let handler = async (m, { conn, args, participants, usedPrefix }) => {

if (!global.db.data.chats[m.chat]?.economy && m.isGroup) {
return m.reply(`《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
}

const currency = global.currency || 'Coins'

const users = [...new Map(
Object.entries(global.db.data.users)
.map(([jid, data]) => [jid, { ...data, jid }])
).values()]
.filter(u => (u.coin || u.bank))

if (!users.length) return m.reply('🌿 No hay usuarios con datos económicos.')

const sorted = users.sort((a, b) =>
((b.coin || 0) + (b.bank || 0)) - ((a.coin || 0) + (a.bank || 0))
)

const totalPages = Math.ceil(sorted.length / 10)
const page = Math.max(1, Math.min(parseInt(args[0]) || 1, totalPages))
const startIndex = (page - 1) * 10
const endIndex = startIndex + 10

let text = `🌾 Los usuarios con más *${currency}* son:\n\n`

const slice = sorted.slice(startIndex, endIndex)

for (let i = 0; i < slice.length; i++) {
const { jid, coin = 0, bank = 0 } = slice[i]
const total = coin + bank

let name
try {
name = global.db.data.users[jid]?.name?.trim()
|| await conn.getName(jid)
} catch {
name = jid.split('@')[0]
}

text += `🌱 ${startIndex + i + 1} › *${name}:*\n`
text += `\t\t💥 Total→ *¥${total.toLocaleString()} ${currency}*\n\n`
}

text += `\n> 🫛 Página *${page}* de *${totalPages}*`

await conn.reply(m.chat, text.trim(), m, {
mentions: conn.parseMention(text)
})
}

handler.help = ['baltop']
handler.tags = ['rpg']
handler.command = ['baltop', 'eboard', 'economyboard']
handler.group = true

export default handler