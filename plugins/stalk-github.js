import axios from "axios"

const handler = async (m, { conn, text }) => {
   if (!text) {
      return conn.reply(m.chat, '*🌹 Ingresa un nombre de usuario de GitHub.*', m)
   }

   const frames = [
      "《██▒▒▒▒▒▒▒▒▒▒▒》10%",
      "《████▒▒▒▒▒▒▒▒▒》30%",
      "《███████▒▒▒▒▒▒》50%",
      "《██████████▒▒▒》70%",
      "《█████████████》100%",
      "✔ *Carga completada*"
   ]

   let { key } = await conn.sendMessage(m.chat, { text: '🌴 *Cargando...*' })

   for (let frame of frames) {
      await conn.sendMessage(m.chat, { text: frame, edit: key })
      await new Promise(r => setTimeout(r, 300))
   }

   let data
   try {
      data = await githubStalk(text)
   } catch (e) {
      return conn.reply(m.chat, '*No encontré ese usuario en GitHub.*', m)
   }

   const {
      username, bio, company, blog, location, email,
      public_repo, public_gists, followers, following,
      type, profile_pic
   } = data

   const resultado = `
*\`⬤── 「 GITHUB STALK 」 ──⬤\`*

👤 *Usuario:* ${username || "-"}
💬 *Bio:* ${bio || "-"}
🏢 *Compañía:* ${company || "-"}
📧 *Email:* ${email || "-"}
🔗 *Blog:* ${blog || "-"}
📍 *Ubicación:* ${location || "-"}
📁 *Repos públicos:* ${public_repo}
📌 *Gists:* ${public_gists}
🌱 *Followers:* ${followers}
🌿 *Siguiendo:* ${following}
⭐ *Tipo:* ${type}
`

   await conn.sendFile(m.chat, profile_pic, "github.jpg", resultado, m)
}

handler.help = ["githubstalk <usuario>"]
handler.tags = ["stalk"]
handler.command = ["githubstalk"]
handler.group = true
export default handler


async function githubStalk(user) {
   const { data } = await axios.get(`https://api.github.com/users/${user}`)
   return {
      username: data.login,
      bio: data.bio,
      company: data.company,
      blog: data.blog,
      location: data.location,
      email: data.email,
      public_repo: data.public_repos,
      public_gists: data.public_gists,
      followers: data.followers,
      following: data.following,
      type: data.type,
      profile_pic: data.avatar_url
   }
}