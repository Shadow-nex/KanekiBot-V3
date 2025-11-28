import fetch from "node-fetch";

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) {
      return conn.reply(
        m.chat,
        `🚀 *Ingresa un enlace de YouTube*\n\nEjemplo:\n${command} https://youtube.com/watch?v=p-Z3YrHJ1sU`,
        m
      );
    }

    let api = `https://akirax-api.vercel.app/ytplay?url=${encodeURIComponent(text)}`;

    let res = await fetch(api);
    let json = await res.json();

    if (!json.status) {
      return conn.reply(m.chat, "❌ Error al obtener datos del video.", m);
    }

    let info = json.result;
    let video = info.video.url;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: video },
        caption: `🎬 *${info.title}*\n📌 Calidad: ${info.video.quality}p`
      },
      { quoted: m }
    );
  } catch (e) {
    console.log(e);
    conn.reply(
      m.chat,
      "❌ Hubo un error intentando enviar el video.",
      m
    );
  }
};

handler.help = ["ytv"];
handler.tags = ["downloader"];
handler.command = ["ytmp4", "ytvideo", "ytv"];

export default handler;