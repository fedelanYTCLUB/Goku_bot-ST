let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    // Asegúrate de que 'moneda' esté definido en tu configuración global si es necesario para la sección de economía
    let moneda = global.db.data.settings[conn.user.jid].moneda || 'Coins 💰'; // Ejemplo, ajusta según tu bot

    let txt = `
૮₍´˶• . • ⑅ ₎ა ¡Holiii, ${name} 👋!
Soy *Mai*, tu amiguita bot que te desea un lindo dia 🥰

🎀 *Llevo despierta desde hace:* \`${uptime}\`
🌷 Tengo *${totalreg}* amiguitos registrad@s!
\`💖 Y sé hacer ${totalCommands} cositas para ti\`

*₊˚⊹ ꒰ 𝘚𝘰𝘣𝘳𝘦 𝘔𝘪 ꒱ ‧₊˚*
🐰 *Tú eres:* @${userId.split('@')[0]} ✨
💭 *Modo:* _Público para todos 🌎_
🍓 *Soy:* ${(conn.user.jid == global.conn.user.jid ? '𝗕𝗼𝘁𝘀𝗶𝘁𝗮 𝗣𝗿𝗶𝗻𝗰𝗶𝗽𝗮𝗹 🪴' : '𝙎𝙪𝙗 𝘽𝙤𝙩🌸')}
🫧 *Versión:* _Multi Dispositivo 📱💻&

*💌 Un secretito:* Puedes tener tu propio Sub-Bot con *#qr* o *#code*

₊˚⊹ ꒰ Cositas para Saber Jsjs ꒱ ‧₊˚
🧸 *#help • #menu* ➢ ¡Mi lista de magia y trucos! ✨
🐇 *#uptime • #runtime* ➢ ¿Cuánto tiempo estoy jugando contigo?  playtime 🎮
🌷 *#sc • #script* ➢ ¡Mi casita en GitHub! Ven a visitarme! 🏡
🎀 *#serbot • #serbot code* ➢ ¡Haz que otra Mai cobre vida! 🥺👉👈
🍓 *#bots • #sockets* ➢ ¿Cuántas Mais estamos jugando juntas? 👯‍♀️
💖 *#creador* ➢ La manita mágica que me hizo! ✨
✨ *#status • #estado* ➢ ¿Cómo me siento en este momento? Uwu
🐰 *#links • #grupos* ➢ ¡Únete a nuestra linda familia! 👨‍👩‍👧‍👦
💭 *#infobot* ➢ ¡Descubre más cositas de mí! 📖
🧸 *#sug • #newcommand* ➢ ¿Una idea kawaii para un comando? ¡Cuéntame! 🥺
🐇 *#p • #ping* ➢ ¡Veamos qué tan rápido late mi corazoncito! 💓
🌷 *#reporte • #reportar* ➢ Si algo está mal, ¡avísame porfis! 🙏
🎀 *#sistema • #system* ➢ Mi salud interna, ¡todo en orden! ✅
🍓 *#speed • #speedtest* ➢ ¡Soy veloz como un conejito! 🐇💨
💖 *#views • #usuarios* ➢ ¡Mira cuántos amigos tengo! Yay! 🎉
✨ *#funciones • #totalfunciones* ➢ Todas las cositas que puedo hacer! ✨
🐰 *#ds • #fixmsgespera* ➢ ¡Ayudo a ordenar un poquito! 🧹
💭 *#editautoresponder* ➢ ¡Enséñame a responder de forma cute! ✍️

₊˚⊹ ꒰ Cositas para Buscar ꒱ ‧₊˚
🧸 *#tiktoksearch • #tiktoks* ➢ ¡Encuentra videos de tiktok super divertidos! 🎶🎬
🐇 *#tweetposts* ➢ ¿Qué anda diciendo la gente en Twitter/X? 🐦
🌷 *#ytsearch • #yts* ➢ ¡Busca tus videos favoritos en YouTube! ▶️📺
🎀 *#githubsearch* ➢ Busca personitas talentosas en GitHub! 👩‍💻👨‍💻
🍓 *#cuevana • #cuevanasearch* ➢ ¿Peli o serie para hoy? 🍿🎬
💖 *#google* ➢ ¡El señor que sabe todo! 🧠🌐
✨ *#pin • #pinterest* ➢ ¡Ideas bonitas y cute en Pinterest! 🌸🎀
🐰 *#imagen • #image* ➢ ¡Encuentra cualquier imagen que quieras! 🖼️✨
💭 *#animesearch • #animess* ➢ ¡Busca tu anime en Tioanime! 📺💖
🧸 *#animei • #animeinfo* ➢ Info de capítulos de anime! 📚✨
🐇 *#infoanime* ➢ ¡Detalles de tu anime o manga favorito! 📖アニメ
🌷 *#hentaisearch • #searchhentai* ➢ (Solo para mayores de 18, porfis! 🤫)
🎀 *#xnxxsearch • #xnxxs* ➢ (Contenido para adultos, úsalo con cuidado! 🔞)
🍓 *#xvsearch • #xvideossearch* ➢ (Contenido para adultos! 🔞)
💖 *#pornhubsearch • #phsearch* ➢ (Solo para mayores de 18! 🔞)
✨ *#npmjs* ➢ Busca paquetes para los amiguitos devs! 📦🤓

₊˚⊹ ꒰ Cositas para Descargar ꒱ ‧₊˚
🧸 *#tiktok • #tt* ➢ ¡Baja tiktoks rapidito! 👇🎶
🐇 *#mediafire • #mf* ➢ ¡Archivos de MediaFire listos! 📥💾
🌷 *#pinvid • #pinvideo* + [enlacé] ➢ ¡Videos de Pinterest bonitos! ✨👇
🎀 *#mega • #mg* + [enlacé] ➢ ¡Archivos de MEGA! 👇💾
🍓 *#play • #play2 • #playvideo • #playmp3 • #playmp4* ➢ Música y videos de YouTube Por Nombre! ▶️📥
💖 *#ytmp3 • #ytmp4 • #ytmp4doc*➢ Descarga por URL de YouTube! 👇✨
✨ *#fb • #facebook* ➢ ¡Videos de Facebook! 👇📱
🐰 *#twitter • #x* + [Link] ➢ ¡Videos de Twitter/X! 👇🐦
💭 *#ig • #instagram* ➢ ¡Todo de Instagram! 👇📸
🧸 *#tts • #tiktoks* + [busqueda] ➢ ¡Busca tiktoks para bajar! 🔎🎬
🐇 *#terabox • #tb* + [enlace] ➢ ¡Archivos de Terabox! 👇💾
🌷 *#gdrive • #drive* + [enlace] ➢ ¡Archivos de Google Drive! 👇☁️
🎀 *#ttimg • #ttmp3* + <url> ➢ ¡Fotos y audios de tiktok! 👇🖼️🎧
🍓 *#gitclone* + <url> ➢ ¡Baja repos de GitHub! 💾🤓
💖 *#xvideosdl* ➢ (Solo para mayores de 18! 🔞)
✨ *#xnxxdl* ➢ (Solo para mayores de 18! 🔞)
🐰 *#apk • #modapk* ➢ ¡Apps de Aptoide! 📱🎮
💭 *#tiktokrandom • #ttrandom* ➢ ¡Un tiktok sorpresa solo para ti! 🎉🎶
🧸 *#npmdl • #npmdownloader* ➢ ¡Paquetes de NPMJs! 📦👇
🐇 *#animelinks • #animedl* ➢ ¡Links para descargar anime! 🎬📥

₊˚⊹ ꒰ Cositas de Economía ꒱ ‧₊˚
🌷 *#w • #work • #trabajar* ➢ ¡A ganar ${moneda} con esfuerzo! 💪💰
🎀 *#slut • #protituirse* ➢ (Un trabajo... diferente 🤫)
🍓 *#cf • #suerte* ➢ ¡Cara o cruz para probar tu suerte! 🍀 coin 🪙
💖 *#crime • #crimen* ➢ ¡Un poquito de travesura! 😈💰
✨ *#ruleta • #roulette • #rt* ➢ ¡Apuesta en la ruleta! 🔴⚫🎡
🐰 *#casino • #apostar* ➢ ¡Prueba tu suerte en el casino virtual! 🎰✨
💭 *#slot* ➢ ¡A ver si ganas el jackpot! 🎰🍓🍋🍓
🧸 *#cartera • #wallet* ➢ ¿Cuántos ${moneda} tienes contigo? 💸🛍️
🐇 *#banco • #bank* ➢ ¡Tu ahorro seguro y creciendo! 🏦💖
🌷 *#deposit • #depositar • #d* ➢ ¡Guarda tus ${moneda} en el banco! ➡️🏦
🎀 *#with • #retirar • #withdraw* ➢ ¡Saca tus ${moneda} cuando los necesites! 🏦➡️
🍓 *#transfer • #pay* ➢ ¡Comparte ${moneda} o XP con tus amiguitos! 🤗💖
💖 *#miming • #minar • #mine* ➢ ¡A minar recursos preciosos! ⛏️💎
✨ *#buyall • #buy* ➢ ¡Cambia tu XP por ${moneda}! ✨💰
🐰 *#daily • #diario* ➢ ¡Tu regalito diario esperando! 🎁☀️
💭 *#cofre* ➢ ¡Un cofre sorpresa cada día! 💎✨📦
🧸 *#weekly • #semanal* ➢ ¡Tu regalo de la semana! 🎉🗓️
🐇 *#monthly • #mensual* ➢ ¡Tu gran regalo del mes! 🥳📆
🌷 *#steal • #robar • #rob* ➢ ¡Intenta robar (con cuidado)! 🏃💨💰
🎀 *#robarxp • #robxp* ➢ ¡Intenta robar XP! 🤫✨
🍓 *#eboard • #baltop* ➢ ¿Quién es el más rico? 🏆💰
💖 *#aventura • #adventure* ➢ ¡Explora nuevos mundos conmigo! 🗺️✨
✨ *#curar • #heal* ➢ ¡Recupera tu salud! ❤️‍🩹🩹
🐰 *#cazar • #hunt • #berburu* ➢ ¡Vamos a cazar (virtualmente)! 🏹🐿️
💭 *#inv • #inventario* ➢ ¿Qué tesoros tienes? 🎒💎
🧸 *#mazmorra • #explorar* ➢ ¡Adéntrate en lugares misteriosos! 🦇🗝️
🐇 *#halloween* ➢ ¡Dulce o truco! 🎃👻
🌷 *#christmas • #navidad* ➢ ¡Tu regalito navideño! 🎄🎁

₊˚⊹ ꒰ Cositas Gacha ꒱ ‧₊˚
🎀 *#rollwaifu • #rw • #roll* ➢ ¡Una waifu o husbando sorpresa para ti! 🥰💖
🍓 *#claim • #c • #reclamar* ➢ ¡Haz tuyo a tu personaje favorito! ✨
💖 *#harem • #waifus • #claims* ➢ ¡Mira a todos tus compañeros! 💕👨‍👩‍👧‍👦
✨ *#charimage • #waifuimage • #wimage* ➢ ¡Mira a tu lindo personaje! 🖼️✨
🐰 *#charinfo • #winfo • #waifuinfo* ➢ Detalles de tu personaje! 📖🤓
💭 *#givechar • #givewaifu • #regalar* ➢ ¡Comparte la felicidad con amigos! 🤗🎁
🧸 *#vote • #votar* ➢ ¡Apoya a tu personaje favorito! 👍✨
🐇 *#waifusboard • #waifustop • #topwaifus* ➢ ¡Los personajes más populares! ⭐🏆

₊˚⊹ ꒰ Cositas de Stickers ꒱ ‧₊˚
🌷 *#sticker • #s* ➢ ¡Convierte tus fotos y videos en stickers kawaii! ✨💖
🎀 *#setmeta* ➢ ¡Ponle nombre a tu pack de stickers! 🏷️🎀
🍓 *#delmeta* ➢ ¿Ya no te gusta tu pack? ¡Adiós! 👋🗑️
💖 *#pfp • #getpic* ➢ ¡Mira la foto de perfil de alguien! 📸👀
✨ *#qc* ➢ ¡Stickers con texto o de tus amigos! 💬✨
🐰 *#toimg • #img* ➢ ¡Haz que un sticker vuelva a ser imagen! 🔄🖼️
💭 *#brat • #ttp • #attp*︎ ➢ ¡Stickers solo con letritas bonitas! ✨📝
🧸 *#emojimix* ➢ ¡Mezcla 2 emojis y haz uno nuevo! 🤩+🥰=💖
🐇 *#wm* ➢ ¡Cambia el nombre de tus stickers! ✏️🎀

₊˚⊹ ꒰ Cositas de Herramientas ꒱ ‧₊˚
🌷 *#calcular • #calcular • #cal* ➢ ¡Ayudo con tus tareas de mates! ➕➖➗✖️
🎀 *#tiempo • #clima* ➢ ¿Cómo está el clima por ahí? ☀️☁️🌧️
🍓 *#horario* ➢ La hora en cualquier lugar del mundo! ⏰🌎
💖 *#fake • #fakereply* ➢ ¡Crea mensajes de broma super divertidos! 😉😂
✨ *#enhance • #remini • #hd* ➢ ¡Haz tus fotos más hermosas! ✨💖
🐰 *#letra* ➢ ¡Cambia el estilo de tus letras! 🅰️🅱️🆎
💭 *#read • #readviewonce • #ver* ➢ ¡Mira esas fotos secretas! 🤫📸
🧸 *#whatmusic • #shazam* ➢ ¿Qué canción está sonando? ¡Te ayudo! 🎶🔎
🐇 *#spamwa • #spam* ➢ (¡Úsalo con mucha responsabilidad! 😅)
🌷 *#ss • #ssweb* ➢ ¡Mira una página web! 💻🌐
🎀 *#length • #tamaño* ➢ Cambia el tamaño de tus imágenes/videos! 📏🖼️
🍓 *#say • #decir* + [texto] ➢ ¡Repito lo que tú digas! 🗣️✨
💖 *#todoc • #toducument* ➢ ¡Convierte cosas en documentos! 📄📁
✨ *#translate • #traducir • #trad* ➢ ¡Te ayudo a hablar otros idiomas! 🌍🗣️

₊˚⊹ ꒰ Cositas de Perfil ꒱ ‧₊˚
🐰 *#reg • #verificar • #register* ➢ ¡Regístrate para ser mi amigo oficial! ✨🫂
💭 *#unreg* ➢ Si cambias de opinión... 😥💔
🧸 *#profile* ➢ ¡Mira tu lindo perfil! 😊🎀
🐇 *#marry* [mension / etiquetar] ➢ ¿Quieres ser mi... pareja? 💍💖
🌷 *#divorce* ➢ Si las cosas no funcionan... es triste 💔
🎀 *#setgenre • #setgenero* ➢ ¿Cómo te identificas? 🏳️‍⚧️✨
🍓 *#delgenre • #delgenero* ➢ Elimina tu género si quieres.
💖 *#setbirth • #setnacimiento* ➢ ¿Cuándo es tu cumple? ¡Para celebrar! 🎂🥳
✨ *#delbirth • #delnacimiento* ➢ Elimina tu fecha de nacimiento.
🐰 *#setdescription • #setdesc* ➢ ¡Cuéntame algo lindo de ti! 📝💖
💭 *#deldescription • #deldesc* ➢ Borra tu descripción.
🧸 *#lb • #lboard* + <Paginá> ➢ ¿Quién tiene más XP o Nivel? ¡Top! 🏆✨
🐇 *#level • #lvl* + <@Mencion> ➢ ¡Mira tu nivel y cuánta experiencia tienes! ✨📈
🌷 *#comprarpremium • #premium* ➢ ¡Sé un usuario super especial! ⭐💖
🎀 *#confesiones • #confesar* ➢ ¡Cuéntame tus secretos en anónimo! 🤫💌

₊˚⊹ ꒰ Cositas de Grupos ꒱ ‧₊˚
🍓 *#config • #on* ➢ ¡Mira las reglas de nuestro lindo grupo! 📜💖
💖 *#hidetag* ➢ ¡Menciona a todos sin que se note mucho! 🤫✨
✨ *#gp • #infogrupo* ➢ ¡Toda la info de nuestro grupo! ℹ️🏡
🐰 *#linea • #listonline* ➢ ¿Quiénes están despiertos y conectados? 👀✨
💭 *#setwelcome* ➢ ¡El mensaje más lindo para los nuevos! 👋🥰
🧸 *#setbye* ➢ Un mensajito triste cuando alguien se va... 👋😢
🐇 *#link* ➢ ¡El enlace para que más amigos se unan! 🔗💖
🌷 *#admins • #admin* ➢ ¡Los líderes de nuestro grupo! 👑🌟
🎀 *#restablecer • #revoke* ➢ Cambia el link del grupo por si acaso.
🍓 *#grupo • #group* [open / abrir] ➢ ¡Abrimos las puertas para todos! 🔓🥳
💖 *#grupo • #gruop* [close / cerrar] ➢ ¡Cerramos las puertas un ratito! 🔒🌙
✨ *#kick* [número / mension] ➢ Sacar a alguien... es un poco triste 🥺
🐰 *#add • #añadir • #agregar* [número] ➢ ¡Invita a un nuevo amigo! 🤗💖
💭 *#promote* [mension / etiquetar] ➢ ¡Haz a alguien un líder! ⭐👑
🧸 *#demote* [mension / etiquetar] ➢ Quita el liderazgo.
🐇 *#gpbanner • #groupimg* ➢ ¡Cambia la foto de nuestro grupo! 🏞️🖼️
🌷 *#gpname • #groupname* ➢ ¡Cambia el nombre de nuestro grupo! ✏️✨
🎀 *#gpdesc • #groupdesc* ➢ ¡Cambia la descripción de nuestro grupo! 📝💖
🍓 *#advertir • #warn • #warning* ➢ ¡Una pequeña llamada de atención! ⚠️🥺
💖 *#unwarn • #delwarn* ➢ Quita una advertencia.
✨ *#advlist • #listadv* ➢ ¿Quién tiene advertencias? 📋🤔
🐰 *#bot on* ➢ ¡Enciéndeme en el grupo! ✨🥳
💭 *#bot off* ➢ ¡Apágame en el grupo! 🌙💤
🧸 *#mute* [mension / etiquetar] ➢ No dejaré que esa personita hable por un rato... 🤐😔
🐇 *#unmute* [mension / etiquetar] ➢ ¡Ya puede hablar de nuevo! 😊🗣️
🌷 *#encuesta • #poll* ➢ ¡Hagan una votación entre todos! 📊✨
🎀 *#delete • #del* ➢ Elimina mis mensajes o los de otros. 🗑️👋
🍓 *#fantasmas* ➢ ¿Quién no habla mucho? 👻👀
💖 *#kickfantasmas* ➢ Si es necesario, puedo sacarlos... 🚪😥
✨ *#invocar • #tagall • #todos* ➢ ¡Holii a todos en el grupo! 👋💖
🐰 *#setemoji • #setemo* ➢ ¡Cambia el emoji del link de invitación! ✨🎀
💭 *#listnum • #kicknum* ➢ Saca a amigos por el número de su país.

₊˚⊹ ꒰ Cositas de Anime Reacciones ꒱ ‧₊˚
🧸 *#angry • #enojado* + <mencion> ➢ ¡Estoy un poquito enojad@! 😠💢
🐇 *#bite* + <mencion> ➢ ¡Te doy una mordidita! 😬🍎
🌷 *#bleh* + <mencion> ➢ ¡Saco la lengua traviesa! 😝✨
🎀 *#blush* + <mencion> ➢ ¡Me sonrojo! 😳💖
🍓 *#bored • #aburrido* + <mencion> ➢ ¡Qué aburrido estoy! 😴💤
💖 *#cry* + <mencion> ➢ ¡A llorar un poquito! 😭💧
✨ *#cuddle* + <mencion> ➢ ¡Un abracito calentito y tierno! 🤗💖
🐰 *#dance* + <mencion> ➢ ¡A bailar con alegría! 💃🕺🎉
💭 *#drunk* + <mencion> ➢ ¡Un poco mareadit@! 🥴😵‍💫
🧸 *#eat • #comer* + <mencion> ➢ ¡Hora de comer algo rico! 냠냠 🍔
🐇 *#facepalm* + <mencion> ➢ ¡Oh no! 🤦‍♀️🤦‍♂️
🌷 *#happy • #feliz* + <mencion> ➢ ¡Estoy super feliz! 😄🥳
🎀 *#hug* + <mencion> ➢ ¡Te doy un fuerte abracito! 🤗✨
🍓 *#impregnate • #preg* + <mencion> ➢ (Juego de rol 🤭💖)
💖 *#kill* + <mencion> ➢ (Solo en juego, ¡somos amigos! 🔪❌)
✨ *#kiss • #besar • #kiss2* + <mencion> ➢ ¡Un besito tierno! 😘💋
🐰 *#laugh* + <mencion> ➢ ¡Jajajaja! 😂🤣
💭 *#lick* + <mencion> ➢ ¡Te lamo (de broma)! 😋😛
🧸 *#love • #amor* + <mencion> ➢ ¡Siento mucho amor! 🥰💖
🐇 *#pat* + <mencion> ➢ ¡Palmadita suave en la cabeza! 👋😊
🌷 *#poke* + <mencion> ➢ ¡Te hago cosquillas! 👉✨
🎀 *#pout* + <mencion> ➢ ¡Hago pucheros! 😠🥺
🍓 *#punch* + <mencion> ➢ ¡Un puñetazo (de broma)! 👊💥
💖 *#run* + <mencion> ➢ ¡A correr rapidito! 🏃‍♀️💨
✨ *#sad • #triste* + <mencion> ➢ ¡Me siento un poquito triste! 😞💧
🐰 *#scared* + <mencion> ➢ ¡Tengo miedito! 😨😱
💭 *#seduce* + <mencion> ➢ ¡Soy irresistible! 😉💖
🧸 *#shy • #timido* + <mencion> ➢ ¡Qué penita! ☺️😳
🐇 *#slap* + <mencion> ➢ ¡Una bofetada (de broma)! 👋😂
🌷 *#dias • #days* ➢ ¡Buenos días! ☀️👋
🎀 *#noches • #nights* ➢ ¡Buenas noches! 🌙😴
🍓 *#sleep* + <mencion> ➢ ¡A dormir como un angelito! 😴😇
💖 *#smoke* + <mencion> ➢ ¡Un cigarrito (virtual)! 🚬💨
✨ *#think* + <mencion> ➢ ¡Estoy pensando mucho! 🤔💡

🔞 Cositas para mayores de 18 🔞
*(Estos comandos son solo para amiguitos que ya son mayores de edad. ¡Úsenlos con mucha discreción y responsabilidad, por favor! 🙏)*
🐰 *#anal* + <mencion> ➢ (Solo para adultos 😉)
💭 *#waifu* ➢ ¡Encuentra una waifu un poco atrevida! 🔥💖
🧸 *#bath* + <mencion> ➢ ¡Hora del baño! 🛁💦
🐇 *#blowjob • #mamada • #bj* + <mencion> ➢ (Solo para adultos 😉)
🌷 *#boobjob* + <mencion> ➢ (Solo para adultos 😉)
🎀 *#cum* + <mencion> ➢ (Solo para adultos 😉)
🍓 *#fap* + <mencion> ➢ (Solo para adultos 😉)
💖 *#ppcouple • #ppcp* ➢ ¡Fotos lindas para parejas o amigos! 💕✨
✨ *#footjob* + <mencion> ➢ (Solo para adultos 😉)
🐰 *#fuck • #coger • #fuck2* + <mencion> ➢ (Solo para adultos 😉)
💭 *#cafe • #coffe* ➢ ¡Tomemos un cafecito juntos! ☕😊
🧸 *#violar • #perra* + <mencion> ➢ (Solo en juego! 😈❌)
🐇 *#grabboobs* + <mencion> ➢ (Solo para adultos 😉)
🌷 *#grop* + <mencion> ➢ (Solo para adultos 😉)
🎀 *#lickpussy* + <mencion> ➢ (Solo para adultos 😉)
🍓 *#rule34 • #r34* + [Tags] ➢ Busca imágenes (Solo para adultos! 🔞🖼️)
💖 *#sixnine • #69* + <mencion> ➢ (Solo para adultos 😉)
✨ *#spank • #nalgada* + <mencion> ➢ (Solo para adultos 😉)
🐰 *#suckboobs* + <mencion> ➢ (Solo para adultos 😉)
💭 *#undress • #encuerar* + <mencion> ➢ (Solo para adultos 😉)
🧸 *#yuri • #tijeras* + <mencion> ➢ (Solo para adultos 😉)

₊˚⊹ ꒰ Cositas de Juegos ꒱ ‧₊˚
🐇 *#amistad • #amigorandom* ➢ ¡Haz un nuevo amigo al azar! 🥰🫂
🌷 *#chaqueta • #jalamela* ➢ (Juego divertido! 🤭😜)
🎀 *#chiste* ➢ ¡Te cuento el chiste más gracioso! 😂🎤
🍓 *#consejo* ➢ ¡Te doy un consejito para tu día! ✨👍
💖 *#doxeo • #doxear* + <mencion> ➢ (Una broma pesada! 😉😂)
✨ *#facto* ➢ ¡Un dato curioso para ti! 🤓💡
🐰 *#formarpareja* ➢ ¡Encuentra tu pareja perfecta! ❤️💑
💭 *#formarpareja5* ➢ ¡5 parejas diferentes para reír! 😂💖
🧸 *#frase* ➢ ¡Una frase linda para alegrarte el día! 💖📝
🐇 *#huevo* ➢ (Juego divertido! 🥚🤣)
🌷 *#chupalo* + <mencion> ➢ (Juego divertido! 😜🤭)
🎀 *#aplauso* + <mencion> ➢ ¡Un aplauso para ti! 👏✨
🍓 *#marron* + <mencion> ➢ (Broma de color 😉🎨)
💖 *#suicidar* ➢ (Solo en juego, ¡ánimo! 😥❌)
✨ *#iq • #iqtest* + <mencion> ➢ ¡Calcula qué tan inteligente eres! 🤔🧠
🐰 *#meme* ➢ ¡El meme más gracioso! 😂🖼️
💭 *#morse* ➢ ¡Escribe en código secreto! •-•• ---
🧸 *#nombreninja* ➢ ¡Descubre tu nombre ninja! 🥷✨
🐇 *#paja • #pajeame* ➢ (Juego divertido! 🤭😜)
🌷 *#personalidad* + <mencion> ➢ ¿Cuál es tu linda personalidad? ✨😊
🎀 *#piropo* ➢ ¡Te digo algo bonito! 🥰💖
🍓 *#pregunta* ➢ ¡Hazme cualquier pregunta que quieras! ❓💡
💖 *#ship • #pareja* ➢ ¿Qué tan compatibles son? 💕✨
✨ *#sorteo* ➢ ¡Empecemos un sorteo divertido! 🎉🎁
🐰 *#top* ➢ ¡Un top genial! 🏆✨
💭 *#formartrio* + <mencion> ➢ ¡Forma un trío! 😉💖
🧸 *#ahorcado* ➢ ¡Juega Ahorcado conmigo! 😬✍️
🐇 *#genio* ➢ ¡Pregúntale al Genio misterioso! ✨🔮
🌷 *#mates • #matematicas* ➢ ¡Juega matemáticas y aprende! 🔢🤓
🎀 *#ppt* ➢ ¡Juega Piedra, Papel o Tijeras! ✊✋✌️
🍓 *#sopa • #buscarpalabra* ➢ ¡Encuentra las palabras escondidas! 🔎📜
💖 *#pvp • #suit* + <mencion> ➢ ¡Un duelo amistoso! ⚔️🎮
✨ *#ttt* ➢ ¡Crea una sala de Tres en Raya! ❌⭕GameBoard

💖 ¡Gracias por ser mi amigo! Si necesitas algo, solo pregúntame. UwU 💖

`.trim()

  await conn.sendMessage(m.chat, {
  text: txt,
  contextInfo: {
    mentionedJid: [m.sender, userId],
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id,
      newsletterName: channelRD.name,
      serverMessageId: -1,
    },
    forwardingScore: 16,
    externalAdReply: {
      title: "☕︎︎ 𝘔𝘢𝘪 • 𝑊𝑜𝑟𝑙𝑑 𝑂𝑓 𝐶𝑢𝑡𝑒🐤",
      body: "✐ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖡𝗒 𝖶𝗂𝗋𝗄 💛",
      thumbnailUrl: banner,
      sourceUrl: "https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY",
      mediaType: 1,
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
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    // Formato un poco más suave, usando "h", "m", "s"
    let parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`); // always show seconds, or if everything else is zero

    return parts.join(' '); // Joining with spaces
}
