// Código de sesión
// by izana (traducido al español)

import fetch from 'node-fetch'

const BASE = 'https://knight-bot-paircode.onrender.com'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const arg = (text || '').trim()

  if (!arg) {
    return conn.sendMessage(
      m.chat,
      { text: `❌ Ingresa un número válido.\nEjemplo: ${usedPrefix + command} 201222784295` },
      { quoted: m }
    )
  }

  const number = arg.replace(/\D/g, '')
  if (!number) {
    return conn.sendMessage(
      m.chat,
      { text: `❌ Ingresa un número válido.\nEjemplo: ${usedPrefix + command} 201222784295` },
      { quoted: m }
    )
  }

  await conn.sendMessage(
    m.chat,
    { text: '⏳ Generando / obteniendo la sesión...' },
    { quoted: m }
  )

  let attempts = 0
  const maxAttempts = 3

  while (attempts < maxAttempts) {
    try {
      attempts++
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 20000)

      const res = await fetch(`${BASE}/pair?number=${encodeURIComponent(number)}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android)',
          'Accept': 'application/json'
        }
      })

      clearTimeout(timeout)

      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(`Estado ${res.status} - ${txt || res.statusText}`)
      }

      const json = await res.json().catch(() => null)
      if (!json) throw new Error('Respuesta ilegible del servidor')

      // Si existe la clave "code", enviamos solo ese valor
      if (json.code) {
        await conn.sendMessage(m.chat, { text: json.code }, { quoted: m })
        return
      }

      // Si la respuesta es distinta, enviamos todo el contenido
      let out = typeof json === 'object'
        ? Object.entries(json).map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`).join('\n')
        : String(json)

      await conn.sendMessage(m.chat, { text: out }, { quoted: m })
      return

    } catch (err) {
      if (attempts >= maxAttempts) {
        await conn.sendMessage(
          m.chat,
          { text: `❌ Falló después de ${attempts} intentos:\n${err.message}` },
          { quoted: m }
        )
        return
      }
      await new Promise(r => setTimeout(r, 2000))
    }
  }
}

handler.help = ['sesion <número>']
handler.tags = ['system']
handler.command = /^(sesion|sesión)$/i

export default handler