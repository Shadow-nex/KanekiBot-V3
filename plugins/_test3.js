import fetch from "node-fetch";
import Jimp from "jimp";

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `🌷 Envia el link del video de Facebook.\n` +
      `Ejemplo:\n*${usedPrefix + command} https://www.facebook.com/share/...*`,
      m
    );
  }

  try {
    const api = `https://akirax-api.vercel.app/download/facebook?url=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    if (!res.ok) throw new Error("Error al obtener datos de la API.");

    const data = await res.json();
    if (!data.status) throw new Error("No se pudo procesar el enlace.");

    const { title, desc, duration, thumb, sd, hd } = data.result;

    let jpegThumb = null;
    try {
      const img = await Jimp.read(thumb);
      img.resize(300, Jimp.AUTO).quality(70);
      jpegThumb = await img.getBufferAsync(Jimp.MIME_JPEG);
    } catch (err) {
      console.log("⚠️ Error al procesar miniatura:", err.message);
      jpegThumb = Buffer.alloc(0);
    }

    let txt = `🌳 *Facebook Downloader*\n\n`;
    txt += `❄️ *Título:* ${title}\n`;
    txt += `🌾 *Duración:* ${duration}\n`;
    txt += `🎍 *Descripción:*\n${desc}\n\n`;
    txt += `🌴 *Calidades disponibles:*\n`;
    txt += `• ☃️ *SD:* (360p)\n`;
    txt += `• 🌿 *HD:* (720p)\n`;

    await conn.sendMessage(
      m.chat,
      { image: { url: thumb }, caption: txt },
      { quoted: m }
    );
    
    const videoURL = hd || sd;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoURL },
        caption: `🚀 *Aquí está tu video*`,
      },
      { quoted: m }
    );

    await conn.sendMessage(
      m.chat,
      {
        document: { url: videoURL },
        mimetype: "video/mp4",
        fileName: `${title.slice(0, 50)}.mp4`,
        ...(jpegThumb ? { jpegThumbnail: jpegThumb } : {}),
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    return conn.reply(
      m.chat,
      `Hubo un problema al descargar el video.\n` +
      `Verifica el enlace e inténtalo otra vez.`,
      m
    );
  }
};

handler.help = ["facebook2 <url>"];
handler.tags = ["downloader"];
handler.command = ["facebook2", "fb2"];

export default handler;