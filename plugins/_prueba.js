const handler = async (m, { conn, command, args }) => {
  let targetJid = null;

  // 1) Mención
  if (m.mentionedJid?.length > 0) {
    targetJid = m.mentionedJid[0];
  }

  // 2) Responder a un mensaje
  else if (m.quoted) {
    targetJid = m.quoted.sender;
  }

  // 3) Texto como número
  else if (args[0]) {
    const num = args[0].replace(/[^0-9]/g, "");
    if (num) targetJid = num + "@s.whatsapp.net";
  }

  // 4) Si no detecta nada
  if (!targetJid)
    return conn.reply(
      m.chat,
      `⚠️ *Debes mencionar, responder un mensaje o escribir un número.*`,
      m,
      { quoted: m }
    );

  // Convertir a número limpio REAL
  const number = targetJid.replace(/[^0-9]/g, "");

  if (!number)
    return conn.reply(
      m.chat,
      "⚠️ *No pude obtener un número válido.*",
      m,
      { quoted: m }
    );

  // -----------------------------
  // AGREGAR OWNER
  // -----------------------------
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
      `✅ *Nuevo owner agregado temporalmente:*\n+${number}`,
      m,
      { quoted: m }
    );
  }

  // -----------------------------
  // ELIMINAR OWNER
  // -----------------------------
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
      `🗑️ *Owner eliminado:* +${number}`,
      m,
      { quoted: m }
    );
  }
};

handler.help = ["addowner", "delowner"];
handler.tags = ["owner"];
handler.command = ["addowner", "delowner"];

export default handler;