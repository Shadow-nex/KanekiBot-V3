let handler = async (m, { conn, groupMetadata }) => {
    try {
        const invite = await conn.groupInviteCode(m.chat);
        const link = `https://chat.whatsapp.com/${invite}`;

        const info = `\`\`\`
Group Name : ${groupMetadata.subject}
Group ID   : ${m.chat}
───────────────────────────
Utilice el botón de abajo para copiar el enlace. 
\`\`\``;

        await conn.sendMessage(
            m.chat,
            {
                image: { 
                    url: "https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765105978561_907881.jpeg" 
                },
                caption: info,
                title: "Group Invite Link",
                footer: "© 2024–2025 ",

                interactiveButtons: [
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Copy Group Link",
                            copy_code: link,
                        }),
                    },
                ],
            },
            { quoted: m }
        );

    } catch (e) {
        conn.logger.error(e);
        m.reply(`Error: ${e.message}`);
    }
};

handler.help = ['link2'];
handler.tags = ['group'];
handler.command = ['link2', 'enlace'];
handler.group = true;
handler.botAdmin = true;

export default handler;