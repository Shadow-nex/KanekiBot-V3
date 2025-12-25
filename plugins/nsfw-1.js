/*codigo desarrollo por Deylin 
https://github.com/deylin-eliac
no quites créditos y no modifiques el código*/

// lo modifique xq no me funcionava 😔

import fetch from 'node-fetch';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, command, usedPrefix }) => {

  try {
    if (!text || !/^https?:\/\/\S+/.test(text)) {
      if (!db.data.chats[m.chat].nsfw && m.isGroup) {
        return m.reply(`ꕥ El contenido *NSFW* está desactivado en este grupo.\n\nUn *administrador* puede activarlo con:\n» *${usedPrefix}nsfw on*`);
      }
      return m.reply(`🍃 Enlace inválido.\n\nUso:\n*${usedPrefix}${command} <url>*`);
    }
  } catch {
  }

  await m.reply('🥗 Buscando el video...');

  try {
    const url = text.trim();
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9",
      }
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    let videoUrl = null;
    videoUrl =
      $('video source').attr('src') ||
      $('video').attr('src') ||
      null;

    if (!videoUrl) {
      $('script[type="application/ld+json"]').each((i, el) => {
        try {
          const json = JSON.parse($(el).html());
          if (json && json.contentUrl) videoUrl = json.contentUrl;
          if (json && json.embedUrl && !videoUrl) videoUrl = json.embedUrl;
        } catch {}
      });
    }

    if (!videoUrl) {
      const mp4Regex = /https?:\/\/[^"' ]+\.mp4/gi;
      const matches = html.match(mp4Regex);
      if (matches && matches.length > 0) {
        videoUrl = matches[0];
      }
    }

    if (!videoUrl) {
      throw new Error('No se encontró el video. La web puede estar protegida.');
    }

    if (videoUrl.startsWith("//")) videoUrl = "https:" + videoUrl;
    if (videoUrl.startsWith("/")) {
      const base = new URL(url).origin;
      videoUrl = base + videoUrl;
    }

    await conn.sendFile(
      m.chat,
      videoUrl,
      'video.mp4',
      `✅ *Video encontrado y enviado*\n🔗 Origen:\n${url}`,
      m
    );

  } catch (e) {
    console.error(e);
    m.reply(`⚠️ No se pudo descargar el video.\n\n❗ Error: ${e.message || e}`);
  }
};

handler.command = ['nsfw1'];
handler.tags = ['nsfw'];
handler.help = ['nsfw1'];
handler.register = true;
export default handler;