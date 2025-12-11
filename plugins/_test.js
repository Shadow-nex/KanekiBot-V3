/*import fs from 'fs'
import fetch from 'node-fetch'
import Jimp from 'jimp'

let handler = async (m, { conn }) => {
  try {

    const userPp = await conn.profilePictureUrl(m.sender, 'image')
      .catch(() => 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765413098347_567654.jpeg')

    const userImg = await Jimp.read(userPp)
    const userBuffer = await userImg.getBufferAsync(Jimp.MIME_JPEG)

    const iconUrl = 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765413098347_567654.jpeg'
    const iconImg = await Jimp.read(iconUrl)
    iconImg.resize(200, 200)
    const iconBuffer = await iconImg.getBufferAsync(Jimp.MIME_JPEG)

    
    const docBase = new Jimp(600, 600, '#000000')
    docBase.composite(iconImg.resize(150,150), 225, 225)
    const documentBuffer = await docBase.getBufferAsync(Jimp.MIME_JPEG)

    const caption = `
test xd
`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: userPp },
        document: documentBuffer,
        fileName: 'test.jpg',
        mimetype: 'image/jpeg',
        jpegThumbnail: iconBuffer,
        caption,
        headerType: 1,
        viewOnce: true,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: botname,
            body: dev,
            thumbnail: iconBuffer,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
  }
}

handler.help = ['test']
handler.tags = ['main']
handler.command = ['test']

export default handler*/





