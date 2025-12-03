// ——————————————————————————————
//   FFMPEG + CONVERTIDOR + PLUGIN
// ——————————————————————————————

import { promises } from 'fs';
import { join, dirname } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

// Ruta universal Windows/Linux
const __dirname = dirname(fileURLToPath(import.meta.url));

// ————————————————
//   FUNCIÓN FFMPEG
// ————————————————
function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const tmp = join(__dirname, 'tmp', Date.now() + '.' + ext);
      const out = tmp + '.' + ext2;

      await promises.writeFile(tmp, buffer);

      spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out,
      ])
        .on('error', reject)
        .on('close', async (code) => {
          try {
            await promises.unlink(tmp);
            if (code !== 0) return reject(code);

            resolve({
              data: await promises.readFile(out),
              filename: out,
              delete() {
                return promises.unlink(out);
              },
            });

          } catch (e) {
            reject(e);
          }
        });

    } catch (e) {
      reject(e);
    }
  });
}

// ————————————————
//   CONVERTIDORES
// ————————————————
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
  ], ext, 'ogg');
}

function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10',
  ], ext, 'opus');
}

function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow',
  ], ext, 'mp4');
}

// ————————————————
//   PLUGIN: VIDEO → AUDIO
// ————————————————
let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  if (!mime || !mime.includes('video'))
    return m.reply('Responde a un video para convertirlo a audio.');

  try {
    let buffer = await q.download();
    let ext = mime.split('/')[1];

    let out = await toAudio(buffer, ext);

    await conn.sendMessage(m.chat, {
      audio: out.data,
      fileName: `audio_${Date.now()}.opus`,
      mimetype: 'audio/ogg; codecs=opus',
    }, { quoted: m });

    await out.delete();

  } catch (e) {
    console.error(e);
    m.reply('Error al convertir el video.');
  }
};

handler.command = /^(tomp3|convert|mp3)$/i;

export default handler;