// - 𝙲𝙾𝙳𝙸𝙶𝙾 𝙲𝚁𝙴𝙰𝙳𝙾 𝚇 𝚂𝙷𝙰𝙳𝙾𝚆-xʏᴢ 𝚇𝙳 👑
// - https://github.com/shadox-xyz/
// - 𝙽𝙾 𝙴𝙳𝙸𝚃𝙰𝚁 𝙴𝙻 𝙲𝙾𝙳𝙸𝙶𝙾 

import fetch from "node-fetch"
import yts from "yt-search"
import crypto from "crypto"
import axios from "axios"
import Jimp from "jimp"

const handler = async (m, { conn, text, usedPrefix, command }) => {

  const getFileSize = async (url) => {
    try {
      const head = await fetch(url, { method: "HEAD" });
      const size = head.headers.get("content-length");
      if (!size) return "Desconocido";
      let mb = (Number(size) / 1024 / 1024).toFixed(2);
      return `${mb} MB`;
    } catch {
      return "Desconocido";
    }
  };

  try {
    if (!text?.trim())
      return conn.reply(m.chat, `*💛 Por favor, ingresa el nombre o enlace del video.*`, m, rcanal);

    await m.react('⏰');
    await conn.sendMessage(m.chat, { text: `> 🌳 Buscando en YouTube:\n> ${text} ` }, { quoted: m });

    const videoMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|shorts\/|v\/)?([a-zA-Z0-9_-]{11})/);
    const query = videoMatch ? `https://youtu.be/${videoMatch[1]}` : text;

    const search = await yts(query);
    const allItems = (search?.videos?.length ? search.videos : search.all) || [];
    const result = videoMatch
      ? allItems.find(v => v.videoId === videoMatch[1]) || allItems[0]
      : allItems[0];

    if (!result) throw 'No se encontraron resultados.';

    const { title = 'Desconocido', thumbnail, timestamp = 'N/A', views, ago = 'N/A', url = query, author = {} } = result;
    const vistas = formatViews(views);

    const info = `*➩ Descargando ›* ${title}

> ◦ ✐ Canal › ${author.name || '❄️ Desconocido'}
> ◦ ♡ Vistas › ${vistas}
> ◦ ✧︎ Duración › ${timestamp}
> ◦ ✿ Calidad › 128k
> ◦ ☁︎ Publicado › ${ago}
> ◦ ❑ Link › ${url}`;

    const thumb = (await conn.getFile(thumbnail)).data;
    await conn.sendMessage(m.chat, { image: thumb, caption: info }, { quoted: m });

    const audio = await savetube.download(url);
    if (!audio?.status) throw `Error al obtener el audio: ${audio?.error || 'Desconocido'}`;

    let thumbDoc = null;
    try {
      const img = await Jimp.read(result.thumbnail);
      img.resize(300, Jimp.AUTO).quality(70);
      thumbDoc = await img.getBufferAsync(Jimp.MIME_JPEG);
    } catch (err) {
      console.log("⚠️ Error al procesar miniatura:", err.message);
      thumbDoc = Buffer.alloc(0);
    }

    const fileSize = await getFileSize(audio.result.download);

    await conn.sendMessage(
      m.chat,
      {
        document: { url: audio.result.download },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        caption: `> 🌴 \`ᴛɪᴛᴜʟᴏ:\` *${title}*
> 🌾 \`ᴛᴀᴍᴀɴ̃ᴏ:\` *${fileSize}*`,
        ...(thumbDoc ? { jpegThumbnail: thumbDoc } : {})
      },
      { quoted: m }
    );

    await m.react('✔️');

  } catch (e) {
    await m.react('✖️');
    console.error(e);
    const msg = typeof e === 'string'
      ? e
      : `🎄 Ocurrió un error inesperado.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e?.message || JSON.stringify(e)}`;
    return conn.reply(m.chat, msg, m, fake);
  }
};

handler.command = ['ytmp3doc', 'ytadoc', 'mp3doc'];
handler.help = ['ytmp3doc + [texto/link]'];
handler.tags = ['download'];
handler.group = true;
handler.register = true;

export default handler;

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    info: "/v2/info",
    download: "/download",
    cdn: "/random-cdn"
  },
  headers: {
    accept: "*/*",
    "content-type": "application/json",
    origin: "https://yt.savetube.me",
    referer: "https://yt.savetube.me/",
    "user-agent": "Mozilla/5.0"
  },
  crypto: {
    hexToBuffer: (hexString) => Buffer.from(hexString.match(/.{1,2}/g).join(""), "hex"),
    decrypt: async (enc) => {
      const secretKey = "C5D58EF67A7584E4A29F6C35BBC4EB12";
      const data = Buffer.from(enc, "base64");
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      const key = savetube.crypto.hexToBuffer(secretKey);
      const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return JSON.parse(decrypted.toString());
    }
  },
  youtube: (url) => {
    const patterns = [
      /youtube.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtu.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns) {
      if (pattern.test(url)) return url.match(pattern)[1];
    }
    return null;
  },
  request: async (endpoint, data = {}, method = "post") => {
    try {
      const url = endpoint.startsWith("http") ? endpoint : `${savetube.api.base}${endpoint}`;
      const { data: response } = await axios({
        method,
        url,
        data: method === "post" ? data : undefined,
        params: method === "get" ? data : undefined,
        headers: savetube.headers
      });
      return { status: true, data: response };
    } catch (error) {
      return { status: false, error: error.message };
    }
  },
  getCDN: async () => {
    const res = await savetube.request(savetube.api.cdn, {}, "get");
    if (!res.status) return res;
    return { status: true, data: res.data.cdn };
  },
  download: async (link) => {
    const id = savetube.youtube(link);
    if (!id) return { status: false, error: "No se pudo obtener ID del video" };
    try {
      const cdnRes = await savetube.getCDN();
      if (!cdnRes.status) return cdnRes;
      const cdn = cdnRes.data;

      const info = await savetube.request(`https://${cdn}${savetube.api.info}`, { url: `https://www.youtube.com/watch?v=${id}` });
      if (!info.status) return info;

      const decrypted = await savetube.crypto.decrypt(info.data.data);
      const dl = await savetube.request(`https://${cdn}${savetube.api.download}`, {
        id,
        downloadType: "audio",
        quality: "mp3",
        key: decrypted.key
      });

      if (!dl.data?.data?.downloadUrl)
        return { status: false, error: "No se pudo obtener link de descarga" };

      return { status: true, result: { download: dl.data.data.downloadUrl, title: decrypted.title } };
    } catch (err) {
      return { status: false, error: err.message };
    }
  }
};

function formatViews(views) {
  if (views === undefined) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`;
  return views.toString();
}