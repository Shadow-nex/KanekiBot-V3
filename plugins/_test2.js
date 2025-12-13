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
  if (!modelos[modelo]) throw new Error('Modelo no válido');

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

  const res = await axios.post(
    'https://voxbox-tts-api.imyfone.com/pc/v1/voice/tts',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'X-Forwarded-For': getRandomIp(),
        'User-Agent': agent
      }
    }
  );

  const audioUrl = res.data?.data?.convert_result?.[0]?.oss_url;
  if (!audioUrl) throw new Error('No se generó el audio');

  const audioBuffer = await axios.get(audioUrl, {
    responseType: 'arraybuffer'
  });

  return {
    buffer: audioBuffer.data,
    voice_name
  };
}

const handler = async (m, { text, conn, command }) => {
  if (!text.includes('|')) {
    return conn.reply(m.chat,
`🎙️ *Text To Speech*

Usa:
.${command} texto|modelo

Ejemplo:
.${command} hola mundo|miku

Modelos:
${Object.keys(modelos).join(', ')}`,
    m);
  }

  let [contenido, modelo] = text.split('|').map(v => v.trim().toLowerCase());

  let msg = await conn.sendMessage(m.chat, { text: '🎧 Generando voz...' }, { quoted: m });

  try {
    const tts = await generarTTS(contenido, modelo);

    await conn.sendMessage(m.chat, {
      audio: tts.buffer,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m });

  } catch (e) {
    await conn.reply(m.chat, `❌ Error:\n${e.message}`, m);
  } finally {
    if (msg?.key) await conn.sendMessage(m.chat, { delete: msg.key });
  }
};

handler.command = ['tts2'];
handler.tags = ['herramientas'];
handler.help = ['tts2 texto|modelo'];

export default handler;