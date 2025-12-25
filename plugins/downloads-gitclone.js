import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(
      m.chat, 
      `🍃 *Debes enviar un enlace de un repositorio de GitHub.*\nEjemplo:\n${usedPrefix + command} https://github.com/usuario/repositorio`,
      m
    )
  }

  let regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/i
  let match = args[0].match(regex)

  if (!match) {
    await m.react('⚠️')
    return conn.reply(
      m.chat,
      `🌱 *El enlace no es válido o no pertenece a GitHub.*`,
      m
    )
  }

  let user = match[1]
  let repo = match[2].replace(/\.git$/, "")
  let apiURL = `https://api.github.com/repos/${user}/${repo}`
  let zipURL = `https://api.github.com/repos/${user}/${repo}/zipball`

  let previewImg = "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763676539448_243623.jpeg"

  await m.react('⌛')

  try {
    conn.reply(m.chat, `🌿 *Buscando en GitHub...*`, m)

    
    let repoResp = await fetch(apiURL)
    if (!repoResp.ok) throw new Error("No se encontró el repo")
    let repoData = await repoResp.json()

    
    let zipResp = await fetch(zipURL)
    if (!zipResp.ok) throw new Error("Error descargando ZIP")
    let buffer = Buffer.from(await zipResp.arrayBuffer())

    let filename = `${repo}-main.zip`

    let thumbRes = await fetch(previewImg)
    let thumbBuffer = Buffer.from(await thumbRes.arrayBuffer())

    let text = `*🌿 DESCARGA DE REPOSITORIO*

🍂 *Proyecto:* ${repo}
🌱 *Propietario:* ${user}
🌾 *Creador:* ${repoData?.owner?.login}
🍀 *Descripción:* ${repoData?.description || "Sin descripción"}
🪴 *Repositorio:* ${args[0]}

> 🌳 *Descargando archivo...*`

    await conn.sendFile(m.chat, 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763675568213_152926.jpeg', "git.jpg", text, m)

    await conn.sendMessage(
      m.chat,
      {
        document: buffer,
        mimetype: 'application/zip',
        fileName: filename,
        jpegThumbnail: thumbBuffer,
        ...fake
      },
      { quoted: m }
    )

    await m.react('✔️')

  } catch (e) {
    console.log(e)
    await m.react('❌')
    return conn.reply(
      m.chat,
      `🍁 *Error descargando el repositorio.*\nAsegúrate de que exista y sea público.`,
      m
    )
  }
}

handler.help = ['gitclone *<url>*']
handler.tags = ['download']
handler.command = ['gitclone']
handler.group = true

export default handler