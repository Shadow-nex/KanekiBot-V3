import makeWASocket, { proto } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, command, usedPrefix, isCreator }) => {

  function parseChannelLink(link) {
    if (!link.includes("whatsapp.com/channel/")) return null
    const parts = link.split("/")
    return {
      messageId: parts.pop(),
      invite: parts.pop()
    }
  }

  // =============== REACT NORMAL (un solo bot) =================
  if (["react", "reaccionar", "channelreact"].includes(command)) {

    if (!args[0] || !args[1])
      return m.reply(`⚠ Uso:\n${usedPrefix}react <link_post> <emoji>`)

    const postLink = args[0]
    const react = args.slice(1).join(" ")

    const parsed = parseChannelLink(postLink)
    if (!parsed) return m.reply("⚠ Link inválido, debe ser de un canal.")

    await m.react('⏳')

    try {
      const { invite, messageId } = parsed

      const channel = await conn.newsletterMetadata("invite", invite)
      const channelId = channel.id

      await conn.newsletterReactMessage(channelId, messageId, react.trim())

      await m.react('✅')
      return m.reply("😀 Reacción enviada correctamente!")

    } catch (e) {
      await m.react('❌')
      return m.reply(`⚠ Error: ${e.message}`)
    }
  }

  // ================ REACTALL (SIN bailey.js) ====================
  // Solo envía desde ESTE bot porque no usas multisocket
  if (command === "reactall") {

    /*if (!isCreator)
      return m.reply("🚫 Solo el owner puede usar este comando.")*/

    if (!args[0] || !args[1])
      return m.reply(`⚠ Uso:\n${usedPrefix}reactall <link_post> <emoji>`)

    const postLink = args[0]
    const react = args.slice(1).join(" ")

    const parsed = parseChannelLink(postLink)
    if (!parsed) return m.reply("⚠ Link inválido, debe ser de un canal.")

    await m.react('🔄')

    try {
      const { invite, messageId } = parsed
      const channel = await conn.newsletterMetadata("invite", invite)
      const channelId = channel.id

      // Como no tienes multisocket, solo manda 1 reacción
      await conn.newsletterReactMessage(channelId, messageId, react.trim())

      await m.react('✅')
      return m.reply("😀 Reacción enviada (este bot).")

    } catch (e) {
      await m.react('❌')
      return m.reply(`⚠ Error: ${e.message}`)
    }
  }

}

handler.help = ["react", "reactall"]
handler.tags = ["tools"]
handler.command = ["react", "reaccionar", "channelreact", "reactall"]

export default handler