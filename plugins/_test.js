/*
> ```Ytmp3```
By *JTxs*

> ₊·( ✿ ) *g𐐲upᦅ »*
https://chat.whatsapp.com/BTjlRCGYgJrDzHf9dGUSwY 

> ₊·( ✿ ) *cα𝗇α𝗅𝖾s »*
*_🜸 hαsumꪱ - bᦅł - Chα𝗇𝗇𝖾𝗅 ✿ »_* https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n

*_🜸 hαsumꪱ - bᦅł  木 Cᦅdᧉs - Chα𝗇𝗇𝖾𝗅 ✿ »_* https://whatsapp.com/channel/0029VbC5WdJAu3aUfqRb091e

*_( 木 ) Kᦅ𝗅𝖾dα  - bᦅł »_* https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W
*/

import axios from "axios"
import * as cheerio from "cheerio"
import qs from "qs"

let HS = async (m, { conn, args }) => {
let youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
if (!args[0]) return conn.reply(m.chat, `\`»\` Ingresa un *enlace* de *Youtube*`, m)
if (!youtubeRegex.test(args[0])) return conn.reply(m.chat, `\`»\` *Verifica* que el *link* sea de *Youtube*`, m);

try {
let data = await youtube.download(args[0])
await conn.sendMessage(m.chat, { audio: { url: data.audio.dlurl }, fileName: `${data.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })

} catch (error) {
console.error(error)    
}}

HS.help = ['yt + [link]']
HS.tags = ['dl']
HS.command = ['yt']

export default HS

const youtube = {
getData: async url => {
    const config = {
      method: "GET",
      url: `https://qdownloader.cc/button/?url=${encodeURIComponent(url)}`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
        "Accept-Language": "id-ID",
        "Upgrade-Insecure-Requests": "1",
        Referer: "https://qdownloader.cc/en24/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "same-origin",
        "Sec-Fetch-Site": "same-origin",
        Priority: "u=4",
        Cookie: "PHPSESSID=r1a0kjve8mq8tr4v9ik04cft8i; _ga_PQPFKL0J3L=GS1.1.1732027732.1.0.1732027732.0.0.0; _ga=GA1.1.1621456882.1732027733",
      }
    };
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("error fetch", error)
      throw error
    }
  },
  audioJob: async url => {
    const html = await youtube.getData(url);
    const $ = cheerio.load(html);
    const tokenId = $("button#dlbutton").data("token_id");
    const tokenValidTo = $("button#dlbutton").data("token_validto");
    const convert = "gogogo";
    const title = $("button#dlbutton div").text().trim();
    let data = qs.stringify({
      url: url,
      convert: convert,
      token_id: tokenId,
      token_validto: tokenValidTo
    });
    let postConfig = {
      method: "POST",
      url: "https://qdownloader.cc/convert/",
      headers: {
        "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "id-ID",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Referer: `https://qdownloader.cc/button/?url=${encodeURIComponent(url)}`,
        "X-Requested-With": "XMLHttpRequest",
        Origin: "https://qdownloader.cc",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Priority: "u=0",
        Cookie: "PHPSESSID=r1a0kjve8mq8tr4v9ik04cft8i; _ga_PQPFKL0J3L=GS1.1.1732027732.1.0.1732027732.0.0.0; _ga=GA1.1.1621456882.1732027733"
      },
      data: data
    };
    try {
      const postResponse = await axios.request(postConfig);
      const jobid = postResponse.data.jobid;
      return {
        success: true,
        title: title,
        audio: await youtube.getAudio(jobid)
      };
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  },
getAudio: async jobid => {
    const maxRetries = 10
    const waitTime = 4000
    let attempt = 0

    while (attempt < maxRetries) {
        const time = Date.now();
        const config = {
            method: "GET",
            url: `https://qdownloader.cc/convert/?jobid=${jobid}&time=${time}`,
            headers: {
                "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
                Accept: "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "id-ID",
                Referer: `https://qdownloader.cc/button/?url=https://www.youtube.com/watch?v=P-P7NVn4vbQ`,
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                Cookie: "PHPSESSID=r1a0kjve8mq8tr4v9ik04cft8i; _ga_PQPFKL0J3L=GS1.1.1732027732.1.0.1732027732.0.0.0; _ga=GA1.1.1621456882.1732027733"
            }
        };

        try {
            const response = await axios.request(config);

            if (response.data?.dlurl) {
                return { dlurl: response.data.dlurl };
            } else if (response.data?.retry) {
                await new Promise(r => setTimeout(r, waitTime));
                attempt++;
            } else if (response.data?.error) {
            } else {
                throw new Error("Respuesta desconocida del servidor")
            }
        } catch (error) {
            attempt++;
            await new Promise(r => setTimeout(r, waitTime))
        }
    }

    throw new Error("No se pudo obtener el audio después de varios intentos");
},
    
  download: async url => {
    try {
      const data = await youtube.audioJob(url);
      return data;
    } catch (error) {
      return error;
    }
  }
};