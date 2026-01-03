import fetch from 'node-fetch'
import fs from 'fs'
import { generarBienvenida, generarDespedida } from './_welcome.js'

const handler = async (m, { conn, command, usedPrefix, text, groupMetadata }) => {
  const value = text ? text.trim() : ''
  const chat = global.db.data.chats[m.chat]

  if (command === 'setgp') {
    return m.reply(`🍃 Ingresa la categoría que deseas modificar para tu grupo.\n\n🜸 Categorías disponibles:\n• ${usedPrefix}gpname <nuevo nombre>\n> Cambia el nombre del grupo\n• ${usedPrefix}gpdesc <nueva descripción>\n> Modifica la descripción del grupo\n• ${usedPrefix}gpbanner <imagen>\n> Establece una nueva imagen para el grupo (responde a una imagen)\n• ${usedPrefix}setwelcome <mensaje>\n> Configura el mensaje de bienvenida para nuevos miembros\n• ${usedPrefix}setbye <mensaje>\n> Establece el mensaje de despedida al salir un usuario\n• ${usedPrefix}testwelcome\n> Simula el mensaje de bienvenida\n• ${usedPrefix}testbye\n> Simula el mensaje de despedida`)
  }

  try {
    switch (command) {

      case 'setwelcome': {
        if (!value)
          return m.reply(`ꕥ Debes enviar un mensaje para establecerlo como mensaje de bienvenida.\n> Puedes usar {usuario} para mencionar al usuario, {grupo} para mencionar el nombre del grupo y {desc} para mencionar la descripción del grupo.\n\n✐ Ejemplo: ${usedPrefix}setwelcome Bienvenido {usuario} a {grupo}!`)
        chat.sWelcome = value
        m.reply(`ꕥ Has establecido el mensaje de bienvenida correctamente.\n> Usa ${usedPrefix}testwelcome para probar cómo se verá.`)
        break
      }

      case 'setbye': {
        if (!value)
          return m.reply(`ꕥ Debes enviar un mensaje para establecerlo como mensaje de despedida.\n> Puedes usar {usuario}, {grupo} y {desc} como variables dinámicas.\n\n✐ Ejemplo: ${usedPrefix}setbye Adiós {usuario}, te extrañaremos en {grupo}!`)
        chat.sBye = value
        m.reply(`ꕥ Has establecido el mensaje de despedida correctamente.\n> Usa ${usedPrefix}testbye para probar cómo se verá.`)
        break
      }

      case 'testwelcome': {
        if (!chat.sWelcome) return m.reply('⚠︎ No hay mensaje de bienvenida configurado.')
        const { pp: ppWel, caption: captionWel, username } = await generarBienvenida({
          conn,
          userId: m.sender,
          groupMetadata,
          chat
        })

        await conn.sendMessage(m.chat, {
          image: { url: ppWel },
          caption: captionWel,
          mentions: [m.sender]
        }, { quoted: m })
        break
      }

      case 'testbye': {
        if (!chat.sBye) return m.reply('⚠︎ No hay mensaje de despedida configurado.')
        const { pp: ppBye, caption: captionBye, username } = await generarDespedida({
          conn,
          userId: m.sender,
          groupMetadata,
          chat
        })

        await conn.sendMessage(m.chat, {
          image: { url: ppBye },
          caption: captionBye,
          mentions: [m.sender]
        }, { quoted: m })
        break
      }
    }

  } catch (e) {
    m.reply(`⚠︎ Se ha producido un problema.\n> Usa ${usedPrefix}report para informarlo.\n\n${e.message}`)
  }
}

handler.help = ['setwelcome', 'setbye', 'testwelcome', 'testbye']
handler.tags = ['group']
handler.command = ['setgp', 'setwelcome', 'setbye', 'testwelcome', 'testbye']
handler.admin = true
handler.group = true

export default handler