import fs from 'fs';  
import path from 'path';  
import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";


global.subbotBanners = global.banner || {};

let handler = async (m, { conn, isRowner, command }) => {

  // Permisos
  const isSubBots = [conn.user.jid, ...global.owner.map(([number]) => `${number}@s.whatsapp.net`)].includes(m.sender)
  if (!isSubBots) return m.reply(`❀ El comando *${command}* solo puede ser ejecutado por el Socket.`)


  if (!m.quoted || !/image/.test(m.quoted.mimetype)) 
    return m.reply(`🪴 Responde a una imagen con *${command}* para actualizar el banner.`)

  try {

    const media = await m.quoted.download();
    if (!isImageValid(media)) return m.reply(`🪴 Imagen inválida.`)

    let link = await catbox(media);

    
    global.subbotBanners[m.sender] = link;

    
    if (m.sender === conn.user.jid) {
      global.banner = link;
    }

    await conn.sendFile(m.chat, media, 'banner.jpg', `⚡ Banner actualizado solo para tu subbot.`, m);

  } catch (e) {
    console.error(e);
    m.reply(`Hubo un error al cambiar el banner.`);
  }
};

export default handler;

handler.help = ['setbanner'];
handler.tags = ['tools'];
handler.command = ['setbanner'];


// Validar imagen
function isImageValid(buffer) {
  const magic = buffer.slice(0, 4).toString('hex');
  return [
    "ffd8ffe0", "ffd8ffe1", "ffd8ffe2", // JPG
    "89504e47",                         // PNG
    "47494638"                          // GIF
  ].includes(magic);
}

async function catbox(content) {
  const type = await fileTypeFromBuffer(content);
  const blob = new Blob([content.toArrayBuffer()], { type: type.mime });
  const form = new FormData();

  const id = crypto.randomBytes(5).toString("hex");
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", blob, `${id}.${type.ext}`);

  const res = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: form });
  return await res.text();
}