import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) 
    return conn.reply(
      m.chat,
      `*🌾 Usa el comando así:*\n\n> ${usedPrefix + command} Dragon Ball`,
      m
    )

  await m.react('🕐')

  try {
    let res = await fetch(
      `https://api.stellarwa.xyz/search/mediafire?query=${encodeURIComponent(text)}&key=this-xyz`
    )
    let data = await res.json()

    if (!data?.results?.length) {
      return conn.reply(
        m.chat,
        `✿ No se encontraron resultados para: *${text}*`,
        m
      )
    }

    let txt = `❐ *RESULTADOS MEDiAFiRE* ❐
✿ *Búsqueda:* ${text}\n\n`

    data.results.forEach((f, i) => {
      txt += `*${i + 1}. ${f.filename || 'Archivo desconocido'}*
💥 *Tamaño* › ${f.filesize || 'Desconocido'}
🌾 *Link* › ${f.url || 'No disponible'}
🌱 *Fuente* › ${f.source_url || 'No disponible'}
🫛 *Título* › ${f.source_title || 'Sin Título'}

──────────────────────
`
    })

    await m.react('✔️')
    await conn.sendMessage(
      m.chat,
      {
        image: {
          url: 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763839800526_997569.jpeg'
        },
        caption: txt
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(m.chat, '✖️ Error al buscar en MediaFire', m)
  }
}

handler.help = ['mediafiresearch <texto>']
handler.tags = ['search']
handler.command = ['mediafiresearch', 'mfse', 'mfsearch']
handler.group = true

export default handler