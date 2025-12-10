import fetch from "node-fetch"
import yts from "yt-search"
import crypto from "crypto"
import axios from "axios"

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim())
      return conn.reply(m.chat, `*🍃 Por favor, ingresa el nombre o enlace del video.*`, m, rcanal)

    await m.react('🕒')

    const videoMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|shorts\/|v\/)?([a-zA-Z0-9_-]{11})/)
    const query = videoMatch ? `https://youtu.be/${videoMatch[1]}` : text

    const search = await yts(query)
    const allItems = (search?.videos?.length ? search.videos : search.all) || []
    const result = videoMatch
      ? allItems.find(v => v.videoId === videoMatch[1]) || allItems[0]
      : allItems[0]

    if (!result) throw 'No se encontraron resultados.'

    const { title = 'Desconocido', thumbnail, timestamp = 'N/A', views, ago = 'N/A', url = query, author = {} } = result
    const vistas = formatViews(views)

    const res3 = await fetch("https://files.catbox.moe/wfd0ze.jpg");
    const thumb3 = Buffer.from(await res3.arrayBuffer());

    const fkontak2 = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        documentMessage: {
          title: "𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢.... ..",
          fileName: "🌹 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢....",
          jpegThumbnail: thumb3
        }
      }
    };

    const info = `⌗ ᥫ᭡ *\`YᴏᴜTᴜʙᴇ – Dᴏᴡɴʟᴏᴀᴅ\`*. 🌾

> . ﹡ ﹟ 🌴 ׄ ⬭ *Título:* ${title}
> . ﹡ ﹟ 🌹 ׄ ⬭ *Canal:* ${author.name || '🌨️ Unknown'}
> . ﹡ ﹟ 🌿 ׄ ⬭ *Vistas:* ${vistas}
> . ﹡ ﹟ ⌛ ׄ ⬭ *Duración:* ${timestamp}
> . ﹡ ﹟ 🗓️ ׄ ⬭ *Publicado:* ${ago}
> . ﹡ ﹟ 🎋 ׄ ⬭ *Link:* ${url}`;

    const thumb = (await conn.getFile(thumbnail)).data
    await conn.sendMessage(m.chat, { image: thumb, caption: info, ...fake }, { quoted: fkontak2 })

 
    if (['play', 'mp3'].includes(command)) {

      const audio = await getAudio(url);
      if (!audio) throw `Error al obtener el audio`;

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: audio.url },
          mimetype: 'audio/mpeg',
          fileName: audio.filename
        },
        { quoted: m }
      );

      await m.react('✔️');
    }

    else if (['play2', 'mp4'].includes(command)) {

      const video = await getVid(url);
      if (!video?.url) throw 'No se pudo obtener el video.';

      await conn.sendMessage(
        m.chat,
        {
          video: { url: video.url },
          fileName: `${title}.mp4`,
          mimetype: 'video/mp4',
          caption: `> 🍃 *${title}*`,
          ...fake
        },
        { quoted: m }
      );

      await m.react('✔️');
    }

  } catch (e) {
    await m.react('✖️');
    console.error(e);
    const msg = typeof e === 'string'
      ? e
      : `🎄 Ocurrió un error inesperado.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e?.message || JSON.stringify(e)}`;
    return conn.reply(m.chat, msg, m, fake);
  }
};

handler.command = handler.help = ['play', 'play2', 'mp3', 'mp4'];
handler.tags = ['download'];
export default handler;


const getAudio = async (ytUrl) => {
  try {
    const endpoint = `https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(ytUrl)}&quality=128`;

    const r = await fetch(endpoint);
    const json = await r.json();

    if (!json?.result?.download?.url) return null;

    return {
      status: true,
      url: json.result.download.url,
      filename: json.result.download.filename || "audio.mp3"
    };

  } catch (e) {
    return null;
  }
};

async function getVid(url) {
  const api = `https://api.soymaycol.icu/ytdl?url=${encodeURIComponent(url)}&type=mp4&quality=460&apikey=may-1a3ecc37`;

  try {
    const r = await fetch(api);
    const json = await r.json();

    if (!json?.result?.url) return null;

    return {
      url: json.result.url,
      size: json.result.quality || "Desconocido",
      api: "Maycol"
    };

  } catch (e) {
    return null;
  }
}

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`
  return views.toString()
}