const handler = async (m, { conn, command, args }) => {
 /* if (!m.isOwner) return conn.reply(m.chat, "❌ *Solo un owner puede usar este comando.*", m)
*/
  const target = 
    m.mentionedJid?.[0] || 
    (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null)

  if (!target)
    return conn.reply(
      m.chat,
      `⚠️ *Debes mencionar o escribir un número.*\n\nEjemplos:\n.addowner @user\n.delowner @user`,
      m
    )

  const number = target.split("@")[0]

  
  if (command === "addowner") {
    if (global.owner.includes(number))
      return conn.reply(m.chat, `⚠️ *${number} ya es owner.*`, m)

    global.owner.push(number)

    return conn.reply(
      m.chat,
      `✅ *Nuevo owner agregado temporalmente:*\n@${number}`,
      m,
      { mentions: [target] }
    )
  }

  if (command === "delowner") {
    if (!global.owner.includes(number))
      return conn.reply(m.chat, `⚠️ *${number} no es owner.*`, m)

    global.owner = global.owner.filter(v => v !== number)

    return conn.reply(
      m.chat,
      `🗑️ *Owner eliminado:* @${number}`,
      m,
      { mentions: [target] }
    )
  }
}

handler.help = ["addowner @user", "delowner @user"]
handler.tags = ["owner"]
handler.command = ["addowner", "delowner"]

export default handler