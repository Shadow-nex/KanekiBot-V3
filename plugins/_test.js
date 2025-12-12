import fetch from "node-fetch";
import axios from "axios";

// Scraper Neveloopp (adaptado a ES Modules)
const ytdl = {
  async get(video) {
    try {
      const api = 'https://api.vidfly.ai/api/media/youtube/download';
      const headers = {
        'Content-Type': 'application/json',
        'X-App-Name': 'vidfly-web',
        'X-App-Version': '1.0.0',
        'User-Agent': 'Mozilla/5.0 (Android 13; Mobile; rv:146.0) Gecko/146.0 Firefox/146.0',
        'Referer': 'https://vidfly.ai/es/youtube-video-downloader/'
      };

      const response = await fetch(`${api}?url=${encodeURIComponent(video)}`, { headers });
      const data = await response.json();

      if (data.code !== 0) {
        return { status: false, creator: "Neveloopp", result: null };
      }

      const info = data.data;
      const downloads = [];

      for (const item of info.items) {
        downloads.push({
          type: item.type,
          link: item.url,
          quality: item.label
        });
      }

      return {
        status: true,
        creator: "Neveloopp",
        result: {
          title: info.title,
          img: info.cover,
          dl: downloads
        }
      };
    } catch (error) {
      return { status: false, creator: "Neveloopp", result: null };
    }
  }
};

// Plugin handler
let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🚫 *Ingresa la URL del video de YouTube.*`, m);
    }

    if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(args[0])) {
      return m.reply(`⚠️ *Enlace inválido. Debe ser un enlace válido de YouTube.*`);
    }

    m.react('🕒');

    const data = await ytdl.get(args[0]);
    if (!data.status) {
      return m.reply(`❌ *No se pudo obtener información del video.*`);
    }

    const { title, img, dl } = data.result;

    // Filtrar solo MP4
    const mp4 = dl.filter(v => v.type.toLowerCase() === "mp4");

    if (mp4.length === 0) {
      return m.reply(`❌ *No se encontraron formatos MP4 disponibles.*`);
    }

    // Obtener la mejor calidad (normalmente el último item es el mayor)
    const best = mp4[mp4.length - 1];

    // Obtener tamaño
    const size = await getSize(best.link);
    const sizeStr = size ? formatSize(size) : "Desconocido";

    const caption = `🎬 *${title}*\n📦 *Tamaño:* ${sizeStr}\n🎞️ *Calidad:* ${best.quality}`;

    const buffer = await (await fetch(best.link)).buffer();

    await conn.sendFile(m.chat, buffer, `${title}.mp4`, caption, m);
    m.react('✔️');

  } catch (e) {
    console.error(e);
    m.reply(`⚠️ Error: ${e.message}`);
  }
};

handler.help = ['yt'];
handler.command = ['yt'];
handler.tags = ['download'];

export default handler;


// Obtener tamaño desde headers
async function getSize(url) {
  try {
    const response = await axios.head(url);
    const len = response.headers["content-length"];
    return len ? parseInt(len) : null;
  } catch {
    return null;
  }
}

// Formatear tamaño en MB, GB, etc
function formatSize(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (bytes > 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}