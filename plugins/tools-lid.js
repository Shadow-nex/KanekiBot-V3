import fetch from 'node-fetch'

let handler = async (m, { conn, text, groupMetadata }) => {
  await m.react('🕒')

  const participantes = groupMetadata.participants || []
  let objetivos = new Set()

  if (m.mentionedJid?.length) {
    m.mentionedJid.forEach(j => objetivos.add(j))
  }

  if (m.quoted) {
    objetivos.add(m.quoted.sender)
  }

  if (text) {
    text.split(/\s+/).forEach(v => {
      let num = v.replace(/[^0-9]/g, '')
      if (num.length >= 5) objetivos.add(num + '@s.whatsapp.net')
    })
  }
  
  if (objetivos.size === 0) objetivos.add(m.sender)

  let info = `╭━━━〔 ☕ *INFORMACIÓN DE USUARIOS DETECTADOS* 〕━━⬣\n`
  let totalConLID = 0
  let totalSinLID = 0
  let count = 1

  for (let uid of objetivos) {
    try {
      const number = uid.replace(/[^0-9]/g, '')
      const participante = participantes.find(p => p.id === uid)
      const nombre = await conn.getName(uid).catch(() => 'Sin nombre')
      const admin = participante?.admin ? '✅ Sí' : '❌ No'
      const enGrupo = participante ? '✅ Sí' : '❌ No'

      // Detectar LID
      let lid = '—'
      if (uid.includes(':')) {
        let parts = uid.split(':')
        lid = parts[1]?.split('@')[0] || '—'
      }

      if (lid !== '—') totalConLID++
      else totalSinLID++

      info += `│ 🧩 *${count}.* @${number}\n`
      info += `│ ┣ 👤 *Nombre:* ${nombre}\n`
      info += `│ ┣ 💠 *LID:* ${lid}\n`
      info += `│ ┣ 👑 *Admin:* ${admin}\n`
      info += `│ ┗ 👥 *En grupo:* ${enGrupo}\n│\n`
      count++

    } catch {
      info += `│ ⚠️ *${count}.* Error al analizar este usuario.\n│\n`
      count++
    }
  }

  info += `╰━━━━━━━━━━━━━━━━━━━━━━⬣\n`
  info += `🧮 *Total detectados:* ${objetivos.size}\n`
  info += `💠 *Con LID:* ${totalConLID}\n`
  info += `🌀 *Sin LID:* ${totalSinLID}`

  await conn.sendMessage(m.chat, { 
    text: info,
    mentions: [...objetivos]
  }, { quoted: m })

  await m.react('✔️')
}

handler.command = ['lid', 'mylid']
handler.help = ['lid', 'mylid']
handler.tags = ['tools']
handler.group = true

export default handler