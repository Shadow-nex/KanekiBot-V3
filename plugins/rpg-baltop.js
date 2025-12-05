import fetch from 'node-fetch'
import moment from 'moment-timezone'

let handler = async (m, { conn, args, participants, usedPrefix }) => {
  const chat = global.db.data.chats[m.chat] || {}
  if (!chat.economy && m.isGroup) {
    return m.reply(`🍃 *Los comandos de economía están desactivados en este grupo.*\n\nUn administrador puede activarlos con:\n> ${usedPrefix}economy on`)
  }

  const groupUsers = participants.map(p => p.id)
  const users = groupUsers
    .map(jid => ({ jid, ...(global.db.data.users[jid] || {}) }))
    .filter(u => u && (u.coin || u.bank))

  if (!users.length) return m.reply('🌿 No hay usuarios con datos económicos en este grupo.')

  const sorted = users.sort((a, b) => ((b.coin || 0) + (b.bank || 0)) - ((a.coin || 0) + (a.bank || 0)))
  const totalPages = Math.ceil(sorted.length / 10)
  const page = Math.max(1, Math.min(parseInt(args[0]) || 1, totalPages))
  const startIndex = (page - 1) * 10
  const endIndex = startIndex + 10
  const slice = sorted.slice(startIndex, endIndex)

  const richest = (sorted[0].coin || 0) + (sorted[0].bank || 0)
  const { subject } = await conn.groupMetadata(m.chat)

  const getRank = (total, level) => {
    if (level >= 100 || total >= 1000000) return '👑 *Rey Dragón*'
    if (level >= 70 || total >= 500000) return '🔥 *Señor del Fuego*'
    if (level >= 50 || total >= 200000) return '⚔️ *Caballero Sagrado*'
    if (level >= 30 || total >= 100000) return '🌕 *Guerrero Lunar*'
    if (level >= 15 || total >= 50000) return '🍃 *Explorador del Bosque*'
    if (level >= 5 || total >= 10000) return '🪶 *Aldeano Avanzado*'
    return '🌱 *Aldeano Novato*'
  }

  let text = `╭═《 *🏆 RANKING DE ECONOMÍA* 》
┃  🏰 *Reino:* ${subject}
┃  📜 *Página:* ${page}/${totalPages}
┣━━━━━━━━━━━━━━━━━━━━⬣
`

  for (let i = 0; i < slice.length; i++) {
    const { jid, coin = 0, bank = 0, level } = slice[i]
    const total = coin + bank
    let name

    try {
      name = await conn.getName(jid)
    } catch {
      name = jid.split('@')[0]
    }

    const rank = getRank(total, level)
    const percent = Math.min(100, Math.floor((total / richest) * 100))
    const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10))

    const medals = ['👑', '🥈', '🥉']
    const rankEmoji = medals[i] || '🌾'

    text += `
┃ ✧ ${rankEmoji} *${i + 1 + startIndex}. ${name}*
┃ ┊ ۫𖢷͜੭ ׅ🌴ֹ \`${currency}:\` *${total.toLocaleString()} ¥*
┃ ┊ ۫𖢷͜੭ ׅ🪽ֹ \`Nivel:\` ${level}
┃ ┊ ۫𖢷͜੭ ׅ🌾ֹ \`Rango:\` ${rank}
┃ ┊ ۫𖢷͜੭ ׅ🍃ֹ \`Progreso:\` \`\`\`[${bar}] ${percent}%\`\`\`
┃ ╰∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙ ∙ ∙ ∙ ∙
┃ 
`
  }

  text += `╰═══════════════════════⬣`

  await conn.reply(m.chat, text.trim(), m, rcanal)
}

handler.help = ['baltop']
handler.tags = ['rpg']
handler.command = ['baltop', 'eboard']
handler.group = true

export default handler