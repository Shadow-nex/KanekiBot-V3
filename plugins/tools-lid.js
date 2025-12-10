import fetch from 'node-fetch'

async function makeFkontak() {
  try {
    const res = await fetch('https://i.postimg.cc/rFfVL8Ps/image.jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())

    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: { locationMessage: { name: 'User Lid', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch {
    return null
  }
}

async function parseUserTargets(m, text, participants, conn) {
  const targets = new Set()
  text = text?.trim() || ''

  if (m.mentionedJid?.length) {
    for (let jid of m.mentionedJid) targets.add(jid)
  }
  
  if (m.quoted?.sender) {
    targets.add(m.quoted.sender)
  }

  const numberRegex = /\b\d{5,17}\b/g
  const nums = text.match(numberRegex)
  if (nums) {
    for (let num of nums) {
      let jid = num.replace(/\D/g, '') + '@s.whatsapp.net'
      targets.add(jid)
    }
  }

  if (participants?.length && text.length >= 3) {
    const lowered = text.toLowerCase()
    for (let p of participants) {
      const name = conn.getName(p.id)?.toLowerCase() || ''
      if (name.includes(lowered)) targets.add(p.id)
    }
  }

  return [...targets]
}

async function getUserInfo(jid, participants, conn) {
  const number = jid.split('@')[0]
  const groupUser = participants?.find(u => u.id === jid)

  return {
    jid,
    number,
    name: conn.getName(jid) || number,
    exists: Boolean(groupUser),
    isAdmin: groupUser?.admin === 'admin' || groupUser?.admin === 'superadmin',
    isSuperAdmin: groupUser?.admin === 'superadmin'
  }
}

const handler = async (m, { conn, text, participants }) => {
  try {
 
    if (!m.mentionedJid?.length && !m.quoted && !text?.trim()) {
      return conn.reply(m.chat, `
*🔧 Ejemplo de targeting optimizado*

*Uso:*
• \`.lid @usuario\`
• \`.lid\` (responde a un mensaje)
• \`.lid 123456789\`
• \`.lid @user1 @user2 123456789\`
      `, m, rcanal)
    }

    let targets = await parseUserTargets(m, text, participants, conn)

    if (!targets.length) {
      return conn.reply(m.chat, '❌ No se encontraron usuarios válidos.', m, rcanalx)
    }

    let results = []
    for (const t of targets) results.push(await getUserInfo(t, participants, conn))

    async function resolveLidSafe(jid) {
      try {
        if (typeof conn.onWhatsApp !== 'function') return null
        const res = await conn.onWhatsApp(jid)
        const r = Array.isArray(res) ? res[0] : null
        return r?.lid || null
      } catch { return null }
    }

    if (results.length <= 5) {
      for (let u of results) u.lid = await resolveLidSafe(u.jid)
    }

    try {
      const lidDigits = new Set(
        results.map(u => (u.lid ? String(u.lid).replace(/\D/g, '') : null)).filter(Boolean)
      )
      const filtered = results.filter(u => !lidDigits.has(String(u.number)))
      if (filtered.length) results = filtered
    } catch {}

    let msg = `*🎯 Usuarios procesados: ${results.length}*\n\n`

    for (let i = 0; i < results.length; i++) {
      const u = results[i]
      const badges = []
      
      if (u.isSuperAdmin) badges.push('CREADOR')
      else if (u.isAdmin) badges.push('ADMIN')
      else if (u.exists) badges.push('MIEMBRO')
      else badges.push('FUERA DEL GRUPO')

      msg += `*${i + 1}.* ${u.name}\n`
      msg += `   🪪 JID: ${u.jid}\n`
      msg += `   🧩 LID: ${u.lid || '—'}\n`
      msg += `   📱 Número: ${u.number}\n`
      msg += `   🏷️ ${badges.join(', ')}\n`
      msg += `   🔗 @${u.number}\n\n`
    }

    const fkontak = await makeFkontak()
    const mentions = results.map(u => u.jid)

    try {
      await conn.reply(m.chat, msg.trim(), fkontak || m, { ...(rcanalr || {}), mentions })
    } catch {
      await conn.reply(m.chat, msg.trim(), fkontak || m, { ...(rcanalx || {}), mentions })
    }

  } catch (e) {
    console.error('Error en LID:', e)
    return conn.reply(m.chat, '❌ Error en el comando: ' + e.message, m, rcanalx)
  }
}

handler.help = ['lid']
handler.tags = ['group']
handler.command = ['lid']
handler.group = true
handler.admin = false
handler.botAdmin = false

export default handler