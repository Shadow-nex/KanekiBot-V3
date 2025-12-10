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



const handler = async (m, { conn, text, participants, parseUserTargets, getUserInfo }) => {
  try {
    if (!m.mentionedJid?.length && !m.quoted && !text?.trim()) {
      return conn.reply(m.chat, `
*🔧 Ejemplo de targeting optimizado*

*Uso:*
• \`.ejemplo @usuario\` - Mencionar usuario
• \`.ejemplo\` (responder mensaje) - Target del mensaje citado
• \`.ejemplo 1234567890\` - Número directo
• \`.ejemplo @user1 @user2 1234567890\` - Múltiples targets


      `, m, rcanal)
    }

    const targets = await parseUserTargets(m, text, participants, conn)
    
    if (!targets.length) {
      return conn.reply(m.chat, '❌ No se encontraron usuarios válidos para procesar.', m, rcanalx)
    }

    

  let results = []
    
    for (let target of targets) {
      const userInfo = await getUserInfo(target, participants, conn)
      results.push(userInfo)
    }
    
  async function resolveLidSafe(jid) {
    try {
      if (typeof conn.onWhatsApp !== 'function') return null
      const res = await conn.onWhatsApp(jid)
      const r = Array.isArray(res) ? res[0] : null
      return r?.lid || null
    } catch { return null }
  }

  if (results.length && results.length <= 5) {
    for (const u of results) {
      u.lid = await resolveLidSafe(u.jid)
    }
  }

  try {
    const lidDigitsSet = new Set(
      results
        .map(u => (u?.lid ? String(u.lid).replace(/[^0-9]/g, '') : null))
        .filter(Boolean)
    )
    const filtered = results.filter(u => !lidDigitsSet.has(String(u.number)))
    if (filtered.length) results = filtered
  } catch {}

  let response = `*🎯 Usuarios procesados: ${results.length}*\n\n`
    
    for (let i = 0; i < results.length; i++) {
      const user = results[i]
      const badges = []
      
  if (user.isSuperAdmin) badges.push('Creador')
  else if (user.isAdmin) badges.push('ADMIN')
  else if (user.exists) badges.push('MIEMBRO')
  if (!user.exists) badges.push('NO EN GRUPO')
      
  response += `*${i + 1}.* ${user.name}\n`
  response += `   🪪 ID: ${user.jid}\n`
  response += `   🧩 LID: ${user.lid || '—'}\n`
  response += `   📱 ${user.number}\n`
  if (badges.length) response += `   🏷️ ${badges.join(', ')}\n`
  response += `   🔗 @${user.number}\n\n`
    }
    
  const fkontak = await makeFkontak().catch(() => null)
  const mentionJids = results.map(u => u.jid).filter(Boolean)

  try {
    const optsOk = (typeof rcanalr === 'object') ? { ...rcanalr, mentions: mentionJids } : { mentions: mentionJids }
    await conn.reply(m.chat, response.trim(), fkontak || m, optsOk)
  } catch (e) {
    const optsErr = (typeof rcanalx === 'object') ? { ...rcanalx, mentions: mentionJids } : { mentions: mentionJids }
    await conn.reply(m.chat, response.trim(), fkontak || m, optsErr)
  }


  } catch (error) {
    console.error('Error en ejemplo-optimized-user-targeting:', error)
    conn.reply(m.chat, '❌ Error al procesar usuarios: ' + error.message, m, rcanalx)
  }
}

handler.help = ['lid']
handler.tags = ['group']
handler.command = ['lid']
handler.group = true
handler.admin = false
handler.botAdmin = false

export default handler
