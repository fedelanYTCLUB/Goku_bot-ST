let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

    let txt = `
ଘ(੭ˊ꒳ˋ)੭✧ New! Mira mi página de descargas:
💖 URL: https://play-youtubedescargas.vercel.app/
🌸 He estado activa desde: \`${uptime}\`

╭─── ✿・°・✿ ───╮
✨ ¡Hola, ${name}! Soy ${botname} ✨
 ¿Cómo estás hoy, dulzura? :3 💖
╰─── ✿・°・✿ ───╯

🌸 Información Rápida 🌸
・ Cliente: @${userId.split('@')[0]}
・ Modo: Pública
・ Bot: ${(conn.user.jid == global.conn.user.jid ? '✐ 𝖯𝗋𝗂𝗇𝖼𝗂𝗉𝖺𝗅 ' : 'Sub Bot 💎')}
・ Usuarios: ${totalreg}
・ Comandos: ${totalCommands}
・ Baileys: Multi Device
✨───────────────────✨

💡 Tip: ¡Crea tu propio Sub-Bot usando *#qr* o *#code*!

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Información ｡･:*:･ﾟ★
・ *#help • #menu* ➢ Lista de comandos (ﾉ◕ヮ◕)ﾉ*.✧
・ *#uptime • #runtime* ➢ ¿Cuánto llevo despierta? 💤
・ *#sc • #script* ➢ Mi casita en GitHub 🏡
・ *#staff • #colaboradores* ➢ ¡Conoce a mis papis! ✨
・ *#serbot • #serbot code* ➢ ¡Hazme tuya! (づ｡◕‿‿◕｡)づ
・ *#bots • #sockets* ➢ Mis amiguitos bots activos 🤖
・ *#creador* ➢ ¿Quieres hablar con mi creador? 📞
・ *#status • #estado* ➢ Mi estado actual (｡•̀ᴗ-)✧
・ *#links • #grupos* ➢ Nuestros lugares de encuentro 💖
・ *#infobot • #infobot* ➢ Información completa de mí ✨
・ *#sug • #newcommand* ➢ Sugiere un nuevo comando ✨
・ *#p • #ping* ➢ ¿Qué tan rápido soy? ⚡️
・ *#reporte • #reportar* ➢ Algo no va bien? ¡Avísame! 🚨
・ *#sistema • #system* ➢ Estado del sistema del servidor 💻
・ *#speed • #speedtest* ➢ Mis estadísticas de velocidad 🚀
・ *#views • #usuarios* ➢ ¡Cuántos amigos tengo! 👥
・ *#funciones • #totalfunciones* ➢ ¡Todas mis habilidades! ✨
・ *#ds • #fixmsgespera* ➢ Limpia mis recuerdos temporales (archivos de sesión) 🧹
・ *#editautoresponder* ➢ Configura mi voz (Prompt) 🗣️

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Búsqueda ｡･:*:･ﾟ★
・ *#tiktoksearch • #tiktoks* ➢ ¡Busca videos de TikTok! 🎶
・ *#tweetposts* ➢ ¡Busca tweets! 🐦
・ *#ytsearch • #yts* ➢ Busca en YouTube 📺
・ *#githubsearch* ➢ ¡Encuentra gente genial en GitHub! 🐱
・ *#cuevana • #cuevanasearch* ➢ Busca pelis en Cuevana 🎬
・ *#google* ➢ Busca cualquier cosa en Google 🌐
・ *#pin • #pinterest* ➢ ¡Encuentra inspiración en Pinterest! 📌
・ *#imagen • #image* ➢ Busca imágenes bonitas en Google 🖼️
・ *#animesearch • #animess* ➢ Busca en Tioanime 🦊
・ *#animei • #animeinfo* ➢ ¡Info de capítulos de anime! ✨
・ *#infoanime* ➢ Info de tu anime/manga favorito 📚
・ *#hentaisearch • #searchhentai* ➢ Busca hentai (🔞 cuidado!)
・ *#xnxxsearch • #xnxxs* ➢ Busca en Xnxx (🔞 cuidado!)
・ *#xvsearch • #xvideossearch* ➢ Busca en Xvideos (🔞 cuidado!)
・ *#pornhubsearch • #phsearch* ➢ Busca en Pornhub (🔞 cuidado!)
・ *#npmjs* ➢ Busca paquetes en npmjs 📦

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Descarga ｡･:*:･ﾟ★
・ *#tiktok • #tt* ➢ Descarga videos de TikTok ⬇️
・ *#mediafire • #mf* ➢ Descarga archivos de MediaFire ☁️
・ *#pinvid • #pinvideo* + [enlace] ➢ Descarga videos de Pinterest ✨
・ *#mega • #mg* + [enlace] ➢ Descarga archivos de MEGA 📦
・ *#play • #play2* • *#playaudio • #playvideo* ➢ Descarga música/video de YouTube 🎶🎬
・ *#ytmp3 • #ytmp4* ➢ Descarga audio/video de YouTube por URL ✨
・ *#fb • #facebook* ➢ Descarga videos de Facebook 📘
・ *#twitter • #x* + [Link] ➢ Descarga videos de Twitter/X 🐦
・ *#ig • #instagram* ➢ Descarga contenido de Instagram ✨
・ *#tts • #tiktoks* + [búsqueda] ➢ Busca y descarga videos de TikTok 🔍⬇️
・ *#terabox • #tb* + [enlace] ➢ Descarga archivos por Terabox ✨
・ *#gdrive • #drive* + [enlace] ➢ Descarga archivos por Google Drive ☁️
・ *#ttimg • #ttmp3* + <url> ➢ Descarga fotos/audios de TikTok 📸🎶
・ *#gitclone* + <url> ➢ Descarga un repositorio de GitHub 🐱
・ *#xvideosdl* ➢ Descarga videos de Xvideos (🔞 cuidado!)
・ *#xnxxdl* ➢ Descarga videos de Xnxx (🔞 cuidado!)
・ *#apk • #modapk* ➢ Descarga apps apk de Aptoide 📱
・ *#tiktokrandom • #ttrandom* ➢ ¡Un TikTok al azar! ✨
・ *#npmdl • #npmdownloader* ➢ Descarga paquetes de NPMJs 📦
・ *#animelinks • #animedl* ➢ ¡Links de descarga de anime! ✨

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Economía ｡･:*:･ﾟ★
・ *#w • #work • #trabajar* ➢ ¡Gana ${moneda} trabajando! 💼
・ *#slut • #protituirse* ➢ ...Trabaja de otra forma para ganar ${moneda} (🔞)
・ *#cf • #suerte* ➢ Apuesta tus ${moneda} a cara o cruz 🍀
・ *#crime • #crimen* ➢ ¡Conviértete en ladrón por ${moneda}! (Cuidado!) 🔪
・ *#ruleta • #roulette • #rt* ➢ ¡Apuesta tus ${moneda} en la ruleta! 🔴⚫
・ *#casino • #apostar* ➢ ¡Prueba tu suerte en el casino con tus ${moneda}! 🎰
・ *#slot* ➢ ¡Gira la máquina tragaperras! 🍒🍋🍊
・ *#cartera • #wallet* ➢ Revisa tus ${moneda} en tu cartera 👛
・ *#banco • #bank* ➢ Revisa tus ${moneda} en el banco 🏦
・ *#deposit • #depositar • #d* ➢ ¡Guarda tus ${moneda} en el banco! 📥
・ *#with • #retirar • #withdraw* ➢ ¡Saca tus ${moneda} del banco! 📤
・ *#transfer • #pay* ➢ ¡Envía ${moneda} o XP a tus amigos! ✨
・ *#miming • #minar • #mine* ➢ ¡A minar recursos! ⛏️
・ *#buyall • #buy* ➢ Compra ${moneda} con tu XP ✨
・ *#daily • #diario* ➢ ¡Tu regalo diario te espera! 🎁
・ *#cofre* ➢ ¡Reclama un cofre lleno de sorpresas! 💎
・ *#weekly • #semanal* ➢ ¡Tu regalo semanal! 🥳
・ *#monthly • #mensual* ➢ ¡Tu recompensa mensual! 🎉
・ *#steal • #robar • #rob* ➢ ¡Intenta robarle ${moneda} a alguien! (Peligroso!) 🕵️
・ *#robarxp • #robxp* ➢ ¡Intenta robar XP a alguien! (Peligroso!) ⚡
・ *#eboard • #baltop* ➢ ¡El top de los más ricos! 🏆
・ *#aventura • #adventure* ➢ ¡Explora un nuevo reino! 🗺️
・ *#curar • #heal* ➢ ¡Recupera tu salud! ❤️‍🩹
・ *#cazar • #hunt • #berburu* ➢ ¡Vamos de caza! 🏹
・ *#inv • #inventario* ➢ Revisa tus tesoros 🎒
・ *#mazmorra • #explorar* ➢ ¡Adéntrate en la mazmorra! 🗡️
・ *#halloween* ➢ ¿Dulce o truco? 🎃
・ *#christmas • #navidad* ➢ ¡Tu regalo navideño! 🎅

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Gacha ｡･:*:･ﾟ★
・ *#rollwaifu • #rw • #roll* ➢ ¿Quién será tu waifu/husbando hoy? ✨
・ *#claim • #c • #reclamar* ➢ ¡Reclama ese personaje que te gusta! 😍
・ *#harem • #waifus • #claims* ➢ Mira a todos tus personajes reclamados 🥰
・ *#charimage • #waifuimage • #wimage* ➢ ¡Ve la imagen de tu personaje! 🖼️
・ *#charinfo • #winfo • #waifuinfo* ➢ ¡Toda la info de tu personaje favorito! 📚
・ *#givechar • #givewaifu • #regalar* ➢ ¡Regala un personaje a un amigo! 🎁
・ *#vote • #votar* ➢ ¡Vota por tu personaje preferido! 👍
・ *#waifusboard • #waifustop • #topwaifus* ➢ ¡El top de los personajes más queridos! 🏆

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Sticker ｡･:*:･ﾟ★
・ *#sticker • #s* ➢ ¡Haz stickers de imágenes o videos! ✨
・ *#setmeta* ➢ ¡Ponle nombre a tu pack y autor! ✏️
・ *#delmeta* ➢ ¿No te gusta más? Elimina tu pack 🗑️
・ *#pfp • #getpic* ➢ Obtén la foto de perfil de alguien 👀
・ *#qc* ➢ ¡Crea stickers con texto o de usuarios! 💬👤
・ *#toimg • #img* ➢ ¡Convierte stickers en imágenes! 🖼️
・ *#brat • #ttp • #attp*︎ ➢ ¡Stickers solo con texto! ✨
・ *#emojimix* ➢ ¡Mezcla 2 emojis y haz un sticker! 😄+💖=✨
・ *#wm* ➢ Cambia el nombre de tus stickers 🏷️

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Herramientas ｡･:*:･ﾟ★
・ *#calcular • #calcular • #cal* ➢ ¡Soy tu calculadora personal! 🧮
・ *#tiempo • #clima* ➢ ¿Cómo está el clima? ☀️☁️
・ *#horario* ➢ La hora en diferentes lugares del mundo ⏰
・ *#fake • #fakereply* ➢ ¡Crea mensajes falsos para trolear! 😉
・ *#enhance • #remini • #hd* ➢ ¡Mejora la calidad de tus fotos! ✨
・ *#letra* ➢ ¡Cambia la fuente de tu texto! ✎
・ *#read • #readviewonce • #ver* ➢ ¡Mira esas fotos de una sola vista! 👀
・ *#whatmusic • #shazam* ➢ ¿Qué canción es esa? ¡Déjame ayudarte! 🎶
・ *#spamwa • #spam* ➢ ¡Envía spam a alguien! (Usa con cuidado!) ✉️
・ *#ss • #ssweb* ➢ ¡Saca una captura de pantalla de una web! 📸
・ *#length • #tamaño* ➢ Cambia el tamaño de imágenes/videos ✨
・ *#say • #decir* + [texto] ➢ ¡Repito lo que dices! 🗣️
・ *#todoc • #toducument* ➢ Convierte medios a documentos 📄
・ *#translate • #traducir • #trad* ➢ ¡Te ayudo a traducir! 🌐
・ *#qrcode* ➢ Crea códigos QR ✨

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Perfil ｡･:*:･ﾟ★
・ *#reg • #verificar • #register* ➢ ¡Regístrate y sé mi amigo! ✨
・ *#unreg* ➢ Si ya no quieres ser mi amigo... (;-;)
・ *#profile* ➢ ¡Mira tu perfil! ✨
・ *#marry* [mención] ➢ ¡Propón matrimonio! 🥰💍
・ *#divorce* ➢ Si ya no funciona... 💔
・ *#setgenre • #setgenero* ➢ Dime cómo te identificas ✨
・ *#delgenre • #delgenero* ➢ ¿Cambiaste de opinión? 🤔
・ *#setbirth • #setnacimiento* ➢ ¿Cuándo es tu cumple? 🎂
・ *#delbirth • #delnacimiento* ➢ Olvida tu cumple... (｡>﹏<｡)
・ *#setdescription • #setdesc* ➢ ¡Pon algo lindo sobre ti! 📝
・ *#deldescription • #deldesc* ➢ Borra tu descripción 🗑️
・ *#lb • #lboard* + <Página> ➢ ¡El top de los más experimentados! 🏆
・ *#level • #lvl* + <@Mención> ➢ ¿Cuál es tu nivel de amistad conmigo? 🥰
・ *#comprarpremium • #premium* ➢ ¡Sé un usuario premium! ✨
・ *#confesiones • #confesar* ➢ ¡Confiesa tus secretos anónimamente! 🤫

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Grupos ｡･:*:･ﾟ★
・ *#config • #on* ➢ Mira mis opciones de configuración en el grupo ⚙️
・ *#hidetag* ➢ ¡Menciona a todos sin que se den cuenta! 👀
・ *#gp • #infogrupo* ➢ Información de nuestro lindo grupo 💖
・ *#linea • #listonline* ➢ ¿Quién está conectado? 🤔
・ *#setwelcome* ➢ ¡Configura un mensaje de bienvenida especial! 👋
・ *#setbye* ➢ ¡Configura un mensaje para cuando alguien se va! 👋😢
・ *#link* ➢ ¡Te doy el enlace del grupo! 🔗
・ *#admins • #admin* ➢ ¡Menciona a los jefes! 👑
・ *#restablecer • #revoke* ➢ Cambia el enlace del grupo 🔄
・ *#grupo • #group* [open / abrir] ➢ ¡Abre el grupo para todos! 🔓
・ *#grupo • #gruop* [close / cerrar] ➢ ¡Cierra el grupo! 🔒
・ *#kick* [número / mension] ➢ ¡Adiós, adiós! 👋
・ *#add • #añadir • #agregar* [número] ➢ ¡Invita a nuevos amigos! 👋🥰
・ *#promote* [mension] ➢ ¡Hazlo admin! 👑
・ *#demote* [mension] ➢ Quítale el poder 😈
・ *#gpbanner • #groupimg* ➢ ¡Cambia la foto del grupo! 🖼️
・ *#gpname • #groupname* ➢ ¡Cambia el nombre del grupo! ✏️
・ *#gpdesc • #groupdesc* ➢ ¡Cambia la descripción del grupo! 📝
・ *#advertir • #warn • #warning* ➢ ¡Una pequeña advertencia! ⚠️
・ *#unwarn • #delwarn* ➢ Borra una advertencia ✨
・ *#advlist • #listadv* ➢ ¿Quién tiene advertencias? 🤔
・ *#bot on* ➢ ¡Enciéndeme en este grupo! ✨
・ *#bot off* ➢ ¡Apágame en este grupo! 😴
・ *#mute* [mension] ➢ ¡Ya no puedo leer sus mensajes! 🤫
・ *#unmute* [mension] ➢ ¡Ahora sí los leo! 👀
・ *#encuesta • #poll* ➢ ¡Creemos una encuesta! 📊
・ *#delete • #del* ➢ ¡Borro mensajes por ti! 🗑️
・ *#fantasmas* ➢ ¿Quiénes están inactivos? 👻
・ *#kickfantasmas* ➢ ¡Echa a los fantasmas! 👋👻
・ *#invocar • #tagall • #todos* ➢ ¡Llama a todos! 📢
・ *#setemoji • #setemo* ➢ Cambia el emoji de invitación ✨
・ *#listnum • #kicknum* ➢ Elimina usuarios por prefijo de país 🌍

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Anime Reacciones ｡･:*:･ﾟ★
・ *#angry • #enojado* + <mencion> ➢ ¡Estoy enojado! 😠
・ *#bite* + <mencion> ➢ ¡Te muerdo! 🦷
・ *#bleh* + <mencion> ➢ ¡Saco la lengua! 😛
・ *#blush* + <mencion> ➢ ¡Me sonrojo! (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)
・ *#bored • #aburrido* + <mencion> ➢ ¡Estoy aburrido! 😴
・ *#cry* + <mencion> ➢ ¡Voy a llorar! 😭
・ *#cuddle* + <mencion> ➢ ¡Dame un abrazo acurrucadito! 🥰
・ *#dance* + <mencion> ➢ ¡Vamos a bailar! 💃🕺
・ *#drunk* + <mencion> ➢ ¡Estoy un poco mareado! 🥴
・ *#eat • #comer* + <mencion> ➢ ¡Ñam ñam! 🍔
・ *#facepalm* + <mencion> ➢ 🤦‍♀️
・ *#happy • #feliz* + <mencion> ➢ ¡Estoy súper feliz! ✨🥳
・ *#hug* + <mencion> ➢ ¡Un abrazo gigante! 🤗
・ *#impregnate • #preg* + <mencion> ➢ 🤰 (🔞)
・ *#kill* + <mencion> ➢ ¡Te mato! (En broma!) 🔪😂
・ *#kiss • #besar* • #kiss2 + <mencion> ➢ ¡Muak! 😘
・ *#laugh* + <mencion> ➢ ¡Jajajaja! 😂
・ *#lick* + <mencion> ➢ ¡Te lamo! 👅
・ *#love • #amor* + <mencion> ➢ ¡Me siento enamorada! 🥰💖
・ *#pat* + <mencion> ➢ ¡Pat pat en la cabeza! 👋😊
・ *#poke* + <mencion> ➢ ¡Te pico! 👉
・ *#pout* + <mencion> ➢ ¡Hago pucheros! 😞
・ *#punch* + <mencion> ➢ ¡Un puñetazo amistoso! 👊
・ *#run* + <mencion> ➢ ¡A correr! 🏃‍♀️
・ *#sad • #triste* + <mencion> ➢ ¡Estoy triste! 😥
・ *#scared* + <mencion> ➢ ¡Qué miedo! 😨
・ *#seduce* + <mencion> ➢ 😉 (🔞)
・ *#shy • #timido* + <mencion> ➢ ¡Qué vergüenza! 😳
・ *#slap* + <mencion> ➢ ¡Una bofetada! 👋😠
・ *#dias • #days* ➢ ¡Buenos días! ☀️
・ *#noches • #nights* ➢ ¡Buenas noches! 🌙
・ *#sleep* + <mencion> ➢ ¡Hora de dormir! 😴
・ *#smoke* + <mencion> ➢ 🚬
・ *#think* + <mencion> ➢ 🤔

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
🔞 Comandos NSFW (18+) 🔞
・ *#anal* + <mencion> ➢ (🔞)
・ *#waifu* ➢ Busca una waifu aleatoria (Algunas pueden ser NSFW) ✨
・ *#bath* + <mencion> ➢ ¡Hora del baño! 🛁
・ *#blowjob • #mamada • #bj* + <mencion> ➢ (🔞)
・ *#boobjob* + <mencion> ➢ (🔞)
・ *#cum* + <mencion> ➢ (🔞)
・ *#fap* + <mencion> ➢ (🔞)
・ *#ppcouple • #ppcp* ➢ ¡Imágenes para tu pareja o mejor amigo! 🥰
・ *#footjob* + <mencion> ➢ (🔞)
・ *#fuck • #coger • #fuck2* + <mencion> ➢ (🔞)
・ *#cafe • #coffe* ➢ ¡Un cafecito! ☕
・ *#violar • #perra* + <mencion> ➢ (🔞)
・ *#grabboobs* + <mencion> ➢ (🔞)
・ *#grop* + <mencion> ➢ (🔞)
・ *#lickpussy* + <mencion> ➢ (🔞)
・ *#rule34 • #r34* + [Tags] ➢ Busca en Rule34 (🔞)
・ *#sixnine • #69* + <mencion> ➢ (🔞)
・ *#spank • #nalgada* + <mencion> ➢ (🔞)
・ *#suckboobs* + <mencion> ➢ (🔞)
・ *#undress • #encuerar* + <mencion> ➢ (🔞)
・ *#yuri • #tijeras* + <mencion> ➢ (🔞)

─── ♡･ﾟ: * Commands *: ･ﾟ♡ ───
｡･:*:･ﾟ★ Comandos de Juegos ｡･:*:･ﾟ★
・ *#amistad • #amigorandom* ➢ ¡Haz un nuevo amigo al azar! ✨
・ *#chaqueta • #jalamela* ➢ 😉
・ *#chiste* ➢ ¡Déjame contarte un chiste! 😂
・ *#consejo* ➢ ¡Un pequeño consejo para ti! ✨
・ *#doxeo • #doxear* + <mencion> ➢ ¡Un doxeo de broma! 😈
・ *#facto* ➢ ¡Un dato interesante! 🤔
・ *#formarpareja* ➢ ¡Busca a tu media naranja! 💖
・ *#formarpareja5* ➢ ¡Busca 5 medias naranjas! 😉💖
・ *#frase* ➢ ¡Una linda frase para ti! ✨
・ *#huevo* ➢ 😉
・ *#chupalo* + <mencion> ➢ 😉
・ *#aplauso* + <mencion> ➢ 👏
・ *#marron* + <mencion> ➢ (Broma)
・ *#suicidar* ➢ (No lo hagas!) 😥
・ *#iq • #iqtest* + <mencion> ➢ ¿Cuál es tu IQ? 🤔
・ *#meme* ➢ ¡Un meme para alegrarte el día! 😂
・ *#morse* ➢ ¡Traduce a código morse! .-
・ *#nombreninja* ➢ ¿Cómo serías si fueras un ninja? 🥷
・ *#paja • #pajeame* ➢ 😉
・ *#personalidad* + <mencion> ➢ ¿Cuál es tu personalidad? ✨
・ *#piropo* ➢ ¡Te lanzo un piropo! 😉
・ *#pregunta* ➢ ¡Hazme una pregunta! 🤔❓
・ *#ship • #pareja* ➢ ¿Cuál es la probabilidad de que sean pareja? 🥰
・ *#sorteo* ➢ ¡Empieza un sorteo! 🎉
・ *#top* ➢ ¡Empieza un top! 🏆
・ *#formartrio* + <mencion> ➢ ¡Formen un trío! 😉
・ *#ahorcado* ➢ ¡Juega al Ahorcado! 😬
・ *#genio* ➢ ¡Pregunta al Genio! ✨
・ *#mates • #matematicas* ➢ ¡Juega Matemáticas! ➕➖✖️➗
・ *#ppt* ➢ ¡Piedra, Papel o Tijeras! ✊✋✌️
・ *#sopa • #buscarpalabra* ➢ ¡Juega Sopa de Letras! 🔡
・ *#pvp • #suit* + <mencion> ➢ ¡Un duelo amistoso! 💥
・ *#ttt* ➢ ¡Juega Tres en Raya! ❌⭕
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
    // Formato kawaii para el tiempo
    return `${hours}h ${minutes}m ${seconds}s ✨`
}
