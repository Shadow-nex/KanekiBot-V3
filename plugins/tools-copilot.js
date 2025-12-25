import axios from "axios"
import fetch from "node-fetch"

let handler = async (m, { conn, text }) => {

  if (!text)
    return conn.reply(m.chat, `🍃 *Escribe algo para preguntarle a copilot uwu.*`, m)

  try {

    const loadingImg = "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1763849548830_727232.jpeg"

    const prompt = `responde en español: ${text}`
    const url = `https://api.nekolabs.web.id/ai/copilot?text=${encodeURIComponent(prompt)}`

    const { data } = await axios.get(url)

    if (!data?.success)
      return conn.reply(m.chat, `⚠️ La IA no respondió.`, m)

    const result = data.result.text || "⚠️ No hubo respuesta."

    const finalMsg = `
. 𑈜| ͜͝⩃̫۪۪۪֟፝᷼⩃͜͝ |ꉹꠥ🌿ꉹꠥ| ͜͝⩃̫۪۪۪֟፝᷼⩃͜͝ |ᰫ\`.

🌿 *Consulta:*  
${text}

🍃 *Respuesta de Copilot:*  
${result}

. 𑈜| ͜͝⩃̫۪۪۪֟፝᷼⩃͜͝ |ꉹꠥ✨ꉹꠥ| ͜͝⩃̫۪۪۪֟፝᷼⩃͜͝ |ᰫ\`.
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: loadingImg },
        caption: finalMsg,
      },
      { quoted: m }
    )

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, `❌ Error al conectar con la IA.`, m)
  }
}

handler.help = ['copilot <texto>']
handler.tags = ['ia']
handler.command = ['copilot']
handler.register = true
handler.group = true
export default handler