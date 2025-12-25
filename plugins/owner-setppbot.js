let handler = async (m, { conn, usedPrefix, command, isOwner }) => {

  let media = m.quoted ? m.quoted : m;
  let mime = (media.msg || media).mimetype || '';
  if (!/image\/(jpe?g|png)/i.test(mime)) {
    return conn.reply(m.chat, `🍃 Envía o responde una imagen con el comando:\n\n*${usedPrefix + command}*`, m, rcanal);
  }

  try {
    let img = await media.download();
    await conn.updateProfilePicture(conn.user.jid, img);
    await conn.reply(m.chat, '*✨ Foto de perfil actualizada con éxito.*', m, rcanal);
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '*Ocurrió un error al actualizar la foto de perfil.*', m);
  }
};

handler.help = ['setppbot'];
handler.tags = ['owner'];
handler.command = ['setppbot'];
handler.owner = true;

export default handler;