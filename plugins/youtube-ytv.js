import fetch from "node-fetch";
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🚫 *Por favor, ingresa la URL del vídeo de YouTube.*`, m, rcanal);
    }

    if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(args[0])) {
      return m.reply(`⚠️ *Enlace inválido. Asegúrate de colocar un enlace válido de YouTube.*`);
    }

    m.react('🕒');
    //await conn.sendMessage(m.chat, { text: "⏳ *⍴rᥱ⍴ᥲrᥲᥒძ᥆ 𝗍ᥙ ᥎іძᥱ᥆ ᥆ᥒіᥴһᥲᥒ...*\n> 🍃 ⍴᥆r 𝖿ᥲ᥎᥆r ᥱs⍴ᥱrᥲ ᥙᥒ᥆s sᥱgᥙᥒძ᥆s 🐢" }, { quoted: m });

    let json = await ytdl(args[0]);
    let size = await getSize(json.url);
    let sizeStr = size ? await formatSize(size) : 'Desconocido';
    

    const caption = `☃️ *${json.title}*  
🍃 \`Tamaño\` » *${sizeStr}*  
💮 \`Enlace\` » *${args[0]}*`;

    await conn.sendFile(m.chat, await (await fetch(json.url)).buffer(), `${json.title}.mp4`, caption, fkontak);
    m.react('✔️');

  } catch (e) {
    console.error(e);
    m.reply(`*Ocurrió un error al procesar tu solicitud:*\n\n${e.message}`);
  }
};

handler.help = ['ytv'];
handler.command = ['ytv'];
handler.tags = ['download'];

export default handler;


async function ytdl(url) {
  const headers = {
    "accept": "*/*",
    "accept-language": "es-ES,es;q=0.9",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://id.ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
  const init = await initial.json();
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|.*v=))([\w-]+)/)?.[1];
  if (!id) throw new Error('No se pudo extraer el ID del video.');

  const convertURL = init.convertURL + `&v=${id}&f=mp4&_=${Math.random()}`;
  const convert = await (await fetch(convertURL, { headers })).json();

  let info = {};
  for (let i = 0; i < 3; i++) {
    const progress = await fetch(convert.progressURL, { headers });
    info = await progress.json();
    if (info.progress === 3) break;
  }

  return {
    url: convert.downloadURL,
    title: info.title || 'video'
  };
}

async function getSize(url) {
  try {
    const response = await axios.head(url);
    const contentLength = response.headers['content-length'];
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch (e) {
    console.error("Error al obtener el tamaño:", e.message);
    return null;
  }
}

async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}