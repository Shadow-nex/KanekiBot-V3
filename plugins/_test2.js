
import axios from 'axios';

const modelos = {
  miku: { voice_id: "67aee909-5d4b-11ee-a861-00163e2ac61b", voice_name: "Hatsune Miku" },
  nahida: { voice_id: "67ae0979-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nahida" },
  nami: { voice_id: "67ad95a0-5d4b-11ee-a861-00163e2ac61b", voice_name: "Nami" },
  ana: { voice_id: "f2ec72cc-110c-11ef-811c-00163e0255ec", voice_name: "Ana" },
  optimus_prime: { voice_id: "67ae0f40-5d4b-11ee-a861-00163e2ac61b", voice_name: "Optimus Prime" },
  goku: { voice_id: "67aed50c-5d4b-11ee-a861-00163e2ac61b", voice_name: "Goku" },
  taylor_swift: { voice_id: "67ae4751-5d4b-11ee-a861-00163e2ac61b", voice_name: "Taylor Swift" },
  elon_musk: { voice_id: "67ada61f-5d4b-11ee-a861-00163e2ac61b", voice_name: "Elon Musk" },
  mickey_mouse: { voice_id: "67ae7d37-5d4b-11ee-a861-00163e2ac61b", voice_name: "Mickey Mouse" },
  kendrick_lamar: { voice_id: "67add638-5d4b-11ee-a861-00163e2ac61b", voice_name: "Kendrick Lamar" },
  angela_adkinsh: { voice_id: "d23f2adb-5d1b-11ee-a861-00163e2ac61b", voice_name: "Angela Adkinsh" },
  eminem: { voice_id: "c82964b9-d093-11ee-bfb7-e86f38d7ec1a", voice_name: "Eminem" }
};

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
  "Mozilla/5.0 (Linux; Android 8.0.0)"
];

function getRandomIp() {
  return Array.from({ length: 4 }).map(() => Math.floor(Math.random() * 256)).join('.');
}

async function generarTTS(texto, modelo) {
  if (!modelos[modelo]) throw `❌ Modelo "${modelo}" no encontrado!\n\nModelos disponibles:\n` + Object.keys(modelos).join(', ');

  const agent = userAgents[Math.floor(Math.random() * userAgents.length)];
  const { voice_id, voice_name } = modelos[modelo];

  const payload = {
    raw_text: texto,
    url: "https://filme.imyfone.com/text-to-speech/anime-text-to-speech/",
    product_id: "200054",
    convert_data: [{
      voice_id,
      speed: "1",
      volume: "50",
      text: texto,
      pos: 0
    }]
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'X-Forwarded-For': getRandomIp(),
      'User-Agent': agent
    }
  };

  const res = await axios.post('https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts', payload, config);
  const result = res.data?.data?.convert_result?.[0];

  return {
    audio: result?.oss_url,
    voice_name
  };
}

const handler = async (m, { text, conn, command }) => {
  if (!text.includes('|')) return conn.reply(m.chat, `⌬┄┄┄┄┄┄┄┄┄┄┄┄┄┄⌬
       *L I S T A - D E - M O D E L O S*
⌬┄┄┄┄┄┄┄┄┄┄┄┄┄┄⌬

• *miku* - Hatsune Miku 🌀
• *nahida* - Nahida (Exclusivo) 🌿
• *nami* - Nami de One Piece 🌊
• *ana* - Ana (Voz femenina general) 🎙️
• *optimus_prime* - Optimus Prime 🤖
• *goku* - Goku (Dragon Ball) 🟠
• *taylor_swift* - Taylor Swift 🎤
• *elon_musk* - Elon Musk 🧠
• *mickey_mouse* - Mickey Mouse 🐭
• *kendrick_lamar* - Kendrick Lamar 🎶
• *angela_adkinsh* - Angela Adkinsh 👩‍💼
• *eminem* - Eminem 🎧

Usa el formato:
*.tts3 texto|modelo*

Ejemplo:
*.tts3 hola mundo|miku*`, m, rcanal, {
    mentions: [m.sender]
  })

  let [contenido, modelo] = text.split('|').map(v => v.trim().toLowerCase());

  if (!contenido || !modelo) throw `❌ Asegúrate de usar el formato correcto: .${command} texto|modelo\n\nModelos disponibles:\n` + Object.keys(modelos).join(', ');

  let proceso = await conn.sendMessage(m.chat, { text: '🎙️ Generando audio, espera...' }, { quoted: fkontak });

  try {
    const resultado = await generarTTS(contenido, modelo);
    await conn.sendMessage(m.chat, {
      audio: { url: resultado.audio },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: fkontak });
  } catch (e) {
    throw `❌ Error\nLog del error: ${e.message || e}`;
  } finally {
    if (proceso.key) await conn.sendMessage(m.chat, { delete: proceso.key });
  }
};

handler.command = ['tts2'];
handler.help = ['tts2 <texto>|<modelo>'];
handler.tags = ['herramientas'];
handler.group = false;
handler.register = true;

export default handler;