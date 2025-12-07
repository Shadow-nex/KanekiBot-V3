let handler = async (m, { conn, text, participants, groupMetadata }) => {
    // Obtener el link del mismo grupo
    let invite = await conn.groupInviteCode(m.chat)
    let groupLink = `https://chat.whatsapp.com/${invite}`

    // Mensaje inicial
    let isiPesan = text 
        ? `📝 *Mensaje del administrador:*\n${text}\n\n🔗 *Ir al grupo:* ${groupLink}`
        : `*––––––『 TAG A TODOS 』––––––*\n\n🔗 *Ir al grupo:* ${groupLink}`;

    let teks = `${isiPesan}`

    // Mencionar a todos
    for (let mem of participants) {
        teks += `\n@${mem.id.split("@")[0]}`
    }

    await conn.sendMessage(m.chat, { 
        text: teks, 
        mentions: participants.map(a => a.id)
    })
};

handler.help = ["tagall", "invocar"];
handler.tags = ["group"];
handler.command = ['tagall', 'all', 'invocar', 'todos'];
handler.admin = true;
handler.group = true;

export default handler;