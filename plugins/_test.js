import fetch from "node-fetch";
import axios from "axios";

// === SCRAPER VIDFLY FUNCIONAL ===
const ytdl = {
  async get(video) {
    try {
      const api = `https://api.vidfly.ai/api/media/youtube/download?url=${encodeURIComponent(video)}`;

      const headers = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-app-name": "vidfly-web",
        "x-app-version": "1.0.0",
        "user-agent": "Mozilla/5.0 (Android 13; Mobile; rv:146.0) Gecko/146.0 Firefox/146.0",
        "referer": "https://vidfly.ai/"
      };

      const res = await fetch(api, { method: "GET", headers });
      const json = await res.json();

      // VidFly devuelve success: true
      if (!json.success || !json.data) {
        return { status: false, result: null };
      }

      const info = json.data;

      return {
        status: true,
        result: {
          title: info.title,
          img: info.cover,
          dl: info.items.map(i => ({
            type: i.type,
            quality: i.label,
            link: i.url
          }))
        }
      };

    } catch (err) {
      console.log("VidFly Error:", err);
      return { status: false, result: null };
    }
  }
};

// === HANDLER DEL BOT ===
let handler = async (m, { conn, text, args }) => {
  try {
    if (!text) return m.reply("❌ Ingresa un enlace válido de YouTube");

    const url = args[0];
    if (!/(youtu\.be|youtube\.com)/i.test(url))
      return m.reply("⚠️ Enlace inválido de YouTube");

    m.react("⏳");

    // Obtener info del video
    const data = await ytdl.get(url);
    if (!data.status) return m.reply("❌ No se pudo extraer el video");

    const { title, img, dl } = data.result;

    // Filtrar solo mp4
    const mp4 = dl.filter(v => v.type.toLowerCase() === "mp4");

    if (!mp4.length) return m.reply("❌ No hay formato MP4 disponible");

    // La mejor calidad (último item normalmente)
    const best = mp4[mp4.length - 1];

    // Obtener tamaño real
    const size = await getSize(best.link);
    const sizeStr = size ? formatSize(size) : "Desconocido";

    const caption = `
🎬 *${title}*
📁 *Tamaño:* ${sizeStr}
🎞️ *Calidad:* ${best.quality}
    `.trim();

    const buffer = await (await fetch(best.link)).buffer();

    await conn.sendFile(m.chat, buffer, `${title}.mp4`, caption, m);
    m.react("✔️");

  } catch (e) {
    console.log(e);
    m.reply("❌ Error interno");
  }
};

handler.help = ['yt'];
handler.tags = ['download'];
handler.command = ['yt'];

export default handler;

// === FUNCIONES EXTRA ===

async function getSize(url) {
  try {
    const res = await axios.head(url);
    const len = res.headers["content-length"];
    return len ? parseInt(len) : null;
  } catch {
    return null;
  }
}

function formatSize(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}