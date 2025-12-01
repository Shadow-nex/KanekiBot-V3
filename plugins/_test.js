import fetch from 'node-fetch'

let handler = async (m, { conn, args, command, usedPrefix, isCreator }) => {

  /*
  const apiKeys = [
    "",
 
  ]

  const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)]*/

  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTVkMTZkMTc4MTFlNDNlNDhiODU3MiIsImlhdCI6MTc2MzAzNzU1MCwiZXhwIjoxNzYzNjQyMzUwfQ.YOK_4RoEVNi8OpXaMpJmND309TG2MJm_q0IE5gTGZD0'

  if (command === 'reactall') {

    if (!isCreator)
      return m.reply('🚫 Solo el owner puede usar este comando.')

    const parts = args.join(' ').split(' ')
    const postLink = parts[0]
    const reacts = parts.slice(1).join(' ')

    if (!postLink || !reacts)
      return m.reply(`${getBotEmoji(mePn)} Uso: ${usedPrefix}reactall <link_post> <emoji1,emoji2,emoji3,emoji4>`)

    if (!postLink.includes('whatsapp.com/channel/'))
      return m.reply(`${getBotEmoji(mePn)} El link debe ser de una publicación de un canal.`)

    await m.react('🔄')

    try {
      const urlParts = postLink.split('/')
      const messageId = urlParts.pop()
      const inviteCode = urlParts.pop()

      const channelInfo = await conn.newsletterMetadata("invite", inviteCode)
      const channelId = channelInfo.id

      const emojiArray = reacts.split(',').map(v => v.trim()).filter(Boolean)
      if (emojiArray.length > 4)
        return m.reply(`${getBotEmoji(mePn)} Máximo 4 emojis permitidos.`)

      const { executeSocketMethod } = require('./baileys')

      const result = await executeSocketMethod(
        'all',
        'newsletterReactMessage',
        channelId,
        messageId,
        emojiArray[0]
      )

      if (!result.ok)
        return m.reply(`${getBotEmoji(mePn)} Error: ${result.message}`)

      const success = result.details.success.length
      const fails = result.details.errors.length

      let txt = `${getBotEmoji(mePn)} *RESULTADO*\n\n`
      txt += `Post: ${postLink}\n`
      txt += `Emoji: ${emojiArray[0]}\n`
      txt += `Bots: ${success + fails}\n`
      txt += `✅: ${success}\n`
      txt += `❌: ${fails}`

      if (fails > 0) {
        txt += `\n\nErrores:\n`
        for (let i in result.details.errors) {
          let e = result.details.errors[i]
          txt += `${Number(i) + 1}. ${e.id}: ${e.error}\n`
        }
      }

      await m.reply(txt)
      await m.react('✅')

    } catch (e) {
      await m.react('❌')
      return m.reply(`${getBotEmoji(mePn)} Error: ${e.message}`)
    }
  }

  if (['react', 'reaccionar', 'channelreact'].includes(command)) {

    const raw = args.join(' ')
    if (!raw)
      return m.reply(`${getBotEmoji(mePn)} Uso:\n${usedPrefix}react <link_post> <emoji1,emoji2,...>`)

    await m.react('⏳')

    try {
      const parts = raw.split(' ')
      const postLink = parts[0]
      const reacts = parts.slice(1).join(' ')

      if (!postLink || !reacts)
        return m.reply(`${getBotEmoji(mePn)} Formato incorrecto.`)

      if (!postLink.includes('whatsapp.com/channel/'))
        return m.reply(`${getBotEmoji(mePn)} El link debe ser de un canal.`)

      const emojiArray = reacts.split(',').map(v => v.trim()).filter(Boolean)
      if (emojiArray.length > 4)
        return m.reply(`${getBotEmoji(mePn)} Máximo 4 emojis permitidos.`)

      const response = await fetch(
        'https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/channel/react-to-post',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'User-Agent': 'Mozilla/5.0 (Android)'
          },
          body: JSON.stringify({
            post_link: postLink,
            reacts: emojiArray.join(',')
          })
        }
      )

      const json = await response.json()

      if (response.ok && json.message) {
        await m.react('✅')
        await m.reply(`${getBotEmoji(mePn)} Reacciones enviadas con éxito`)
      } else {
        await m.react('❌')
        await m.reply(`${getBotEmoji(mePn)} Error al enviar las reacciones`)
      }

    } catch (e) {
      await m.react('❌')
      return m.reply(`${getBotEmoji(mePn)} Error: ${e.message}`)
    }
  }

}

handler.help = ['react', 'reactall']
handler.tags = ['tools']
handler.command = ['react', 'reaccionar', 'channelreact', 'reactall']

export default handler