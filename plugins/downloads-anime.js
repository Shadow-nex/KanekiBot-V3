import fetch from "node-fetch";
import Jimp from "jimp";
import { download, detail, search } from "../lib/anime.js";

async function getLangs(episodes) {
    const list = [];
    for (const ep of episodes) {
        try {
            const dl = await download(ep.link);
            const langs = [];
            if (dl?.dl?.sub) langs.push("sub");
            if (dl?.dl?.dub) langs.push("dub");
            list.push({ ...ep, lang: langs });
        } catch {
            list.push({ ...ep, lang: [] });
        }
    }
    return list;
}

async function createThumbnail(coverUrl, title, episode, idiomaLabel) {
    try {
        const img = await Jimp.read(coverUrl);
        const fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        const fontInfo = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

        img.blur(2);
        const overlay = new Jimp(img.bitmap.width, 80, "rgba(0,0,0,0.6)");
        img.composite(overlay, 0, img.bitmap.height - 80);

        img.print(fontTitle, 20, img.bitmap.height - 70, `${title}`);
        img.print(fontInfo, 20, img.bitmap.height - 35, `Ep ${episode} • ${idiomaLabel}`);

        return await img.getBufferAsync(Jimp.MIME_JPEG);
    } catch (err) {
        console.error("⚠️ Error creando thumbnail:", err);
        return Buffer.alloc(0);
    }
}

let handler = async (m, { command, usedPrefix, conn, text, args }) => {
    if (!text) return m.reply(
        `🌱 *Ingresa el título de algún anime o la URL.*\n\n• ${usedPrefix + command} Mushoku Tensei\n• ${usedPrefix + command} https://animeav1.com/media/mushoku-tensei`
    );

    try {
        if (text.includes("https://animeav1.com/media/")) {
            m.react("⌛");
            let info = await detail(args[0]);
            let { title, altTitle, description, cover, votes, rating, total, genres } = info;

            let episodes = await getLangs(info.episodes);
            const gen = genres.join(", ");

            let eps = episodes.map(e => {
                return `• Episodio ${e.ep} (${e.lang.includes("sub") ? "SUB" : ""}${e.lang.includes("dub") ? (e.lang.includes("sub") ? " & " : "") + "DUB" : ""})`;
            }).join("\n");

            let caption = `
乂 \`\`\`ANIME - DOWNLOAD\`\`\`

≡ 🌷 *Título :* ${title} - ${altTitle}
≡ 🌾 *Descripción :* ${description}
≡ 🌲 *Votos :* ${votes}
≡ 🍂 *Rating :* ${rating}
≡ 🍃 *Géneros :* ${gen}
≡ 🌱 *Episodios totales :* ${total}
≡ 🌿 *Episodios disponibles :*

${eps}

> Responde a este mensaje con el número del episodio y el idioma. Ejemplo: *1 sub*, *3 dub*
`.trim();

            let buffer = await (await fetch(cover)).arrayBuffer();
            let sent = await conn.sendMessage(
                m.chat,
                { image: Buffer.from(buffer), caption },
                { quoted: m }
            );

            conn.anime = conn.anime || {};
            conn.anime[m.sender] = {
                title,
                episodes,
                cover,
                key: sent.key,
                downloading: false,
                timeout: setTimeout(() => delete conn.anime[m.sender], 600_000)
            };

        } else {
            m.react("🔍");
            const results = await search(text);
            if (!results.length) return m.reply("❌ No se encontraron resultados.", m);

            let cap = `乂 *ANIME - SEARCH*\n`;
            results.slice(0, 15).forEach((res, index) => {
                cap += `\`${index + 1}\`\n𑁍 *Title :* ${res.title}\n𖠿 *Link :* ${res.link}\n`;
            });

            await conn.sendMessage(m.chat, { text: cap }, { quoted: m });
            m.react("🎋");
        }
    } catch (e) {
        console.error("Error en handler anime:", e);
        m.reply("⚠️ Error al procesar la solicitud: " + e.message);
    }
};

handler.before = async (m, { conn }) => {
    conn.anime = conn.anime || {};
    const session = conn.anime[m.sender];
    if (!session || !m.quoted || m.quoted.id !== session.key.id) return;

    if (session.downloading) return m.reply("⏳ Ya estás descargando un episodio. Espera a que termine.");

    let [epStr, langInput] = m.text.trim().split(/\s+/);
    const epi = parseInt(epStr);
    let idioma = langInput?.toLowerCase();

    if (isNaN(epi)) return m.reply("❌ Número de episodio no válido.");

    const episode = session.episodes.find(e => parseInt(e.ep) === epi);
    if (!episode) return m.reply(`❌ Episodio ${epi} no encontrado.`);

    const inf = await download(episode.link);
    const availableLangs = Object.keys(inf.dl || {});
    if (!availableLangs.length) return m.reply(`❌ No hay idiomas disponibles para el episodio ${epi}.`);

    if (!idioma || !availableLangs.includes(idioma)) {
        idioma = availableLangs[0];
    }

    const idiomaLabel = idioma === "sub" ? "sub español" : "español latino";
    await m.reply(`🌴 Descargando *${session.title}* - cap ${epi} (${idiomaLabel})`);
    m.react("📥");

    session.downloading = true;

    try {
        const videoUrl = inf.dl[idioma];
        let thumb = null;
        try {
            const img = await Jimp.read(session.cover);
            img.resize(300, Jimp.AUTO).quality(70);
            thumb = await img.getBufferAsync(Jimp.MIME_JPEG);
        } catch (err) {
            console.log("⚠️ Error al procesar miniatura:", err.message);
            thumb = Buffer.alloc(0);
        }

        await conn.sendMessage(
            m.chat,
            {
                document: { url: videoUrl },
                fileName: `${session.title} - cap ${epi} ${idiomaLabel}.mp4`,
                mimetype: "video/mp4",
                caption: `🌳 *${session.title}* - cap ${epi}\n🌾 Idioma: ${idiomaLabel}`,
                ...(thumb ? { jpegThumbnail: thumb } : {})
            },
            { quoted: m }
        );

        m.react("✅");
    } catch (err) {
        console.error("Error al descargar:", err);
        m.reply("⚠️ Error al descargar el episodio: " + err.message);
    }

    clearTimeout(session.timeout);
    delete conn.anime[m.sender];
};

handler.command = ["anime", "animedl", "animes"];
handler.tags = ["download"];
handler.help = ["animedl"];
handler.premium = true;
handler.group = true;
handler.register = true;

export default handler;