import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ogmp3 = {
  api: {
    base: "https://api3.apiapi.lat",
    endpoints: {
      a: "https://api5.apiapi.lat",
      b: "https://api.apiapi.lat",
      c: "https://api3.apiapi.lat"
    }
  },

  headers: {
    "authority": "api.apiapi.lat",
    "content-type": "application/json",
    "origin": "https://ogmp3.lat",
    "referer": "https://ogmp3.lat/",
    "user-agent": "Postify/1.0.0"
  },

  formats: {
    video: ["240","360","480","720","1080"],
    audio: ["64","96","128","192","256","320"]
  },

  default_fmt: {
    video: "720",
    audio: "320"
  },

  restrictedTimezones: new Set(["-330","-420","-480","-540"]),

  utils: {
    hash: () => {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array, x => x.toString(16).padStart(2,"0")).join("");
    },

    encoded: (str) => {
      let r = "";
      for (let i = 0; i < str.length; i++)
        r += String.fromCharCode(str.charCodeAt(i) ^ 1);
      return r;
    },

    enc_url: (u, s = ",") => {
      const codes = [...u].map(ch => ch.charCodeAt(0));
      return codes.join(s).split(s).reverse().join(s);
    }
  },

  isUrl: str => {
    try {
      const url = new URL(str);
      const host = url.hostname.toLowerCase();
      const rx = [/^(.+\.)?youtube\.com$/, /^(.+\.)?youtube-nocookie\.com$/, /^youtu\.be$/];
      return rx.some(r => r.test(host)) && !url.searchParams.has("playlist");
    } catch {
      return false;
    }
  },

  youtube: url => {
    if (!url) return null;
    const reg = [
      /watch\?v=([a-zA-Z0-9_-]{11})/,
      /embed\/([a-zA-Z0-9_-]{11})/,
      /v\/([a-zA-Z0-9_-]{11})/,
      /shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let r of reg) if (r.test(url)) return url.match(r)[1];
    return null;
  },

  request: async (endpoint, data = {}, method = "post") => {
    try {
      const eps = Object.values(ogmp3.api.endpoints);
      const sel = eps[Math.floor(Math.random() * eps.length)];
      const url = endpoint.startsWith("http") ? endpoint : sel + endpoint;

      const { data: res } = await axios({
        method,
        url,
        data: method === "post" ? data : undefined,
        headers: ogmp3.headers
      });

      return { status: true, code: 200, data: res };
    } catch (e) {
      return {
        status: false,
        code: e.response?.status || 500,
        error: e.message
      };
    }
  },

  async checkStatus(id) {
    try {
      const c = this.utils.hash();
      const d = this.utils.hash();
      const endpoint = `/${c}/status/${this.utils.encoded(id)}/${d}/`;

      return await this.request(endpoint, { data: id });
    } catch (e) {
      return { status: false, code: 500, error: e.message };
    }
  },

  async checkProgress(data) {
    try {
      for (let i = 0; i < 300; i++) {
        const res = await this.checkStatus(data.i);
        if (!res.status) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        const s = res.data;
        if (s.s === "C") return s;
        if (s.s === "P") {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        return null;
      }
      return null;
    } catch {
      return null;
    }
  },

  async download(link, format, type = "audio") {
    if (!link) return { status: false, code: 400, error: "Ingrese un link." };
    if (!this.isUrl(link)) return { status: false, code: 400, error: "Link inválido." };

    if (!format) format = type === "audio" ? this.default_fmt.audio : this.default_fmt.video;

    const valid = type === "audio" ? this.formats.audio : this.formats.video;
    if (!valid.includes(format))
      return { status: false, code: 400, error: "Formato inválido." };

    const id = this.youtube(link);
    if (!id) return { status: false, code: 400, error: "No pude extraer ID." };

    try {
      for (let r = 0; r < 20; r++) {
        const c = this.utils.hash();
        const d = this.utils.hash();
        const req = {
          data: this.utils.encoded(link),
          format: type === "audio" ? "0" : "1",
          referer: "https://ogmp3.cc",
          mp3Quality: type === "audio" ? format : null,
          mp4Quality: type === "video" ? format : null,
          userTimeZone: new Date().getTimezoneOffset().toString()
        };

        const x = await this.request(
          `/${c}/init/${this.utils.enc_url(link)}/${d}/`,
          req
        );

        if (!x.status) continue;
        const dt = x.data;

        if (dt.le) return { status: false, code: 400, error: "Video demasiado largo." };
        if (dt.i === "blacklisted") return { status: false, code: 429, error: "Límite alcanzado." };
        if (dt.e || dt.i === "invalid") return { status: false, code: 400, error: "Video inválido." };

        if (dt.s === "C") {
          return {
            status: true,
            code: 200,
            result: {
              title: dt.t,
              download: `${this.api.base}/${this.utils.hash()}/download/${this.utils.encoded(dt.i)}/${this.utils.hash()}/`
            }
          };
        }

        const prog = await this.checkProgress(dt);
        if (prog && prog.s === "C") {
          return {
            status: true,
            code: 200,
            result: {
              title: prog.t,
              download: `${this.api.base}/${this.utils.hash()}/download/${this.utils.encoded(prog.i)}/${this.utils.hash()}/`
            }
          };
        }
      }

      return { status: false, code: 500, error: "Falló la conversión." };
    } catch (e) {
      return { status: false, code: 500, error: e.message };
    }
  }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text)
      return conn.reply(m.chat, `Uso: ${usedPrefix + command} <link>`, m);

    await m.react?.("🔎");

    const r = await ogmp3.download(text.trim(), "320", "audio");
    if (!r.status) return conn.reply(m.chat, "❌ " + r.error, m);

    const info = r.result;
    const url = info.download;

    const title = (info.title || "audio")
      .replace(/[\\/:*?\"<>|]/g, "")
      .slice(0, 120);

    const tmp = "./tmp";
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

    const filename = crypto.randomBytes(4).toString("hex") + ".mp3";
    const filepath = path.join(tmp, filename);

    const res = await axios.get(url, {
      responseType: "stream",
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const writer = fs.createWriteStream(filepath);
    res.data.pipe(writer);

    await new Promise(resolve => writer.on("finish", resolve));

    await conn.sendMessage(
      m.chat,
      {
        document: fs.createReadStream(filepath),
        fileName: `${title}.mp3`,
        mimetype: "audio/mpeg"
      },
      { quoted: m }
    );

    fs.unlinkSync(filepath);
    await m.react?.("✅");

  } catch (e) {
    conn.reply(m.chat, "⚠ Error: " + e.message, m);
  }
};

handler.command = ['ytmp32'];

export default handler;