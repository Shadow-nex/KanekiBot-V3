const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

var handler = async (m, { conn, text}) => {

conn.reply(m.chat, `🌿 Buscando un facto, espere un momento...`, m)

conn.reply(m.chat, `*┏━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┓*\n\n❥ *\`"${pickRandom(global.factos)}"\`*\n\n*┗━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┛* `, m)

}
handler.help = ['facto']
handler.tags = ['fun']
handler.command = ['facto']
handler.fail = null
handler.exp = 0
handler.group = true
handler.register = true

export default handler

let hasil = Math.floor(Math.random() * 5000)
function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}

global.factos = [
  "🧴 Eres tan útil como un champú sin tapa.",
  "💾 Si fueras un archivo, estarías dañado y sin respaldo.",
  "📺 Tu vida tiene menos trama que una telenovela cancelada.",
  "📵 Eres como el Wi-Fi en el metro: inexistente.",
  "🪫 Tu energía social está permanentemente descargada.",
  "🧠 Tu cerebro corre en modo ahorro de batería.",
  "🐢 Eres más lento que un meme llegando a Facebook.",
  "💻 Si fueras un programa, serías una versión beta que nadie actualiza.",
  "🐞 Eres el bug que nadie puede arreglar.",
  "📱 Si fueras una app, te desinstalarían por pesado.",
  "📤 Eres el mensaje que nunca se envía.",
  "🧹 Tu presencia es como el polvo: molesta pero inevitable.",
  "🪞 Eres la razón por la que los espejos tienen reflejo selectivo.",
  "📡 Tu lógica no tiene señal.",
  "📉 Eres como las acciones en crisis: en caída constante.",
  "🧊 Tu personalidad es más fría que un refrigerador industrial.",
  "📚 Si fueras un libro, serías uno sin final.",
  "🪫 Eres la batería que se muere justo antes de guardar el progreso.",
  "💔 Tu vida amorosa está en mantenimiento permanente.",
  "🐌 Si fueras una conexión, tendrías lag incluso en modo offline.",
  "💬 Eres el mensaje visto pero nunca respondido.",
  "🕳️ Tu existencia tiene más vacíos que un agujero negro.",
  "🧩 Eres la pieza que no encaja en ningún rompecabezas.",
  "🔥 Si fueras un servidor, estarías caído 24/7.",
  "🧱 Eres el muro que impide que las ideas fluyan.",
  "📼 Tu estilo de vida está en formato VHS.",
  "💡 Tu creatividad brilla... por su ausencia.",
  "🕰️ Tu lógica vive en 1998.",
  "🌫️ Eres más confuso que las instrucciones de un mueble barato.",
  "🪑 Si fueras un mueble, estarías cojo.",
  "⚙️ Tu cerebro necesita urgente una actualización de software.",
  "🧮 Eres el error de cálculo de la naturaleza.",
  "📎 Eres tan relevante como un clip sin papeles.",
  "💤 Tu presencia da sueño en 4K.",
  "📠 Tu humor es más viejo que un fax.",
  "🪲 Eres el bug que los testers ignoraron.",
  "📀 Si fueras un disco, estarías rayado y sin portada.",
  "🧨 Eres el fallo del sistema disfrazado de persona.",
  "🌧️ Si fueras un clima, serías una nube gris sin esperanza.",
  "🚫 Eres la razón por la que existen los tutoriales ‘qué no hacer’.",
  "💣 Tu existencia es un error crítico del universo.",
  "🪫 Eres la notificación de ‘batería baja’ de la vida.",
  "📉 Si fueras una estadística, estarías en la parte negativa.",
  "🧍 Tu carisma tiene la velocidad de carga de un PowerPoint viejo.",
  "🪟 Si fueras una ventana, estarías siempre congelada.",
  "💬 Eres el comentario que nadie pidió.",
  "🪐 Tu lógica orbita lejos de la realidad.",
  "🪞 Si fueras un reflejo, el espejo pediría reinicio.",
  "📦 Eres un paquete sin contenido y con gastos de envío.",
  "🧃 Tu esencia se evaporó hace mucho.",
  "🧤 Si fueras una idea, estarías fuera de temporada.",
  "💢 Tu existencia genera más errores que soluciones.",
  "🪫 Eres el modo ahorro de energía personificado.",
  "📵 Tu señal de vida está en modo avión.",
  "🧱 Eres la pared con la que todos tropiezan.",
  "🕳️ Si fueras un concepto, serías un vacío existencial.",
  "🪣 Eres el balde con fugas del pensamiento lógico.",
  "🧭 Tu sentido común perdió el norte.",
  "📉 Eres el motivo por el que las gráficas bajan.",
  "💬 Si fueras un mensaje, serías el de error permanente.",
  "🧃 Tu aporte a la sociedad se evaporó hace tiempo.",
  "🪫 Eres un procesador corriendo a 1MHz.",
  "🧩 Tu cerebro está en versión demo.",
  "💭 Si fueras una idea, serías la que se borra justo al dormir.",
  "📱 Eres la app que pide permisos innecesarios.",
  "🪫 Tu rendimiento social necesita carga urgente.",
  "🕸️ Eres más viejo que Internet Explorer.",
  "💡 Tu chispa se apagó antes de encenderse.",
  "🗑️ Si fueras un archivo, estarías en la papelera sin restauración.",
  "📛 Eres el error 404 del destino.",
  "🧃 Tu inspiración caducó hace años.",
  "🪤 Eres la trampa perfecta para el fracaso.",
  "🪫 Tu energía está en fase beta desde siempre.",
  "📉 Tu evolución parece ir en reversa.",
  "💬 Eres la notificación que interrumpe la paz.",
  "⚙️ Tu mente tiene más errores que un código sin depurar.",
  "🧠 Si fueras un procesador, serías un Pentium con sobrecalentamiento.",
  "💤 Eres la canción de cuna del aburrimiento.",
  "📡 Tu lógica perdió la conexión hace tiempo.",
  "🪫 Eres el ícono de batería baja en forma humana.",
  "📀 Si fueras música, estarías desafinado.",
  "🪞 Tu reflejo pide vacaciones.",
  "🌚 Eres la fase oscura del humor.",
  "🕳️ Tu pensamiento es un agujero sin fondo.",
  "💾 Si fueras un programa, estarías obsoleto.",
  "🧃 Tu personalidad se derritió en el microondas.",
  "🧱 Eres el muro de contención del progreso.",
  "🧹 Tu talento desapareció con el último reinicio.",
  "🪫 Eres el ventilador que hace ruido pero no enfría.",
  "📺 Si fueras una serie, te cancelarían en el piloto.",
  "💬 Tu conversación genera lag existencial.",
  "🧠 Tu razonamiento corre con gráficos integrados.",
  "🪞 Eres la selfie que nadie quiere ver.",
  "⚡ Tu chispa social nunca hizo contacto.",
  "💻 Si fueras un software, serías shareware con bugs infinitos.",
  "📉 Eres el gráfico de motivación descendente.",
  "📀 Tu lógica gira pero nunca reproduce nada.",
  "🧩 Eres la parte faltante en un juego roto.",
  "💬 Si fueras un comentario, estarías en revisión perpetua.",
  "🪫 Tu energía vital viene sin garantía.",
  "🧠 Eres la versión sin inteligencia artificial.",
  "📎 Si fueras un adjunto, estarías corrupto.",
  "📺 Tu vida se transmite en baja resolución."
];