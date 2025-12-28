import fetch from 'node-fetch'

const cooldown = new Map()
const COOLDOWN_TIME = 3 * 60 * 1000

const handler = async (m, { conn }) => {
if (!db.data.chats[m.chat].nsfw && m.isGroup) {
    return m.reply(`《✦》El contenido *NSFW* está desactivado en este grupo.\n> Un administrador puede activarlo con el comando » *#nsfw on*`);
    }
  try {
    const user = m.sender

    if (cooldown.has(user)) {
      const tiempoRestante = (cooldown.get(user) - Date.now()) / 1000
      if (tiempoRestante > 0) {
        const minutos = Math.floor(tiempoRestante / 60)
        const segundos = Math.floor(tiempoRestante % 60)
        return m.reply(`⏳ ᴇsᴘᴇʀᴀ *${minutos}m ${segundos}s* ᴘᴀʀᴀ ᴜsᴀʀ ᴇʟ ᴄᴏᴍᴀɴᴅᴏ ɴᴜᴇᴠᴀᴍᴇɴᴛᴇ.`)
      }
    }

    const res = await fetch('https://api.waifu.pics/nsfw/waifu')
    if (!res.ok) throw new Error('No se pudo obtener el pack.')

    const json = await res.json()
    if (!json.url) throw new Error('La API no devolvió una URL válida.')

    await conn.sendFile(m.chat, json.url, 'pack.jpg', `🔥 ᴀǫᴜɪ́ ᴛɪᴇɴᴇs ᴛᴜ ᴘᴀᴄᴋ 🔥`, m)

    cooldown.set(user, Date.now() + COOLDOWN_TIME)
    setTimeout(() => cooldown.delete(user), COOLDOWN_TIME)

  } catch (error) {
    console.error(error)
    m.reply('❌ ᴏᴄᴜʀʀɪᴏ́ ᴜɴ ᴇʀʀᴏʀ ᴀʟ ᴏʙᴛᴇɴᴇʀ ᴇʟ ᴘᴀᴄᴋ. ɪɴᴛᴇɴᴛᴀ ᴍᴀ́s ᴛᴀʀᴅᴇ.')
  }
}

handler.command = ['pack']
handler.tags = ['nsfw']
handler.help = ['pack']

export default handler