const handler = async (m, { conn, text, command, usedPrefix, args }) => {
  const user = global.db.data.users[m.sender]

  user.wait = user.wait || 0
  user.exp = user.exp || 0
  user.coin = user.coin || 0

  const cooldown = 10000
  const now = new Date() * 1
  if (now - user.wait < cooldown) {
    const s = Math.ceil((cooldown - (now - user.wait)) / 1000)
    throw `${emoji} Espera *${s} segundos* para volver a jugar`
  }

  if (!args[0]) {
    return conn.reply(
      m.chat,
      `*PIEDRA 🗿, PAPEL 📄 o TIJERA ✂️*

◉ ${usedPrefix + command} piedra
◉ ${usedPrefix + command} papel
◉ ${usedPrefix + command} tijera`,
      m
    )
  }

  const textm = text.toLowerCase()
  if (!['piedra', 'papel', 'tijera'].includes(textm)) {
    return m.reply('🌾 Usa solo: piedra, papel o tijera')
  }

  const opciones = ['piedra', 'papel', 'tijera']
  const astro = opciones[Math.floor(Math.random() * opciones.length)]

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  let xp = 0
  let coin = 0
  let result = ''

  if (textm === astro) {
    xp = rand(200, 800)
    coin = rand(500, 1500)
    result = '🤝 *EMPATE* 🌱'
  } else if (
    (textm === 'piedra' && astro === 'tijera') ||
    (textm === 'papel' && astro === 'piedra') ||
    (textm === 'tijera' && astro === 'papel')
  ) {
    xp = rand(1000, 5000)
    coin = rand(2000, 15000)
    result = '🎉 *GANASTE* 🌱'
  } else {
    xp = -rand(1000, 5000)
    coin = -rand(2000, 15000)
    result = '🍃 *PERDISTE*'
  }

  user.exp += xp
  user.coin += coin
  user.wait = now

  m.reply(
    `${result}

🌾 *Tu elección ›* ${textm}
🍁 *Bot eligió ›* ${astro}

🍃 *EXP ›* ${xp > 0 ? '+' : ''}${xp}
🌿 *${currency} ›* ${coin > 0 ? '+' : ''}${coin}

> .${dev}`
  )
}

handler.help = ['ppt']
handler.tags = ['game']
handler.command = ['ppt']
handler.group = true
handler.register = true

export default handler