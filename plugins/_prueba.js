const handler = async (m, { conn, command, args }) => {
  // Obtener JID o número
  const target =
    m.mentionedJid?.[0] ||
    (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null);

  if (!target)
    return conn.reply(
      m.chat,
      `⚠️ *Debes mencionar o escribir un número.*\n\nEjemplos:\n.addowner @user\n.delowner @user`,
      m,
      { quoted: m } // 🔥 responde al mensaje del usuario
    );

  // Obtener solo número
  const number = target.replace(/[^0-9]/g, "");

  if (!number)
    return conn.reply(m.chat, "⚠️ *Número inválido.*", m, { quoted: m });

  // ➕ AGREGAR OWNER
  if (command === "addowner") {
    if (global.owner.includes(number))
      return conn.reply(
        m.chat,
        `⚠️ *El usuario +${number} ya es owner.*`,
        m,
        { quoted: m }
      );

    global.owner.push(number);

    return conn.reply(
      m.chat,
      `✅ *Nuevo owner agregado temporalmente:*\n@${number}`,
      m,
      { mentions: [target], quoted: m } // 🔥 respuesta al mensaje
    );
  }

  // ➖ ELIMINAR OWNER
  if (command === "delowner") {
    if (!global.owner.includes(number))
      return conn.reply(
        m.chat,
        `⚠️ *El usuario +${number} no es owner.*`,
        m,
        { quoted: m }
      );

    global.owner = global.owner.filter(v => v !== number);

    return conn.reply(
      m.chat,
      `🗑️ *Owner eliminado:* @${number}`,
      m,
      { mentions: [target], quoted: m } // 🔥 respuesta al mensaje
    );
  }
};

handler.help = ["addowner @user", "delowner @user"];
handler.tags = ["owner"];
handler.command = ["addowner", "delowner"];

export default handler;