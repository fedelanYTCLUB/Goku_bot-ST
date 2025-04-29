let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

    let txt = `https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY\n
💛 *New:* \`Prueba mi pagina de descargas:\`
URL: https://play-youtubedescargas.vercel.app/\n🌸 *Activa desde hace:* \`${uptime}\`\n
┏━━━°´-̗̀¡!'-̗̀¡!'-̗̀¡!'-̗̀¡!´-°━━━┓
✨ Hola, ${name} Soy *${botname}* ✨
       Como estas :3? 💖
┗━━━°´-̗̀¡!'-̗̀¡!'-̗̀¡!'-̗̀¡!´-°━━━┛

🌸 Información Rápida 🌸
╭ ◇ Cliente: @${userId.split('@')[0]}
│ ✦ Modo: Publica
│ ⚡️ Bot: ${(conn.user.jid == global.conn.user.jid ? 'Principal ⭐' : 'Sub Bot 💎')}
│ 👥 Usuarios: ${totalreg}
│ 📜 Comandos: ${totalCommands}
╰ ⚙️ Baileys: Multi Device
✨───────────────────✨

💡 Tip: Crea tu Sub-Bot con *#qr* o *#code*

─── ⋆⋅☆⋅⋆ ───
🚀 Comandos de Información 🚀
─── ⋆⋅☆⋅⋆ ───
❖ *#help • #menu* ➢ Lista de comandos.
❖ *#uptime • #runtime* ➢ Tiempo activa.
❖ *#sc • #script* ➢ Repositorio oficial.
❖ *#staff • #colaboradores* ➢ Desarrolladores.
❖ *#serbot • #serbot code* ➢ Crea Sub-Bot.
❖ *#bots • #sockets* ➢ Sub-Bots activos.
❖ *#creador* ➢ Contacto del creador.
❖ *#status • #estado* ➢ Estado actual.
❖ *#links • #grupos* ➢ Enlaces oficiales.
❖ *#infobot • #infobot* ➢ Info completa.
❖ *#sug • #newcommand* ➢ Sugiere comando.
❖ *#p • #ping* ➢ Velocidad de respuesta.
❖ *#reporte • #reportar* ➢ Reporta problemas.
❖ *#sistema • #system* ➢ Estado del sistema.
❖ *#speed • #speedtest* ➢ Estadísticas de velocidad.
❖ *#views • #usuarios* ➢ Usuarios registrados.
❖ *#funciones • #totalfunciones* ➢ Todas las funciones.
❖ *#ds • #fixmsgespera* ➢ Elimina archivos de sesión.
❖ *#editautoresponder* ➢ Configura Prompt.

─── ⋆⋅☆⋅⋆ ───
🔍 Comandos de Búsqueda 🔍
─── ⋆⋅☆⋅⋆ ───
❖ *#tiktoksearch • #tiktoks* ➢ Buscador de TikTok.
❖ *#tweetposts* ➢ Buscador de Twitter/X.
❖ *#ytsearch • #yts* ➢ Busca en YouTube.
❖ *#githubsearch* ➢ Busca usuarios de GitHub.
❖ *#cuevana • #cuevanasearch* ➢ Busca en Cuevana.
❖ *#google* ➢ Busca en Google.
❖ *#pin • #pinterest* ➢ Busca en Pinterest.
❖ *#imagen • #image* ➢ Busca imágenes en Google.
❖ *#animesearch • #animess* ➢ Busca en Tioanime.
❖ *#animei • #animeinfo* ➢ Busca capítulos de anime.
❖ *#infoanime* ➢ Info de anime/manga.
❖ *#hentaisearch • #searchhentai* ➢ Busca hentai.
❖ #xnxxsearch • #xnxxs* ➢ Busca en Xnxx.
❖ *#xvsearch • #xvideossearch* ➢ Busca en Xvideos.
❖ *#pornhubsearch • #phsearch* ➢ Busca en Pornhub.
❖ *#npmjs* ➢ Busca en npmjs.

─── ⋆⋅☆⋅⋆ ───
📥 Comandos de Descarga 📥
─── ⋆⋅☆⋅⋆ ───
❖ *#tiktok • #tt* ➢ Descarga videos de TikTok.
❖ *#mediafire • #mf* ➢ Descarga un archivo de MediaFire.
❖ *#pinvid • #pinvideo* + [enlacé] ➢ Descarga vídeos de Pinterest.
❖ *#mega • #mg* + [enlacé] ➢ Descarga un archivo de MEGA.
❖ *#play • #play2* • *#playaudio • #playvideo* ➢ Descarga música/video de YouTube.
❖ *#ytmp3 • #ytmp4* ➢ Descarga música/video de YouTube mediante url.
❖ *#fb • #facebook* ➢ Descarga videos de Facebook.
❖ *#twitter • #x* + [Link] ➢ Descarga un video de Twitter/X
❖ *#ig • #instagram* ➢ Descarga contenido de Instagram.
❖ *#tts • #tiktoks* + [busqueda] ➢ Buscar videos de tiktok
❖ *#terabox • #tb* + [enlace] ➢ Descarga archivos por Terabox.
❖ *#gdrive • #drive* + [enlace] ➢ Descarga archivos por Google Drive.
❖ *#ttimg • #ttmp3* + <url> ➢ Descarga fotos/audios de tiktok.
❖ *#gitclone* + <url> ➢ Descarga un repositorio de github.
❖ *#xvideosdl* ➢ Descarga videos porno de (Xvideos).
❖ *#xnxxdl* ➢ Descarga videos porno de (xnxx).
❖ *#apk • #modapk* ➢ Descarga un apk de Aptoide.
❖ *#tiktokrandom • #ttrandom* ➢ Descarga un video aleatorio de tiktok.
❖ *#npmdl • #npmdownloader* ➢ Descarga paquetes de NPMJs.
❖ *#animelinks • #animedl* ➢ Descarga Links disponibles de descargas.

─── ⋆⋅☆⋅⋆ ───
💰 Comandos de Economía 💰
─── ⋆⋅☆⋅⋆ ───
❖ *#w • #work • #trabajar* ➢ Trabaja para ganar ${moneda}.
❖ *#slut • #protituirse* ➢ Trabaja como prostituta y gana ${moneda}.
❖ *#cf • #suerte* ➢ Apuesta tus ${moneda} a cara o cruz.
❖ *#crime • #crimen* ➢ Trabaja como ladrón para ganar ${moneda}.
❖ *#ruleta • #roulette • #rt* ➢ Apuesta ${moneda} al color rojo o negro.
❖ *#casino • #apostar* ➢ Apuesta tus ${moneda} en el casino.
❖ *#slot* ➢ Apuesta tus ${moneda} en la ruleta y prueba tu suerte.
❖ *#cartera • #wallet* ➢ Ver tus ${moneda} en la cartera.
❖ *#banco • #bank* ➢ Ver tus ${moneda} en el banco.
❖ *#deposit • #depositar • #d* ➢ Deposita tus ${moneda} al banco.
❖ *#with • #retirar • #withdraw* ➢ Retira tus ${moneda} del banco.
❖ *#transfer • #pay* ➢ Transfiere ${moneda} o XP a otros usuarios.
❖ *#miming • #minar • #mine* ➢ Trabaja como minero y recolecta recursos.
❖ *#buyall • #buy* ➢ Compra ${moneda} con tu XP.
❖ *#daily • #diario* ➢ Reclama tu recompensa diaria.
❖ *#cofre* ➢ Reclama un cofre diario lleno de recursos.
❖ *#weekly • #semanal* ➢ Reclama tu regalo semanal.
❖ *#monthly • #mensual* ➢ Reclama tu recompensa mensual.
❖ *#steal • #robar • #rob* ➢ Intenta robarle ${moneda} a alguien.
❖ *#robarxp • #robxp* ➢ Intenta robar XP a un usuario.
❖ *#eboard • #baltop* ➢ Ranking de usuarios con más ${moneda}.
❖ *#aventura • #adventure* ➢ Aventúrate en un nuevo reino.
❖ *#curar • #heal* ➢ Cura tu salud.
❖ *#cazar • #hunt • #berburu* ➢ Caza animales.
❖ *#inv • #inventario* ➢ Ver tu inventario.
❖ *#mazmorra • #explorar* ➢ Explora mazmorras.
❖ *#halloween* ➢ Dulce o truco (Halloween).
❖ *#christmas • #navidad* ➢ Regalo navideño (Navidad).

─── ⋆⋅☆⋅⋆ ───
🍀 Comandos de Gacha 🍀
─── ⋆⋅☆⋅⋆ ───
❖ *#rollwaifu • #rw • #roll* ➢ Waifu o husbando aleatorio.
❖ *#claim • #c • #reclamar* ➢ Reclamar un personaje.
❖ *#harem • #waifus • #claims* ➢ Ver tus personajes reclamados.
❖ *#charimage • #waifuimage • #wimage* ➢ Ver imagen de personaje.
❖ *#charinfo • #winfo • #waifuinfo* ➢ Información de personaje.
❖ *#givechar • #givewaifu • #regalar* ➢ Regalar un personaje.
❖ *#vote • #votar* ➢ Votar por un personaje.
❖ *#waifusboard • #waifustop • #topwaifus* ➢ Top de personajes.

─── ⋆⋅☆⋅⋆ ───
🎨 Comandos de Sticker 🎨
─── ⋆⋅☆⋅⋆ ───
❖ *#sticker • #s* ➢ Crea stickers (imagen/video).
❖ *#setmeta* ➢ Establece pack y autor.
❖ *#delmeta* ➢ Elimina tu pack de stickers.
❖ *#pfp • #getpic* ➢ Obtén foto de perfil.
❖ *#qc* ➢ Crea stickers con texto o de usuario.
❖ *#toimg • #img* ➢ Convierte stickers a imagen.
❖ *#brat • #ttp • #attp*︎ ➢ Crea stickers con texto.
❖ *#emojimix* ➢ Fusiona 2 emojis en sticker.
❖ *#wm* ➢ Cambia el nombre de los stickers.

─── ⋆⋅☆⋅⋆ ───
🛠️ Comandos de Herramientas 🛠️
─── ⋆⋅☆⋅⋆ ───
❖ *#calcular • #calcular • #cal* ➢ Calcula ecuaciones.
❖ *#tiempo • #clima* ➢ Ver el clima.
❖ *#horario* ➢ Ver horario global.
❖ *#fake • #fakereply* ➢ Crea mensaje falso.
❖ *#enhance • #remini • #hd* ➢ Mejora calidad de imagen.
❖ *#letra* ➢ Cambia la fuente de las letras.
❖ *#read • #readviewonce • #ver* ➢ Ver imágenes de una sola vista.
❖ *#whatmusic • #shazam* ➢ Descubre canciones/vídeos.
❖ *#spamwa • #spam* ➢ Envia spam a un usuario.
❖ *#ss • #ssweb* ➢ Ver estado de página web.
❖ *#length • #tamaño* ➢ Cambia tamaño de imágenes/vídeos.
❖ *#say • #decir* + [texto] ➢ Repite un mensaje.
❖ *#todoc • #toducument* ➢ Crea documentos (audio, imágenes, vídeos).
❖ *#translate • #traducir • #trad* ➢ Traduce palabras.

─── ⋆⋅☆⋅⋆ ───
👤 Comandos de Perfil 👤
─── ⋆⋅☆⋅⋆ ───
❖ *#reg • #verificar • #register* ➢ Registra nombre y edad.
❖ *#unreg* ➢ Elimina tu registro.
❖ *#profile* ➢ Muestra tu perfil.
❖ *#marry* [mension / etiquetar] ➢ Propón matrimonio.
❖ *#divorce* ➢ Divórciate de tu pareja.
❖ *#setgenre • #setgenero* ➢ Establece tu género.
❖ *#delgenre • #delgenero* ➢ Elimina tu género.
❖ *#setbirth • #setnacimiento* ➢ Establece tu fecha de nacimiento.
❖ *#delbirth • #delnacimiento* ➢ Elimina fecha de nacimiento.
❖ *#setdescription • #setdesc* ➢ Establece una descripción.
❖ *#deldescription • #deldesc* ➢ Elimina la descripción.
❖ *#lb • #lboard* + <Paginá> ➢ Top de usuarios (experiencia/nivel).
❖ *#level • #lvl* + <@Mencion> ➢ Ver tu nivel y experiencia.
❖ *#comprarpremium • #premium* ➢ Compra pase premium.
❖ *#confesiones • #confesar* ➢ Confiesa de manera anónima.

─── ⋆⋅☆⋅⋆ ───
🏘️ Comandos de Grupos 🏘️
─── ⋆⋅☆⋅⋆ ───
❖ *#config • #on* ➢ Ver opciones de configuración.
❖ *#hidetag* ➢ Menciona a todos.
❖ *#gp • #infogrupo* ➢ Ver Información del grupo.
❖ *#linea • #listonline* ➢ Ver lista de usuarios en línea.
❖ *#setwelcome* ➢ Establecer mensaje de bienvenida.
❖ *#setbye* ➢ Establecer mensaje de despedida.
❖ *#link* ➢ El bot envía el link del grupo.
❖ *#admins • #admin* ➢ Menciona a los admins.
❖ *#restablecer • #revoke* ➢ Restablecer enlace del grupo.
❖ *#grupo • #group* [open / abrir] ➢ Abre el grupo.
❖ *#grupo • #gruop* [close / cerrar] ➢ Cierra el grupo.
❖ *#kick* [número / mension] ➢ Elimina un usuario.
❖ *#add • #añadir • #agregar* [número] ➢ Invita a un usuario.
❖ *#promote* [mension / etiquetar] ➢ Da administrador.
❖ *#demote* [mension / etiquetar] ➢ Quita administrador.
❖ *#gpbanner • #groupimg* ➢ Cambia imagen del grupo.
❖ *#gpname • #groupname* ➢ Cambia nombre del grupo.
❖ *#gpdesc • #groupdesc* ➢ Cambia descripción del grupo.
❖ *#advertir • #warn • #warning* ➢ Da una advertencia.
❖ ︎*#unwarn • #delwarn* ➢ Quita advertencias.
❖ *#advlist • #listadv* ➢ Ver lista de advertidos.
❖ *#bot on* ➢ Enciende el bot en grupo.
❖ *#bot off* ➢ Apaga el bot en grupo.
❖ *#mute* [mension / etiquetar] ➢ El bot elimina mensajes.
❖ *#unmute* [mension / etiquetar] ➢ El bot deja de eliminar mensajes.
❖ *#encuesta • #poll* ➢ Crea una encuesta.
❖ *#delete • #del* ➢ Elimina mensaje de otros.
❖ *#fantasmas* ➢ Ver lista de inactivos.
❖ *#kickfantasmas* ➢ Elimina a los inactivos.
❖ *#invocar • #tagall • #todos* ➢ Invoca a todos.
❖ *#setemoji • #setemo* ➢ Cambia emoji de invitación.
❖ *#listnum • #kicknum* ➢ Elimina por prefijo de país.

─── ⋆⋅☆⋅⋆ ───
🎭 Comandos de Anime Reacciones 🎭
─── ⋆⋅☆⋅⋆ ───
❖ *#angry • #enojado* + <mencion> ➢ Estar enojado.
❖ *#bite* + <mencion> ➢ Muerde a alguien.
❖ *#bleh* + <mencion> ➢ Sacar la lengua.
❖ *#blush* + <mencion> ➢ Sonrojarte.
❖ *#bored • #aburrido* + <mencion> ➢ Estar aburrido.
❖ *#cry* + <mencion> ➢ Llorar.
❖ *#cuddle* + <mencion> ➢ Acurrucarse.
❖ *#dance* + <mencion> ➢ Bailar.
❖ *#drunk* + <mencion> ➢ Estar borracho.
❖ *#eat • #comer* + <mencion> ➢ Comer algo.
❖ *#facepalm* + <mencion> ➢ Dar una palmada en la cara.
❖ *#happy • #feliz* + <mencion> ➢ Salta de felicidad.
❖ *#hug* + <mencion> ➢ Dar un abrazo.
❖ *#impregnate • #preg* + <mencion> ➢ Embarazar a alguien.
❖ *#kill* + <mencion> ➢ Mata a alguien.
❖ *#kiss • #besar* • #kiss2 + <mencion> ➢ Dar un beso.
❖ *#laugh* + <mencion> ➢ Reírte.
❖ *#lick* + <mencion> ➢ Lamer a alguien.
❖ *#love • #amor* + <mencion> ➢ Sentirse enamorado.
❖ *#pat* + <mencion> ➢ Acaricia a alguien.
❖ *#poke* + <mencion> ➢ Picar a alguien.
❖ *#pout* + <mencion> ➢ Hacer pucheros.
❖ *#punch* + <mencion> ➢ Dar un puñetazo.
❖ *#run* + <mencion> ➢ Correr.
❖ *#sad • #triste* + <mencion> ➢ Expresar tristeza.
❖ *#scared* + <mencion> ➢ Estar asustado.
❖ *#seduce* + <mencion> ➢ Seducir a alguien.
❖ *#shy • #timido* + <mencion> ➢ Sentir timidez.
❖ *#slap* + <mencion> ➢ Dar una bofetada.
❖ *#dias • #days* ➢ Dar los buenos días.
❖ *#noches • #nights* ➢ Dar las buenas noches.
❖ *#sleep* + <mencion> ➢ Tumbarte a dormir.
❖ *#smoke* + <mencion> ➢ Fumar.
❖ *#think* + <mencion> ➢ Pensar.

─── ⋆⋅☆⋅⋆ ───
🔞 Comandos NSFW (18+) 🔞
─── ⋆⋅☆⋅⋆ ───
❖ *#anal* + <mencion> ➢ Hacer un anal.
❖ *#waifu* ➢ Busca una waifu aleatoria.
❖ *#bath* + <mencion> ➢ Bañarse.
❖ *#blowjob • #mamada • #bj* + <mencion> ➢ Dar una mamada.
❖ *#boobjob* + <mencion> ➢ Hacer una rusa.
❖ *#cum* + <mencion> ➢ Venirse en alguien.
❖ *#fap* + <mencion> ➢ Hacerse una paja.
❖ *#ppcouple • #ppcp* ➢ Genera imágenes para amistades/parejas.
❖ *#footjob* + <mencion> ➢ Hacer una paja con los pies.
❖ *#fuck • #coger • #fuck2* + <mencion> ➢ Follarte a alguien.
❖ *#cafe • #coffe* ➢ Tomar un cafecito.
❖ *#violar • #perra* + <mencion> ➢ Viola a alguien.
❖ *#grabboobs* + <mencion> ➢ Agarrar tetas.
❖ *#grop* + <mencion> ➢ Manosear a alguien.
❖ *#lickpussy* + <mencion> ➢ Lamer un coño.
❖ *#rule34 • #r34* + [Tags] ➢ Buscar imágenes en Rule34.
❖ *#sixnine • #69* + <mencion> ➢ Haz un 69.
❖ *#spank • #nalgada* + <mencion> ➢ Dar una nalgada.
❖ *#suckboobs* + <mencion> ➢ Chupar tetas.
❖ *#undress • #encuerar* + <mencion> ➢ Desnudar a alguien.
❖ *#yuri • #tijeras* + <mencion> ➢ Hacer tijeras.

─── ⋆⋅☆⋅⋆ ───
🎮 Comandos de Juegos 🎮
─── ⋆⋅☆⋅⋆ ───
❖ *#amistad • #amigorandom* ➢ Hacer amigos con un juego.
❖ *#chaqueta • #jalamela* ➢ Hacerte una chaqueta.
❖ *#chiste* ➢ La bot te cuenta un chiste.
❖ *#consejo* ➢ La bot te da un consejo.
❖ *#doxeo • #doxear* + <mencion> ➢ Simular un doxeo falso.
❖ *#facto* ➢ La bot te lanza un facto.
❖ *#formarpareja* ➢ Forma una pareja.
❖ *#formarpareja5* ➢ Forma 5 parejas diferentes.
❖ *#frase* ➢ La bot te da una frase.
❖ *#huevo* ➢ Agarrale el huevo a alguien.
❖ *#chupalo* + <mencion> ➢ Hacer que un usuario te la chupe.
❖ *#aplauso* + <mencion> ➢ Aplaudirle a alguien.
❖ *#marron* + <mencion> ➢ Burlarte del color de piel.
❖ *#suicidar* ➢ Suicidate.
❖ *#iq • #iqtest* + <mencion> ➢ Calcular el iq.
❖ *#meme* ➢ Meme aleatorio.
❖ *#morse* ➢ Convierte a codigo morse.
❖ *#nombreninja* ➢ Busca nombre ninja.
❖ *#paja • #pajeame* ➢ La bot te hace una paja.
❖ *#personalidad* + <mencion> ➢ Busca tu personalidad.
❖ *#piropo* ➢ Lanza un piropo.
❖ *#pregunta* ➢ Hazle una pregunta.
❖ *#ship • #pareja* ➢ Probabilidad de pareja.
❖ *#sorteo* ➢ Empieza un sorteo.
❖ *#top* ➢ Empieza un top.
❖ *#formartrio* + <mencion> ➢ Forma un trío.
❖ *#ahorcado* ➢ Juega Ahorcado.
❖ *#genio* ➢ Pregunta con el Genio.
❖ *#mates • #matematicas* ➢ Juega Matemáticas.
❖ *#ppt* ➢ Juega Piedra, Papel o Tijeras.
❖ *#sopa • #buscarpalabra* ➢ Juega Sopa de Letras.
❖ *#pvp • #suit* + <mencion> ➢ Juega un pvp.
❖ *#ttt* ➢ Crea sala de Tres en Raya.
  `.trim()

  await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              // Asegúrate de que channelRD esté definido en tu bot con un ID y nombre válidos
              newsletterJid: channelRD.id,
              newsletterName: channelRD.name,
              serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
              title: botname, // Asegúrate de que botname esté definido
              body: textbot, // Asegúrate de que textbot esté definido
              thumbnailUrl: banner, // Asegúrate de que banner esté definido
              sourceUrl: redes, // Asegúrate de que redes esté definido
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
          },
      },
  }, { quoted: m })

}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
