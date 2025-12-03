import axios from "axios";
import * as cheerio from "cheerio";

const pindl = {
    video: async (url) => {
        try {
            const { data: html } = await axios.get(url);
            const $ = cheerio.load(html);

            const mediaDataScript = $('script[data-test-id="video-snippet"]');
            if (!mediaDataScript.length) return null;

            const mediaData = JSON.parse(mediaDataScript.html());

            if (mediaData["@type"] === "VideoObject" && mediaData.contentUrl?.endsWith(".mp4")) {
                return {
                    type: "video",
                    name: mediaData.name,
                    description: mediaData.description,
                    contentUrl: mediaData.contentUrl,
                    thumbnailUrl: mediaData.thumbnailUrl,
                    uploadDate: mediaData.uploadDate,
                    duration: mediaData.duration,
                    keywords: mediaData.keywords || []
                };
            }
            return null;
        } catch {
            return null;
        }
    },

    image: async (url) => {
        try {
            const { data: html } = await axios.get(url);
            const $ = cheerio.load(html);

            const mediaDataScript = $('script[data-test-id="leaf-snippet"]');
            if (!mediaDataScript.length) return null;

            const mediaData = JSON.parse(mediaDataScript.html());

            if (mediaData["@type"] === "SocialMediaPosting" && mediaData.image && !mediaData.image.endsWith(".gif")) {
                return {
                    type: "image",
                    headline: mediaData.headline,
                    image: mediaData.image,
                    date: mediaData.datePublished,
                    keywords: mediaData.keywords || []
                };
            }
            return null;
        } catch {
            return null;
        }
    },

    gif: async (url) => {
        try {
            const { data: html } = await axios.get(url);
            const $ = cheerio.load(html);

            const mediaDataScript = $('script[data-test-id="leaf-snippet"]');
            if (!mediaDataScript.length) return null;

            const mediaData = JSON.parse(mediaDataScript.html());

            if (mediaData["@type"] === "SocialMediaPosting" && mediaData.image?.endsWith(".gif")) {
                return {
                    type: "gif",
                    headline: mediaData.headline,
                    gif: mediaData.image,
                    date: mediaData.datePublished,
                    keywords: mediaData.keywords || []
                };
            }
            return null;
        } catch {
            return null;
        }
    },

    download: async (url) => {
        return (await pindl.video(url)) || (await pindl.image(url)) || (await pindl.gif(url)) || { error: "No se encontró medio" };
    }
};

const downloadBuffer = async (url) => {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(res.data);
};

const handler = async (m, { conn, text }) => {
    if (!text) throw "¿💥 Dónde está la URL?";
    await m.react("🕓");

    try {
        const result = await pindl.download(text);
        if (result.error) throw result.error;

        const maxSize = 10 * 1024 * 1024;

        let caption = `
「✦」 *INFORMACIÓN*
✐ *Tipo:* ${result.type.toUpperCase()}
✐ *Título:* ${result.name || result.headline || "N/A"}
🜸 *Link:* ${result.contentUrl || result.image || result.gif}
🖼 *Thumbnail:* ${result.thumbnailUrl || "N/A"}
📅 *Fecha:* ${result.uploadDate || result.date || "N/A"}
⏳ *Duración:* ${result.duration || "N/A"}
🏷 *Keywords:* ${result.keywords?.join(", ") || "N/A"}
📝 *Descripción:* ${result.description || "N/A"}
`.trim();

        if (result.type === "video" || result.type === "gif") {
            const url = result.contentUrl || result.gif;
            const buffer = await downloadBuffer(url);

            caption += `\n📦 *Tamaño:* ${(buffer.length / 1024 / 1024).toFixed(2)} MB`;

            if (buffer.length > maxSize) {
                caption += `\n⚠️ *El archivo pesa demasiado para enviarlo.* Usa el enlace.`;
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, {
                    video: buffer,
                    caption,
                    mimetype: "video/mp4"
                }, { quoted: m });
            }

        } else if (result.type === "image") {
            await conn.sendMessage(m.chat, {
                image: { url: result.image },
                caption
            }, { quoted: m });
        }

        await m.react("✅");

    } catch (error) {
        await m.react("✖️");
        await conn.sendMessage(m.chat, { text: `Algo salió mal: ${error}` }, { quoted: m });
    }
};

handler.help = ["pinterestdl *<url>*"];
handler.tags = ["descargas"];
handler.command = ['pindl', 'pinterestdl'];

export default handler;