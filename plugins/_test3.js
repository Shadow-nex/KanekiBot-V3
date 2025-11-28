import fetch from "node-fetch";
import Jimp from "jimp";

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `📘 *Descarga de Facebook*\n\n` +
      `👉 Envia el link del video de Facebook.\n` +
      `Ejemplo:\n*${usedPrefix + command} https://www.facebook.com/share/...*`,
      m
    );
  }

  try {
    const api = `https://akirax-api.vercel.app/download/facebook?url=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    if (!res.ok) throw new Error("❌ Error al obtener datos de la API.");

    const data = await res.json();
    if (!data.status) throw new Error("❌ No se pudo procesar el enlace.");

    const { title, desc, duration, thumb, sd, hd } = data.result;

    // --- Procesar miniatura Jimp → jpegThumbnail ---
    let jpegThumb = null;
    try {
      const img = await Jimp.read(thumb);
      img.resize(300, Jimp.AUTO).quality(70);
      jpegThumb = await img.getBufferAsync(Jimp.MIME_JPEG);
    } catch (err) {
      console.log("⚠️ Error al procesar miniatura:", err.message);
      jpegThumb = Buffer.alloc(0);
    }

    // Mostrar info
    let txt = `📘 *Facebook Downloader*\n\n`;
    txt += `📝 *Título:* ${title}\n`;
    txt += `⏳ *Duración:* ${duration}\n`;
    txt += `📄 *Descripción:*\n${desc}\n\n`;
    txt += `🔗 *Calidades disponibles:*\n`;
    txt += `• 🎥 *SD:* disponible\n`;
    txt += `• 🎞️ *HD:* disponible\n`;

    await conn.sendMessage(
      m.chat,
      { image: { url: thumb }, caption: txt },
      { quoted: m }
    );

    // Elegir mejor calidad
    const videoURL = hd || sd;

    // Enviar video
    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoURL },
        caption: `🎥 *Aquí está tu video*`,
      },
      { quoted: m }
    );

    // Después del video: enviar DOCUMENTO + jpegThumbnail
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
      `❌ Hubo un problema al descargar el video.\n` +
      `Verifica el enlace e inténtalo otra vez.`,
      m
    );
  }
};

handler.help = ["facebook <url>"];
handler.tags = ["downloader"];
handler.command = ["facebook", "fb2"];

export default handler;