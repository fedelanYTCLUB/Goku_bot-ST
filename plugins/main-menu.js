let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    // Asegúrate de que 'moneda' esté definido en tu configuración global si es necesario para la sección de economía
    let moneda = global.db.data.settings[conn.user.jid].moneda || '¥enes $'; // Símbolo para moneda

    let txt = `
- - - - - - - - - - - - - - - - - -

*.*.*.*.*.*.*.*.*.*.*.*.*.*.*.*.*
> ♥ ¡Hola! @${userId.split('@')[0]}, Soy *${conn.user.name.split(' ')[0] || 'Mai'}*, ¡Tu bot amiguita! Aquí tienes la lista de comandos. (*^-^*)

╭─── ◆ INFO BOT ◆ ───
│ ➢ Estado: ${(conn.user.jid == global.conn.user.jid ? '○ Bot Principal' : '● Sub-Bot Activa')}
│ ★ Versión: \`^2.3.0\` (Multi Device)
│ ◆ Activa: \`${uptime}\`
│ ▼ Usuarios: *${totalreg}* amiguitos!
│ ✎ Comandos: *${totalCommands}* funciones!
│ ✿ Modo: \`Público para todos\`
│ ◎ Creador: Wirk 🫆
╰─────────────────
> ✓ Crea un *Sub-Bot* con tu número usando *#qr* o *#code*
-=-=-=-=-=-=-=-=-=-=-=-=-=-

╭─── ◆ INFO ◆ ───
> ❀ *Comandos de estado e información del Bot.*
▶ *#help • #menu*
> ➤ Ver la lista de comandos. ☆
▶ *#uptime • #runtime*
> ➤ Tiempo activo del Bot. ⏱
▶ *#sc • #script*
> ➤ Enlace del repositorio oficial. □
▶ *#serbot • #serbot code*
> ➤ Crear sesión como Sub-Bot. ♥
▶ *#bots • #sockets*
> ➤ Ver lista de Sub-Bots activos. ♦
▶ *#creador*
> ➤ Contacto del creador. ★
▶ *#status • #estado*
> ➤ Estado actual del Bot. ◎
▶ *#links • #grupos*
> ➤ Enlaces oficiales de grupos. ✿
▶ *#sug • #newcommand*
> ➤ Sugerir un nuevo comando. ✎
▶ *#p • #ping*
> ➤ Velocidad de respuesta. ◆
▶ *#reporte • #reportar*
> ➤ Reportar una falla o problema. ✓
▶ *#sistema • #system*
> ➤ Salud interna del Bot. ○
▶ *#speed • #speedtest*
> ➤ Velocidad de respuesta. ▶
▶ *#views • #usuarios*
> ➤ Ver cuántos amigos tengo. ★
▶ *#funciones • #totalfunciones*
> ➤ Todas las funciones. ◇
▶ *#ds • #fixmsgespera*
> ➤ Ayuda a ordenar mensajes. ➜
▶ *#editautoresponder*
> ➤ Enseñar a responder. ✍
╰───────────────

╭─── ◆ SEARCHS ◆ ───
> ❀ *Comandos para búsquedas en plataformas.*
▶ *#tiktoksearch • #tiktoks*
> ➤ Buscador de videos de tiktok. ♪
▶ *#tweetposts*
> ➤ ¿Qué dice Twitter/X? 🐦
▶ *#ytsearch • #yts*
> ➤ Búsquedas de Youtube. ▶
▶ *#githubsearch*
> ➤ Buscador de usuarios de GitHub. ⚙
▶ *#cuevana • #cuevanasearch*
> ➤ Buscador de películas/series por Cuevana. 🎬
▶ *#google*
> ➤ Búsquedas por Google. 🌐
▶ *#pin • #pinterest*
> ➤ Buscador de imagenes de Pinterest. ✿
▶ *#image • #imagen*
> ➤ Buscador de imagenes de Google. 🖼
▶ *#animesearch • #animess*
> ➤ Busca tu anime en Tioanime! 📺
▶ *#animei • #animeinfo*
> ➤ Info de capítulos de anime! 📚
▶ *#infoanime*
> ➤ Detalles de tu anime o manga! 📖
▶ *#hentaisearch • #searchhentai*
> ➤ Buscador de animes hentai. (Solo +18) 🤫
▶ *#xnxxsearch • #xnxxs*
> ➤ Buscador de vídeos de Xnxx. (Adultos, cuidado! 🔞)
▶ *#xvsearch • #xvideossearch*
> ➤ Buscador de vídeos de Xvideos. (Adultos! 🔞)
▶ *#pornhub • #phub*
> ➤ Buscador de videos de Pornhub. (Solo +18! 🔞)
▶ *#npmjs*
> ➤ Buscador de npmjs. 📦
╰───────────────

╭─── ◆ DOWNLOAD ◆ ───
> ❀ *Comandos para descargas de archivos.*
▶ *#tiktok • #tt*
> ➤ Descarga videos de TikTok. ↓♪
▶ *#mediafire • #mf*
> ➤ Descargar un archivo de MediaFire. 💾
▶ *#mega • #mg* + [enlacé]
> ➤ Descargar un archivo de MEGA. ↓💾
▶ *#play • #play2 • #playvideo • #playmp3 • #playmp4*
> ➤ Descarga música y videos de YouTube por Nombre! ▶↓
▶ *#ytmp3 • #ytmp4 • #ytvideo • #ytmp4doc*
> ➤ Descarga música y videos de YouTube mediante url. ↓★
▶ *#fb • #facebook*
> ➤ Descarga videos de Facebook. ↓📱
▶ *#twitter • #x* + [Link]
> ➤ Descargar un video de Twitter/X ↓🐦
▶ *#ig • #instagram*
> ➤ Descarga contenido de Instagram. ↓📸
▶ *#tiktoksearch • #tiktoks* + [busqueda]
> ➤ Buscar videos de tiktok para descargar. 🔎♪
▶ *#terabox • #tb* + [enlace]
> ➤ Archivos de Terabox! ↓💾
▶ *#gdrive • #drive* + [enlace]
> ➤ Archivos de Google Drive! ↓☁
▶ *#ttimg • #ttmp3* + <url>
> ➤ Descarga fotos y audios de tiktok. ↓🖼🎧
▶ *#gitclone* + <url>
> ➤ Descarga un repositorio de github. 💾⚙
▶ *#xvideosdl*
> ➤ Descarga videos porno de (Xvideos). (Solo +18! 🔞)
▶ *#xnxxdl*
> ➤ Descarga videos porno de (xnxx). (Solo +18! 🔞)
▶ *#apk • #modapk*
> ➤ Descarga un apk de Aptoide. 📱
▶ *#tiktokrandom • #ttrandom*
> ➤ Descarga un video aleatorio de tiktok. ★♪
▶ *#npmdl • #npmdownloader*
> ➤ Descarga paquetes de NPMJs. 📦↓
▶ *#animelinks • #animedl*
> ➤ Links para descargar anime! 🎬↓
╰───────────────

╭─── ◆ ECONOMY ◆ ───
> ❀ *Comandos de economía y rpg para ganar recursos.*
▶ *#w • #work • #trabajar*
> ➤ Trabaja para ganar ${moneda}. 💪$
▶ *#slut • #protituirse*
> ➤ Trabaja como prostituta y gana ${moneda}. (Diferente) 🤫
▶ *#cf • #suerte*
> ➤ Apuesta tus ${moneda} a cara o cruz. 🍀 moneda
▶ *#crime • #crimen*
> ➤ Trabaja como ladrón para ganar ${moneda}. 😈$
▶ *#ruleta • #roulette • #rt*
> ➤ Apuesta ${moneda} al color. 🔴⚫🎡
▶ *#casino • #apostar*
> ➤ Apuesta tus ${moneda} en el casino. 🎰★
▶ *#slot*
> ➤ Apuesta tus ${moneda} y prueba tu suerte. 🎰♦
▶ *#cartera • #wallet*
> ➤ Ver tus ${moneda} en la cartera. 💸
▶ *#bal • #bank*
> ➤ Ver tus ${moneda} en el banco. 🏦♥
▶ *#deposit • #depositar • #d*
> ➤ Deposita tus ${moneda} al banco. →🏦
▶ *#with • #retirar • #withdraw*
> ➤ Retira tus ${moneda} del banco. 🏦→
▶ *#transfer • #pay*
> ➤ Transfiere ${moneda} o XP a otros usuarios. ♥
▶ *#miming • #minar • #mine*
> ➤ Trabaja como minero y recolecta recursos. ⛏💎
▶ *#buyall • #buy*
> ➤ Compra ${moneda} con tu XP. ★$
▶ *#daily • #diario*
> ➤ Reclama tu recompensa diaria. 🎁☀
▶ *#cofre*
> ➤ Reclama un cofre diario. 💎📦
▶ *#weekly • #semanal*
> ➤ Reclama tu regalo semanal. 🎉🗓
▶ *#monthly • #mensual*
> ➤ Reclama tu recompensa mensual. 🥳📅
▶ *#steal • #robar • #rob*
> ➤ Intenta robar ${moneda} a alguien. (cuidado)! 🏃💨$
▶ *#robarxp • #robxp*
> ➤ Intenta robar XP a un usuario. 🤫★
▶ *#eboard • #baltop*
> ➤ Ranking de usuarios con más ${moneda}. 🏆$
▶ *#aventura • #adventure*
> ➤ Explora nuevos mundos conmigo! 🗺★
▶ *#curar • #heal*
> ➤ Recupera tu salud! ♥🩹
▶ *#cazar • #hunt • #berburu*
> ➤ Vamos a cazar! 🏹🐿
▶ *#inv • #inventario*
> ➤ ¿Qué tesoros tienes? 🎒💎
▶ *#mazmorra • #explorar*
> ➤ Lugares misteriosos! 🦇🗝
▶ *#halloween*
> ➤ Dulce o truco (Solo en Halloween). 🎃👻
▶ *#christmas • #navidad*
> ➤ Regalo navideño (Solo en Navidad). 🎄🎁
╰───────────────

╭─── ◆ GACHA ◆ ───
> ❀ *Comandos para reclamar y coleccionar personajes.*
▶ *#rollwaifu • #rw • #roll*
> ➤ Waifu o husbando aleatorio. 🥰♥
▶ *#claim • #c • #reclamar*
> ➤ Reclamar un personaje. ★
▶ *#harem • #waifus • #claims*
> ➤ Ver tus personajes reclamados. ♥♦
▶ *#charimage • #waifuimage • #wimage*
> ➤ Ver imagen de un personaje. 🖼★
▶ *#charinfo • #winfo • #waifuinfo*
> ➤ Información de un personaje. 📖✎
▶ *#givechar • #givewaifu • #regalar*
> ➤ Regalar un personaje a otro usuario. 🤗🎁
▶ *#vote • #votar*
> ➤ Votar por un personaje. 👍★
▶ *#waifusboard • #waifustop • #topwaifus*
> ➤ Top de personajes con mayor valor. ⭐🏆
╰───────────────

╭─── ◆ STICKERS ◆ ───
> ❀ *Comandos para creaciones de stickers.*
▶ *#sticker • #s*
> ➤ Crea stickers de (imagen/video). ★♥
▶ *#setmeta*
> ➤ Establecer pack y autor para stickers. 🏷♦
▶ *#delmeta*
> ➤ Eliminar tu pack de stickers. 👋🗑
▶ *#pfp • #getpic*
> ➤ Obtén foto de perfil de un usuario. 📸👀
▶ *#qc*
> ➤ Crea stickers con texto o de un usuario. 💬★
▶ *#toimg • #img*
> ➤ Convierte stickers en imagen. 🔄🖼
▶ *#brat • #ttp • #attp*︎
> ➤ Crea stickers con texto. ★✎
▶ *#emojimix*
> ➤ Fusiona 2 emojis para crear sticker. 🤩+🥰=♥
▶ *#wm*
> ➤ Cambia nombre de los stickers. ✏♦
╰───────────────

╭─── ◆ TOOLS ◆ ───
> ❀ *Comandos de herramientas con funciones.*
▶ *#calcular • #cal*
> ➤ Calcular ecuaciones. ➕➖➗✖
▶ *#tiempo • #clima*
> ➤ Ver el clima de un pais. ☀☁🌧
▶ *#horario*
> ➤ Ver el horario global. ⏰🌎
▶ *#fake • #fakereply*
> ➤ Crea un mensaje falso. 😉😂
▶ *#enhance • #remini • #hd*
> ➤ Mejora calidad de imagen. ★♥
▶ *#letra*
> ➤ Cambia la fuente de las letras. 🅰🅱
▶ *#read • #readviewonce • #ver*
> ➤ Ver imágenes de una sola vista. 🤫📸
▶ *#whatmusic • #shazam*
> ➤ ¿Qué canción está sonando? ♪🔎
▶ *#spamwa • #spam*
> ➤ (¡Úsalo con responsabilidad! 😅)
▶ *#ss • #ssweb*
> ➤ Ver estado de una página web. 💻🌐
▶ *#length • #tamaño*
> ➤ Cambia tamaño de imágenes/videos. 📏🖼
▶ *#say • #decir* + [texto]
> ➤ Repetir un mensaje. 🗣★
▶ *#translate • #traducir • #trad*
> ➤ Traduce palabras. 🌍🗣
▶ *#ia • #gemini*
> ➤ Preguntar a la ia. 🤔💬
▶ *#tourl • #catbox • #ibb*
> ➤ Convierte imágen/video en urls. 🔗
▶ *#wiki • #wikipedia*
> ➤ Investigar cualquier tema. 📖🤓
▶ *#dalle • #flux*
> ➤ Crea imágenes con texto mediante IA. 🖼✍
╰───────────────

╭─── ◆ PROFILE ◆ ───
> ❀ *Comandos para ver y configurar tu perfil.*
▶ *#reg • #verificar • #register*
> ➤ Registrarte para ser mi amigo oficial! ★🫂
▶ *#unreg*
> ➤ Si cambias de opinión... 😥💔
▶ *#profile*
> ➤ Muestra tu perfil de usuario. 😊♦
▶ *#marry* [mension / etiquetar]
> ➤ Proponer matrimonio a otro usuario. 💍♥
▶ *#divorce*
> ➤ Divorciarte de tu pareja. 💔
▶ *#setgenre • #setgenero*
> ➤ Establece tu género. 🏳️‍⚧️★
▶ *#delgenre • #delgenero*
> ➤ Eliminar tu género.
▶ *#setbirth • #setnacimiento*
> ➤ Establece tu fecha de nacimiento. 🎂🥳
▶ *#delbirth • #delnacimiento*
> ➤ Eliminar tu fecha de nacimiento.
▶ *#setdescription • #setdesc*
> ➤ Establece una descripción. 📝♥
▶ *#deldescription • #deldesc*
> ➤ Eliminar la descripción.
▶ *#lb • #lboard* + <Paginá>
> ➤ Top de usuarios con más (experiencia y nivel). 🏆★
▶ *#level • #lvl* + <@Mencion>
> ➤ Ver tu nivel y experiencia. ★📈
▶ *#comprarpremium • #premium*
> ➤ Ser un usuario super especial! ⭐♥
▶ *#confesiones • #confesar*
> ➤ Cuéntame tus secretos en anónimo! 🤫💌
╰───────────────

╭─── ◆ GROUPS ◆ ───
> ❀ *Comandos para gestión de grupos.*
▶ *#config • #on*
> ➤ ¡Mira las reglas de nuestro grupo! 📜♥
▶ *#hidetag*
> ➤ Mensaje mencionando a todos. 🤫★
▶ *#gp • #infogrupo*
> ➤ Información del grupo. ℹ□
▶ *#linea • #listonline*
> ➤ Ver lista de usuarios en linea. 👀★
▶ *#setwelcome*
> ➤ Mensaje de bienvenida. 👋🥰
▶ *#setbye*
> ➤ Mensaje de despedida. 👋😥
▶ *#link*
> ➤ Bot envia el link del grupo. 🔗♥
▶ *#admins • #admin*
> ➤ Mencionar a los admins. 👑⭐
▶ *#restablecer • #revoke*
> ➤ Restablecer enlace del grupo.
▶ *#open • #abrir*
> ➤ Grupo abierto para todos. 🔓🥳
▶ *#close • #cerrar*
> ➤ Grupo cerrado (solo admins). 🔒🌙
▶ *#kick* [número / mension]
> ➤ Eliminar un usuario. 🥺
▶ *#add • #añadir • #agregar* [número]
> ➤ Invitar a un usuario. 🤗♥
▶ *#promote* [mension / etiquetar]
> ➤ Dar admin al usuario. ⭐👑
▶ *#demote* [mension / etiquetar]
> ➤ Quitar admin al usuario.
▶ *#gpbanner • #groupimg*
> ➤ Cambiar imagen del grupo. 🏞🖼
▶ *#gpname • #groupname*
> ➤ Cambiar nombre del grupo. ✏★
▶ *#gpdesc • #groupdesc*
> ➤ Cambiar descripción del grupo. 📝♥
▶ *#setprimary*
> ➤ Establecer un bot primario.
▶ *#advertir • #warn • #warning*
> ➤ Dar una advertencia. ⚠️🥺
▶ ︎#unwarn • #delwarn*
> ➤ Quitar advertencias.
▶ *#advlist • #listadv*
> ➤ Ver lista de usuarios advertidos. 📋🤔
▶ *#bot* [on / off]
> ➤ Banear o desbanear el Bot. ★🌙
▶ *#mute* [mension / etiquetar]
> ➤ Bot elimina mensajes del usuario. 🤐😔
▶ *#unmute* [mension / etiquetar]
> ➤ Bot deja de eliminar mensajes. 😊🗣
▶ *#encuesta • #poll*
> ➤ Crea una encuesta. 📊★
▶ *#delete • #del*
> ➤ Eliminar mensaje de otros usuarios. 🗑👋
▶ *#inactivos*
> ➤ Ver lista de inactivos. 👻👀
▶ *#kickinactivos*
> ➤ Eliminar a los inactivos. 🚪😥
▶ *#invocar • #tagall • #todos*
> ➤ Invocar a todos los usuarios. 👋♥
▶ *#setemoji • #setemo*
> ➤ Cambiar emoji invitación. ★♦
▶ *#listnum • #kicknum*
> ➤ Eliminar por prefijo de país.
╰───────────────

╭─── ◆ ANIME REACTIONS ◆ ───
> ❀ *Comandos de reacciones de anime.*
▶ *#angry • #enojado* + <mencion>
> ➤ Estar enojado 😠
▶ *#bite* + <mencion>
> ➤ Muerde a alguien 😬🍏
▶ *#bleh* + <mencion>
> ➤ Sacar la lengua 😝★
▶ *#blush* + <mencion>
> ➤ Sonrojarte 😳♥
▶ *#bored • #aburrido* + <mencion>
> ➤ Estar aburrido 😴
▶ *#cry* + <mencion>
> ➤ Llorar por algo o alguien 😭💧
▶ *#cuddle* + <mencion>
> ➤ Acurrucarse 🤗♥
▶ *#dance* + <mencion>
> ➤ Sacate los pasitos prohíbidos 💃🕺✨
▶ *#drunk* + <mencion>
> ➤ Estar borracho 🥴
▶ *#eat • #comer* + <mencion>
> ➤ Comer algo delicioso 냠냠 🍔
▶ *#facepalm* + <mencion>
> ➤ Darte una palmada en la cara 🤦‍♀️🤦‍♂️
▶ *#happy • #feliz* + <mencion>
> ➤ Salta de felicidad 😄🥳
▶ *#hug* + <mencion>
> ➤ Dar un abrazo 🤗★
▶ *#impregnate • #preg* + <mencion>
> ➤ Embarazar a alguien (Juego) 🤭♥
▶ *#kill* + <mencion>
> ➤ Toma tu arma y mata a alguien (Juego, amigos!) 🔪☠
▶ *#kiss • #besar* • #kiss2 + <mencion>
> ➤ Dar un beso 😘💋
▶ *#laugh* + <mencion>
> ➤ Reírte de algo o alguien 😂
▶ *#lick* + <mencion>
> ➤ Lamer a alguien (Broma)! 😋😛
▶ *#love • #amor* + <mencion>
> ➤ Sentirse enamorado 🥰♥
▶ *#pat* + <mencion>
> ➤ Acaricia a alguien 👋😊
▶ *#poke* + <mencion>
> ➤ Picar a alguien 👉★
▶ *#pout* + <mencion>
> ➤ Hacer pucheros 😠🥺
▶ *#punch* + <mencion>
> ➤ Dar un puñetazo (Broma)! 👊💥
▶ *#run* + <mencion>
> ➤ Correr 🏃‍♀️💨
▶ *#sad • #triste* + <mencion>
> ➤ Expresar tristeza 😞💧
▶ *#scared* + <mencion>
> ➤ Estar asustado 😨😱
▶ *#seduce* + <mencion>
> ➤ Seducir a alguien 😉♥
▶ *#shy • #timido* + <mencion>
> ➤ Sentir timidez ☺️😳
▶ *#slap* + <mencion>
> ➤ Dar una bofetada (Broma)! 👋😂
▶ *#dias • #days*
> ➤ Dar los buenos días. ☀👋
▶ *#noches • #nights*
> ➤ Dar las buenas noches. 🌙😴
▶ *#sleep* + <mencion>
> ➤ Tumbarte a dormir 😴😇
▶ *#smoke* + <mencion>
> ➤ Fumar 🚬💨
▶ *#think* + <mencion>
> ➤ Pensar en algo 🤔💡
╰───────────────

╭─── ◆ NSFW ◆ ───
> ❀ *Comandos NSFW (Contenido para adultos). Úsalo con discreción! 🔞*
▶ *#anal* + <mencion>
> ➤ Hacer un anal 😉
▶ *#waifu*
> ➤ Buscar una waifu aleatoria. 🔥♥
▶ *#bath* + <mencion>
> ➤ Bañarse 🛁💧
▶ *#blowjob • #mamada • #bj* + <mencion>
> ➤ Dar una mamada 😉
▶ *#boobjob* + <mencion>
> ➤ Hacer una rusa 😉
▶ *#cum* + <mencion>
> ➤ Venirse en alguien. 😉
▶ *#fap* + <mencion>
> ➤ Hacerse una paja 😉
▶ *#ppcouple • #ppcp*
> ➤ Genera imagenes para amistades o parejas. 💕★
▶ *#footjob* + <mencion>
> ➤ Hacer una paja con los pies 😉
▶ *#fuck • #coger • #fuck2* + <mencion>
> ➤ Follarte a alguien 😉
▶ *#cafe • #coffe*
> ➤ Tomar un cafecito con alguien ☕😊
▶ *#violar • #perra* + <mencion>
> ➤ Violar a alguien (Solo juego! 😈☠)
▶ *#grabboobs* + <mencion>
> ➤ Agarrrar tetas 😉
▶ *#grop* + <mencion>
> ➤ Manosear a alguien 😉
▶ *#lickpussy* + <mencion>
> ➤ Lamer un coño 😉
▶ *#rule34 • #r34* + [Tags]
> ➤ Buscar imagenes en Rule34 (+18! 🔞🖼)
▶ *#sixnine • #69* + <mencion>
> ➤ Haz un 69 con alguien 😉
▶ *#spank • #nalgada* + <mencion>
> ➤ Dar una nalgada 😉
▶ *#suckboobs* + <mencion>
> ➤ Chupar tetas 😉
▶ *#undress • #encuerar* + <mencion>
> ➤ Desnudar a alguien 😉
▶ *#yuri • #tijeras* + <mencion>
> ➤ Hacer tijeras. 😉
╰───────────────

╭─── ◆ GAMES ◆ ───
> ❀ *Comandos para jugar con tus amigos.*
▶ *#amistad • #amigorandom*
> ➤ ¡Haz un nuevo amigo al azar! 🥰🫂
▶ *#chaqueta • #jalamela*
> ➤ Hacerte una chaqueta. (Juego divertido! 🤭😜)
▶ *#chiste*
> ➤ ¡Te cuento el chiste más gracioso! 😂🎤
▶ *#consejo*
> ➤ ¡Te doy un consejito para tu día! ★👍
▶ *#doxeo • #doxear* + <mencion>
> ➤ Simular un doxeo falso. (Broma pesada! 😉😂)
▶ *#facto*
> ➤ ¡Un dato curioso! 🤓💡
▶ *#formarpareja*
> ➤ ¡Encuentra tu pareja perfecta! ♥💑
▶ *#formarpareja5*
> ➤ Forma 5 parejas diferentes. 😂♥
▶ *#frase*
> ➤ ¡Una frase linda! ♥📝
▶ *#huevo*
> ➤ (Juego divertido! 🥚🤣)
▶ *#chupalo* + <mencion>
> ➤ (Juego divertido! 😜🤭)
▶ *#aplauso* + <mencion>
> ➤ ¡Un aplauso para ti! 👏★
▶ *#marron* + <mencion>
> ➤ (Broma de color 😉🎨)
▶ *#suicidar*
> ➤ (Solo en juego, ¡ánimo! 😥☠)
▶ *#iq • #iqtest* + <mencion>
> ➤ ¡Calcula qué tan inteligente! 🤔🧠
▶ *#meme*
> ➤ El bot te envía un meme aleatorio. 😂🖼
▶ *#morse*
> ➤ Escribir en código secreto. •-•• ---
▶ *#nombreninja*
> ➤ ¡Descubre tu nombre ninja! 🥷★
▶ *#paja • #pajeame*
> ➤ El bot te hace una paja. (Juego divertido! 🤭😜)
▶ *#personalidad* + <mencion>
> ➤ La bot busca tu personalidad. ★😊
▶ *#piropo*
> ➤ ¡Te digo algo bonito! 🥰♥
▶ *#pregunta*
> ➤ ¡Cualquier pregunta! ❓💡
▶ *#ship • #pareja*
> ➤ Probabilidad de enamorarte. 💕★
▶ *#sorteo*
> ➤ Empezar un sorteo. 🎉🎁
▶ *#top*
> ➤ Empezar un top de personas. 🏆★
▶ *#formartrio* + <mencion>
> ➤ Forma un trío! 😉♥
▶ *#ahorcado*
> ➤ Jugar el juego ahorcado. 😬✍
▶ *#genio*
> ➤ ¡Pregúntale al Genio misterioso! ★🔮
▶ *#mates • #matematicas*
> ➤ Jugar matemáticas. 🔢🤓
▶ *#ppt*
> ➤ Jugar piedra papel o tijeras. ✊✋✌
▶ *#sopa • #buscarpalabra*
> ➤ Palabras escondidas. 🔎📜
▶ *#pvp • #suit* + <mencion>
> ➤ Jugar un pvp contra otro usuario. ⚔🎮
▶ *#ttt*
> ➤ Crear una sala de juego. ✗○Game
╰───────────────

> *© powered by Wirk 🫆*
`.trim()

  await conn.sendMessage(m.chat, {
  text: txt,
  contextInfo: {
    mentionedJid: [m.sender, userId],
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id, // Asegúrate de que channelRD esté definido
      newsletterName: channelRD.name, // Asegúrate de que channelRD esté definido
      serverMessageId: -1,
    },
    forwardingScore: 16,
    externalAdReply: {
      title: "♦ Mai ♦ World Of Bot", // Título del reply con símbolos
      body: "➤ Powered By Wirk ★", // Cuerpo del reply con símbolos
      thumbnailUrl: banner, // Asegúrate de que banner esté definido (URL o ruta a la imagen)
      sourceUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY", // Asegúrate de que la URL sea correcta
      mediaType: 1, // Tipo de media (1 para imagen)
      showAdAttribution: true,
      renderLargerThumbnail: true
    }
  }
}, { quoted: m });

}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    let parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
}
