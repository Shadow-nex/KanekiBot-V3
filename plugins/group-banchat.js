let handler = async (m, { conn, usedPrefix, command, args }) => {
let chat = global.db.data.chats[m.chat]
if (command === 'bot') {
if (args.length === 0) {
const estado = chat.isBanned ? '✗ Desactivado' : '✓ Activado'
const info = `「✦」Un administrador puede activar o desactivar a *${botname}* utilizando:\n\n✐ _Activar_ » *${usedPrefix}bot enable*\n✐ _Desactivar_ » *${usedPrefix}bot disable*\n\n✧ Estado actual » *${estado}*`
return conn.reply(m.chat, info, m)
}
if (args[0] === 'off') {
if (chat.isBanned) {
return conn.reply(m.chat, `《✦》${botname} ya estaba desactivado.`, m, rcanal)
}
chat.isBanned = true
return conn.reply(m.chat, `❀ Has *desactivado* a ${botname}!`, m)
} else if (args[0] === 'on') {
if (!chat.isBanned) {
return conn.reply(m.chat, `《✦》${botname} ya estaba activado.`, m, rcanal)
}
chat.isBanned = false
return conn.reply(m.chat, `❀ Has *activado* a ${botname}!`, m, rcanal)
}}}

handler.help = ['bot on/off']
handler.tags = ['group']
handler.command = ['bot']
handler.admin = true

export default handler