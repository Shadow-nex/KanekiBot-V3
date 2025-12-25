import fetch from 'node-fetch'

const handler = async (m, { conn, text, participants, command }) => {
  const groupMetadata = await conn.groupMetadata(m.chat)
  const groupName = groupMetadata.subject
  const groupImg = await conn.profilePictureUrl(m.chat, 'image').catch(_ => banner)
  const totalMembers = participants.length
  const sender = m.pushName || 'Usuario desconocido'

  const mensaje = text ? text : '¡Atención a todos! 🚨'

  const fecha = new Date()
  let locale = 'es-ES'
  const dia = fecha.toLocaleDateString(locale, { weekday: 'long' })
  const fechaTxt = fecha.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  const hora = fecha.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })

  const emojis = ['🍄','🌿','🍁','🌙','🐾','🍓','🌸','🌼','🌷','🍀','🌹','✨']

  const menciones = participants.map((p, i) => {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]
    return `${i + 1}. ${emoji} @${p.id.split('@')[0]}`
  }).join('\n')

  const texto = `━━━━━━━━━━━━━━━━━━━━
🍟 𝙈𝙀𝙉𝘾𝙄𝙊𝙉 𝙂𝙀𝙉𝙀𝙍𝘼𝙇 🍓
━━━━━━━━━━━━━━━━━━━━
> *Grupo:* ${groupName}
> *Miembros:* ${totalMembers}
> *Autor:* ${sender}
> *Mensaje:* ${mensaje}

🍃 𝙈𝙀𝙉𝘾𝙄𝙊𝙉𝘼𝘿𝙊𝙎 💮
${menciones}

> \`${hora}, ${dia}, ${fechaTxt}\``

  await conn.sendMessage(m.chat, {
    image: { url: groupImg },
    caption: texto,
    mentions: participants.map(a => a.id)
  })
}

handler.help = ['todos', 'invocar', 'tagall']
handler.tags = ['group']
handler.command = ['todos', 'invocar', 'tagall']
handler.admin = true
handler.group = true

export default handler