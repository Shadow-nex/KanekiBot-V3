import fetch from "node-fetch";
import axios from "axios";

let handler = async (m, { conn, text, args }) => {
  try {
    if (!text) return conn.reply(m.chat, `🌷 *Ingresa la URL del video de YouTube.*`, m);

    await conn.sendMessage(m.chat, { text: `🍃 *Descargando tu video...*` }, { quoted: m });

    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be/.test(args[0])) {
      return conn.reply(m.chat, `❌ *Enlace inválido.*`, m);
    }

    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

    let apiURL = `https://api-shadowxyz.vercel.app/download/ytmp4V2?url=${encodeURIComponent(args[0])}`;
    let data = await tryAPI(apiURL);

    if (!data?.status || !data?.result?.download_url) {
      return conn.reply(m.chat, `❌ *La API falló.*`, m);
    }

    const { title, duration, download_url } = data.result;

    const size = await getSize(download_url);
    const sizeStr = size ? await formatSize(size) : 'Desconocido';

    const cleanTitle = title.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_');
    const fileName = `${cleanTitle}.mp4`;

    const caption = `
🎁 *Youtube MP4 V2* ✨  
────────────────  
☃️ *Título:* ${title}  
🦌 *Duración:* ${duration}  
🛷 *Tamaño:* ${sizeStr}  
────────────────`;

    let head = await fetch(download_url, { method: "HEAD" });
    let fileSize = head.headers.get("content-length") || 0;
    let fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

    if (fileSizeMB >= 100) {
      await conn.sendMessage(m.chat, {
        document: { url: download_url },
        mimetype: 'video/mp4',
        fileName,
        caption: `${caption}\n✨ *Enviado como documento (archivo grande)*`
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: download_url },
        mimetype: 'video/mp4',
        caption
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply(`❌ *Error:* ${e.message}`);
  }
};

handler.help = ['ytmp42 <url>'];
handler.tags = ['download'];
handler.command = ['ytmp42'];
handler.group = true;

export default handler;


async function tryAPI(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data?.status) return data;
  } catch {}

  try {
    const res = await fetch(url);
    return await res.json();
  } catch {
    return null;
  }
}

async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  if (!bytes || isNaN(bytes)) return 'Desconocido';
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

async function getSize(url) {
  try {
    const res = await axios.head(url);
    const length = res.headers['content-length'];
    return length ? parseInt(length, 10) : null;
  } catch {
    return null;
  }
}