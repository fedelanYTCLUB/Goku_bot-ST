import fs from 'fs';
import path from 'path';
// Import necessary modules from your bot framework if needed for specific interactions
// For example, if you need to send interactive messages or get profile pictures:
// import pkg from '@whiskeysockets/baileys';
// const { generateWAMessageFromContent, proto } = pkg;
// import fetch from 'node-fetch'; // If your environment supports it

// --- Define the path to the database file ---
const DATABASE_FILE = path.join('./src/database', 'database.json');

// --- Constants (Matching your example) ---
const COOLDOWN_MINING = 5 * 60 * 1000; // 5 minutos
const COOLDOWN_FARMING = 3 * 60 * 1000; // 3 minutos
const COOLDOWN_HUNTING = 4 * 60 * 1000; // 4 minutos
const COOLDOWN_ADVENTURE = 10 * 60 * 1000; // 10 minutos
const COOLDOWN_DUEL = 30 * 60 * 1000; // 30 minutos
const COOLDOWN_ROBBERY = 60 * 60 * 1000; // 1 hora
const COOLDOWN_MARRIAGE_ACTION = 60 * 1000; // Cooldown for proposing/accepting marriage (1 minute for simulation)
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 horas for daily claim
const SOCIAL_COOLDOWN = 1 * 60 * 1000; // 1 minute cooldown for social command

// --- Database Handling ---

// Ensure the database directory and file exist
const ensureDatabase = () => {
    const dbDir = path.dirname(DATABASE_FILE);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`Created database directory: ${dbDir}`);
    }
    if (!fs.existsSync(DATABASE_FILE)) {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify({ users: {}, groups: {}, clans: {} }, null, 4));
        console.log(`Created empty database file: ${DATABASE_FILE}`);
    }
};

// Load the entire database from the JSON file
const loadDatabase = () => {
    ensureDatabase();
    try {
        const data = fs.readFileSync(DATABASE_FILE, 'utf8');
        const db = JSON.parse(data);
        // Ensure top-level keys exist even if the file was empty or incomplete
        if (!db.users) db.users = {};
        if (!db.groups) db.groups = {};
        if (!db.clans) db.clans = {};
        return db;
    } catch (e) {
        console.error(`Error loading database from ${DATABASE_FILE}:`, e);
        // Return empty structure on error
        return { users: {}, groups: {}, clans: {} };
    }
};

// Save the entire database to the JSON file
const saveDatabase = (db) => {
    ensureDatabase();
    try {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 4), 'utf8');
        // console.log("Database saved successfully."); // Optional: log save success
    } catch (e) {
        console.error(`Error saving database to ${DATABASE_FILE}:`, e);
    }
};

// --- Player Data Structure (Matching your example) ---

const getDefaultUserData = (userId, userName) => {
    return {
        // Basic data
        exp: 0, limit: 10, lastclaim: 0, registered: true, name: userName, // Assume registered is true on first interaction
        // RPG - Resources
        health: 100, stamina: 100, mana: 20,
        gold: 50, diamond: 0, emerald: 0, ruby: 0, iron: 0, stone: 0, wood: 0, leather: 0, string: 0,
        herb: 0, food: 5, potion: 1, seeds: 0, crops: 0,
        // RPG - Equipamiento (represented by quantity/level)
        weapon: 0, armor: 0, pickaxe: 0, axe: 0, fishingrod: 0,
        // RPG - Habilidades (basic stats)
        strength: 5, agility: 5, intelligence: 5, charisma: 5, vitality: 5,
        // RPG - Estadísticas (combat/social)
        level: 1, kills: 0, deaths: 0, wins: 0, losses: 0,
        // RPG - Social
        reputation: 0, guild: '', clan: '', clanRank: '', family: '', marriage: '', children: [],
        // RPG - Propiedad (level or quantity)
        house: 0, farm: 0, barn: 0, workshop: 0, shop: 0,
        // RPG - Temporizado (timestamps)
        lastadventure: 0, lastmining: 0, lastfarming: 0, lasthunting: 0, lastduel: 0, lastrobbery: 0, lastmarriage: 0, // Using lastmarriage for cooldown
        lastsocial: 0, // Cooldown for social command
        // RPG - Mascotas
        pet: 0, petExp: 0, petLevel: 1, petName: '',
        lastpetfeed: 0,
        lastpetadventure: 0,
        // RPG - Misiones
        activeQuest: null, // { type: 'hunt', name: 'Caza', target: 5, reward: { gold: 500, exp: 300 } }
        questProgress: 0,
    };
};

// --- Clan Data Structure ---
const getDefaultClanData = (clanName, leaderJid) => {
    return {
        name: clanName,
        leader: leaderJid,
        members: [leaderJid],
        level: 1,
        exp: 0,
        territory: '',
        treasury: 1000, // Initial clan gold
        founded: Date.now(),
        wars: {},
        alliances: [],
        lastTerritoryClaim: 0,
        lastTerritoryUpgrade: 0,
    };
};


// --- Helper Functions ---

const getPlayer = (db, userId, userName) => {
    if (!db.users[userId]) {
        db.users[userId] = getDefaultUserData(userId, userName);
        console.log(`Created new player data for: ${userName} (${userId})`);
    }
    return db.users[userId];
};

const addExperience = (player, amount) => {
    player.exp += amount;
    // Simple leveling formula (can be made more complex)
    let xpNeededForLevel = player.level * 100 + (player.level - 1) * 50;
    const levelUpMessages = [];
    while (player.exp >= xpNeededForLevel) {
        player.level += 1;
        player.exp -= xpNeededForLevel;
        xpNeededForLevel = player.level * 100 + (player.level - 1) * 50; // Update XP needed for next level
        // Increase stats on level up
        player.max_health = (player.max_health || 100) + 20;
        player.health = player.max_health; // Heal on level up
        player.attack = (player.attack || 10) + 5;
        levelUpMessages.push(`🎉 ¡${player.name} subió al nivel ${player.level}!`);
    }
    return levelUpMessages; // Return messages to be sent by the bot
};

const formatCooldownTime = (msLeft) => {
    const seconds = Math.ceil(msLeft / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds} segundo${remainingSeconds > 1 ? 's' : ''}`);

    return parts.join(' y ');
};


// --- RPG Command Handler ---

// This is the main function you will call from your bot's message handler
const handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {

    // Load the database at the start of each command processing
    const db = loadDatabase();
    const user = getPlayer(db, m.sender, conn.getName(m.sender)); // Get or create user data

    const currentTime = Date.now(); // Get current timestamp

    // --- Help Message / Main Menu ---
    if (!args[0]) {
        // You can use your bot framework's interactive message feature here
        // For now, returning the help text as a string
        const helpText = `
╔══════════════════════
║ 🌟 𝐑𝐏𝐆-𝐔𝐥𝐭𝐫𝐚 𝐕𝟑 🌟
╠══════════════════════
║ ⚔️ *COMANDOS DE ACCIÓN* ⚔️
║
║ ➤ ${usedPrefix}rpg profile
║ ➤ ${usedPrefix}rpg adventure
║ ➤ ${usedPrefix}rpg mine
║ ➤ ${usedPrefix}rpg hunt
║ ➤ ${usedPrefix}rpg farm
║ ➤ ${usedPrefix}rpg fish (No implementado)
║ ➤ ${usedPrefix}rpg craft (No implementado)
║ ➤ ${usedPrefix}rpg sell [recurso] [cantidad]
║ ➤ ${usedPrefix}rpg buy [articulo] [cantidad]
║ ➤ ${usedPrefix}rpg shop
║
╠══════════════════════
║ 🏆 *SISTEMA SOCIAL* 🏆
║
║ ➤ ${usedPrefix}rpg duel @usuario (Simulado)
║ ➤ ${usedPrefix}rpg rob @usuario
║ ➤ ${usedPrefix}rpg marry @usuario (Simulado)
║ ➤ ${usedPrefix}rpg divorce
║ ➤ ${usedPrefix}rpg family (No implementado)
║ ➤ ${usedPrefix}rpg adopt @usuario (No implementado)
║ ➤ ${usedPrefix}rpg guild (No implementado)
║ ➤ ${usedPrefix}rpg clan
║ ➤ ${usedPrefix}rpg love (Buscar pareja)
║ ➤ ${usedPrefix}rpg social (Interacción social aleatoria)
║
╠══════════════════════
║ 🏠 *PROPIEDADES* 🏠
║
║ ➤ ${usedPrefix}rpg buyhouse
║ ➤ ${usedPrefix}rpg buyfarm
║ ➤ ${usedPrefix}rpg workshop (No implementado)
║ ➤ ${usedPrefix}rpg buildshop (No implementado)
║
╠══════════════════════
║ 🐶 *MASCOTAS* 🐱
║
║ ➤ ${usedPrefix}rpg pet
║ ➤ ${usedPrefix}rpg petadopt [tipo]
║ ➤ ${usedPrefix}rpg petfeed
║ ➤ ${usedPrefix}rpg petstats (Igual que pet)
║ ➤ ${usedPrefix}rpg petadventure
║
╠══════════════════════
║ 🌐 *MULTIJUGADOR* 🌐
║
║ ➤ ${usedPrefix}rpg createclan [nombre]
║ ➤ ${usedPrefix}rpg joinclan [nombre] (No implementado)
║ ➤ ${usedPrefix}rpg leaveclan (No implementado)
║ ➤ ${usedPrefix}rpg clanwar (No implementado)
║ ➤ ${usedPrefix}rpg territory [action]
║ ➤ ${usedPrefix}rpg alliance (No implementado)
║
╠══════════════════════
║ 📜 *HISTORIA Y MISIONES* 📜
║
║ ➤ ${usedPrefix}rpg quest [claim]
║ ➤ ${usedPrefix}rpg daily
║ ➤ ${usedPrefix}rpg weekly (No implementado)
║ ➤ ${usedPrefix}rpg story (No implementado)
║ ➤ ${usedPrefix}rpg dungeon (No implementado)
║
╠══════════════════════
║ ℹ️ *SOPORTE* ℹ️
║
║ ➤ ${usedPrefix}rpg soporte
╚══════════════════════
`;
        // If using baileys interactive messages:
        /*
        try {
             const interactiveMessage = { // ... your interactive message object from JS example ... };
             const message = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, interactiveMessage: interactiveMessage }}}, { quoted: m });
             await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
             return; // Stop processing after sending menu
        } catch (error) {
             console.error('Error al generar menu RPG:', error);
             // Fallback to sending plain text help if interactive message fails
             await conn.reply(m.chat, helpText, m);
             return;
        }
        */
        // For basic implementation, just reply with help text
        await conn.reply(m.chat, helpText, m);
        return;
    }

    let type = (args[0] || '').toLowerCase();
    const levelUpMessages = []; // To collect level up messages

    // --- Command Processing ---
    switch (type) {
        case 'profile':
        case 'rpgprofile':
            // Get profile picture (requires fetch or similar)
            let pp;
            try {
                 // This part depends on your bot framework's function to get profile picture
                 // Example using a hypothetical conn.profilePictureUrl:
                 // pp = await conn.profilePictureUrl(m.sender, 'image');
                 // If the above fails or you don't have it:
                 pp = './src/avatar_contact.png'; // Fallback image
            } catch {
                 pp = './src/avatar_contact.png'; // Fallback image
            }

            const profileText = `
╔═══════════════════
║ 📊 𝐏𝐄𝐑𝐅𝐈𝐋 𝐃𝐄 𝐉𝐔𝐆𝐀𝐃𝐎𝐑 📊
╠═══════════════════
║ 👤 *Nombre:* ${user.name}
║ 🏅 *Nivel:* ${user.level}
║ ✨ *Experiencia:* ${user.exp}
║ ❤️ *Salud:* ${user.health}/${user.max_health || 100}
║ ⚡ *Energía:* ${user.stamina}/100
║ 🔮 *Maná:* ${user.mana}/20
╠═══════════════════
║ 💰 *Oro:* ${user.gold}
║ 💎 *Diamantes:* ${user.diamond}
║ 🟢 *Esmeraldas:* ${user.emerald}
║ ❤️ *Rubíes:* ${user.ruby}
╠═══════════════════
║ ⚔️ *Fuerza:* ${user.strength}
║ 🏃 *Agilidad:* ${user.agility}
║ 🧠 *Inteligencia:* ${user.intelligence}
║ 🗣️ *Carisma:* ${user.charisma}
║ 💪 *Vitalidad:* ${user.vitality}
╠═══════════════════
║ 🏠 *Casa:* ${user.house ? 'Nivel ' + user.house : 'No tiene'}
║ 🌾 *Granja:* ${user.farm ? 'Nivel ' + user.farm : 'No tiene'}
║ 🛡️ *Clan:* ${user.clan || 'No pertenece'}
║ 👑 *Rango en Clan:* ${user.clanRank || 'N/A'}
║ 👨‍👩‍👧‍👦 *Familia:* ${user.family || 'No tiene'}
║ 💍 *Matrimonio:* ${user.marriage ? (db.users[user.marriage]?.name || 'Desconocido') : 'Soltero/a'}
╠═══════════════════
║ 🐾 *Mascota:* ${user.pet ? (user.petName || 'Sin nombre') + ' (Nivel ' + user.petLevel + ')' : 'No tiene'}
╚═══════════════════
`;
            // Send the profile picture and text (requires your bot framework's method)
            await conn.sendFile(m.chat, pp, 'profile.jpg', profileText, m);
            break;

        case 'adventure':
        case 'aventura':
            if (currentTime - user.lastadventure < COOLDOWN_ADVENTURE) {
                const timeLeft = COOLDOWN_ADVENTURE - (currentTime - user.lastadventure);
                await conn.reply(m.chat, `⏱️ Debes esperar ${formatCooldownTime(timeLeft)} antes de otra aventura.`, m);
                return;
            }
            if (user.stamina < 20) {
                await conn.reply(m.chat, `😫 Estás demasiado cansado para aventurarte. Necesitas recuperar energía.`, m);
                return;
            }

            const adventureRewards = { exp: 0, gold: 0, items: [] };
            let adventureText = '';

            const encounter = Math.random();

            if (encounter < 0.1) {
                adventureText = `🐉 *¡Te has encontrado con un Dragón Ancestral!*\n\n`;
                const successChance = (user.strength + user.agility + user.intelligence) / 60;
                const success = Math.random() < successChance;

                if (success) {
                    adventureText += `Con gran valentía y estrategia, has logrado derrotar al Dragón. Entre sus tesoros encuentras:`;
                    adventureRewards.exp = 1000;
                    adventureRewards.gold = 800;
                    adventureRewards.items.push('💎 5 Diamantes');
                    adventureRewards.items.push('❤️ 3 Rubíes');
                    user.diamond += 5;
                    user.ruby += 3;
                } else {
                    adventureText += `El Dragón era demasiado fuerte. Has logrado escapar, pero con graves heridas.`;
                    user.health -= 50;
                    if (user.health < 1) user.health = 1;
                    adventureRewards.exp = Math.floor(random.int(100, 500) / 3); // Base EXP from common encounter / 3
                    adventureRewards.gold = Math.floor(random.int(50, 200) / 4); // Base Gold from common encounter / 4
                }
            } else if (encounter < 0.3) {
                adventureText = `🧙‍♂️ *Te encuentras con un mercader místico*\n\n`;
                adventureText += `Te ofrece un intercambio justo por tus habilidades. A cambio de ayudarlo a cruzar el bosque peligroso, te recompensa con:`;
                adventureRewards.exp = 200;
                adventureRewards.items.push('🧪 2 Pociones');
                user.potion += 2;
            } else if (encounter < 0.6) {
                adventureText = `🏆 *¡Has encontrado un antiguo cofre del tesoro!*\n\n`;
                adventureText += `Al abrirlo descubres un botín espléndido:`;
                adventureRewards.gold = 300;
                adventureRewards.items.push('🟢 2 Esmeraldas');
                adventureRewards.items.push('🧩 Fragmento de mapa'); // Placeholder item
                user.emerald += 2;
            } else {
                adventureText = `👾 *Te has adentrado en un nido de monstruos*\n\n`;
                adventureText += `Después de una ardua batalla, logras salir victorioso. Recolectas:`;
                adventureRewards.exp = random.int(100, 500);
                adventureRewards.gold = random.int(50, 200);
                adventureRewards.items.push('🧶 5 Cuerdas');
                adventureRewards.items.push('🧱 3 Piedras');
                adventureRewards.items.push('🥩 2 Carnes');
                user.string += 5;
                user.stone += 3;
                user.food += 2;
            }

            // Update user data
            levelUpMessages.push(...addExperience(user, adventureRewards.exp));
            user.gold += adventureRewards.gold;
            user.lastadventure = currentTime;
            user.stamina -= 20;
            if (user.stamina < 0) user.stamina = 0;

            const finalAdventureText = `
${adventureText}

*🎁 Recompensas obtenidas:*
✨ ${adventureRewards.exp} EXP
💰 ${adventureRewards.gold} Oro
${adventureRewards.items.map(item => `• ${item}`).join('\n') || 'Ninguno'}

❤️ Salud actual: ${user.health}/${user.max_health || 100}
🔋 Energía: ${user.stamina}/100
`;
            await conn.reply(m.chat, levelUpMessages.join('\n') + (levelUpMessages.length > 0 ? '\n\n' : '') + finalAdventureText, m);
            break;

        case 'mine':
        case 'minar':
            if (currentTime - user.lastmining < COOLDOWN_MINING) {
                const timeLeft = COOLDOWN_MINING - (currentTime - user.lastmining);
                await conn.reply(m.chat, `⛏️ Tus herramientas aún se están enfriando. Espera ${formatCooldownTime(timeLeft)} antes de volver a minar.`, m);
                return;
            }
            if (user.pickaxe < 1) {
                await conn.reply(m.chat, `🛠️ Necesitas un pico para minar. Compra uno en la tienda con ${usedPrefix}rpg shop`, m);
                return;
            }
            if (user.stamina < 20) {
                await conn.reply(m.chat, `😫 Estás demasiado cansado para minar. Necesitas recuperar energía.`, m);
                return;
            }

            let miningText = `⛏️ *Te adentras en las profundidades de la mina...*\n\n`;
            const miningRewards = [];
            const miningSuccess = Math.random();
            const pickaxeBonus = user.pickaxe * 0.05; // Simple bonus based on pickaxe level/quantity

            if (miningSuccess < 0.1 + pickaxeBonus) {
                miningText += `💎 *¡VETA EXCEPCIONAL!* Has encontrado un filón rico en minerales preciosos.`;
                const diamonds = Math.floor(Math.random() * 3) + 1;
                const emeralds = Math.floor(Math.random() * 4) + 2;
                const rubies = Math.floor(Math.random() * 2) + 1;
                const expGained = 450;

                user.diamond += diamonds;
                user.emerald += emeralds;
                user.ruby += rubies;

                miningRewards.push(`💎 ${diamonds} Diamantes`);
                miningRewards.push(`🟢 ${emeralds} Esmeraldas`);
                miningRewards.push(`❤️ ${rubies} Rubíes`);
                miningRewards.push(`✨ ${expGained} EXP`);
                levelUpMessages.push(...addExperience(user, expGained));

            } else if (miningSuccess < 0.4 + pickaxeBonus) {
                miningText += `⚒️ *¡Buen hallazgo!* Has encontrado una veta rica en minerales.`;
                const iron = Math.floor(Math.random() * 8) + 5;
                const stone = Math.floor(Math.random() * 15) + 10;
                const goldNuggets = Math.floor(Math.random() * 6) + 3;
                const expGained = 200;

                user.iron += iron;
                user.stone += stone;
                user.gold += goldNuggets;

                miningRewards.push(`⚙️ ${iron} Hierro`);
                miningRewards.push(`🧱 ${stone} Piedra`);
                miningRewards.push(`💰 ${goldNuggets} Pepitas de oro`);
                miningRewards.push(`✨ ${expGained} EXP`);
                levelUpMessages.push(...addExperience(user, expGained));

            } else {
                miningText += `🪨 Has encontrado algunos minerales comunes.`;
                const stone = Math.floor(Math.random() * 10) + 5;
                const iron = Math.floor(Math.random() * 5) + 1;
                const expGained = 100;

                user.stone += stone;
                user.iron += iron;

                miningRewards.push(`🧱 ${stone} Piedra`);
                miningRewards.push(`⚙️ ${iron} Hierro`);
                miningRewards.push(`✨ ${expGained} EXP`);
                levelUpMessages.push(...addExperience(user, expGained));
            }

            if (Math.random() < 0.2) { // Probability of pickaxe wear
                miningText += `\n\n🛠️ ¡Tu pico se ha desgastado un poco durante la minería!`;
                // You could add logic here to decrease pickaxe durability if you implement it
            }

            user.stamina -= 20;
            if (user.stamina < 0) user.stamina = 0;
            user.lastmining = currentTime;

            const finalMiningText = `
${miningText}

*🎁 Recursos obtenidos:*
${miningRewards.map(item => `• ${item}`).join('\n') || 'Ninguno'}

🔋 Energía restante: ${user.stamina}/100
`;
            await conn.reply(m.chat, levelUpMessages.join('\n') + (levelUpMessages.length > 0 ? '\n\n' : '') + finalMiningText, m);
            break;

        case 'hunt':
        case 'cazar':
            if (currentTime - user.lasthunting < COOLDOWN_HUNTING) {
                const timeLeft = COOLDOWN_HUNTING - (currentTime - user.lasthunting);
                await conn.reply(m.chat, `🏹 Debes esperar ${formatCooldownTime(timeLeft)} antes de volver a cazar.`, m);
                return;
            }
             if (user.stamina < 15) {
                await conn.reply(m.chat, `😫 Estás demasiado cansado para cazar. Necesitas recuperar energía.`, m);
                return;
            }

            let huntText = `🏹 *Te adentras en el bosque para cazar...*\n\n`;
            const huntRewards = [];
            const huntSuccess = Math.random();

            if (huntSuccess < 0.15) {
                huntText += `🦌 *¡CAZA EXCEPCIONAL!* Has encontrado una criatura legendaria.`;
                const leather = Math.floor(Math.random() * 5) + 5;
                const food = Math.floor(Math.random() * 8) + 8;
                const expGained = 400;

                user.leather += leather;
                user.food += food;

                huntRewards.push(`🥩 ${food} Alimentos`);
                huntRewards.push(`🧣 ${leather} Cuero`);
                huntRewards.push(`✨ ${expGained} EXP`);
                levelUpMessages.push(...addExperience(user, expGained));

            } else if (huntSuccess < 0.5) {
                huntText += `🦊 *¡Buena caza!* Has cazado varios animales.`;
                const leather = Math.floor(Math.random() * 3) + 2;
                const food = Math.floor(Math.random() * 5) + 3;
                const expGained = 200;

                user.leather += leather;
                user.food += food;

                huntRewards.push(`🥩 ${food} Alimentos`);
                huntRewards.push(`🧣 ${leather} Cuero`);
                huntRewards.push(`✨ ${expGained} EXP`);
                levelUpMessages.push(...addExperience(user, expGained));

            } else {
                huntText += `🐇 Has cazado algunas presas menores.`;
                const food = Math.floor(Math.random() * 3) + 1;
                const expGained = 100;

                user.food += food;

                huntRewards.push(`🥩 ${food} Alimentos`);
                huntRewards.push(`✨ ${expGained} EXP`);
                levelUpMessages.push(...addExperience(user, expGained));
            }

            user.stamina -= 15;
            if (user.stamina < 0) user.stamina = 0;
            user.lasthunting = currentTime;

            const finalHuntText = `
${huntText}

*🎁 Recursos obtenidos:*
${huntRewards.map(item => `• ${item}`).join('\n') || 'Ninguno'}

🔋 Energía restante: ${user.stamina}/100
`;
            await conn.reply(m.chat, levelUpMessages.join('\n') + (levelUpMessages.length > 0 ? '\n\n' : '') + finalHuntText, m);
            break;

        case 'farm':
        case 'farming':
        case 'cultivar':
            if (currentTime - user.lastfarming < COOLDOWN_FARMING) {
                const timeLeft = COOLDOWN_FARMING - (currentTime - user.lastfarming);
                await conn.reply(m.chat, `🌱 Debes esperar ${formatCooldownTime(timeLeft)} antes de volver a cultivar.`, m);
                return;
            }
            if (user.farm < 1) {
                await conn.reply(m.chat, `🏡 Necesitas una granja para cultivar. Compra una con ${usedPrefix}rpg buyfarm`, m);
                return;
            }
            if (user.stamina < 10) {
                await conn.reply(m.chat, `😫 Estás demasiado cansado para trabajar la tierra. Necesitas recuperar energía.`, m);
                return;
            }
            if (user.seeds < 1) {
                await conn.reply(m.chat, `🌱 No tienes semillas para plantar. Cómpralas en ${usedPrefix}rpg shop`, m);
                return;
            }

            let farmText = `🌱 *Trabajas en tu granja...*\n\n`;
            const farmRewards = [];
            const farmSuccess = Math.random();
            const farmBonus = user.farm * 0.05; // Bonus based on farm level

            if (farmSuccess < 0.1 + farmBonus) {
                farmText += `🌽 *¡COSECHA EXCEPCIONAL!* Tus cultivos han prosperado extraordinariamente.`;
                const crops = Math.floor(Math.random() * 15) + 10;
                const herbs = Math.floor(Math.random() * 5) + 3;
                const expGained = 350;

                user.crops += crops;
                user.herb += herbs;

                farmRewards.push(`🌽 ${crops} Cultivos`);
                farmRewards.push(`🌿 ${herbs} Hierbas`);
                farmRewards.push(`✨ ${expGained} EXP`);
                levelUpMessages.push(...addExperience(user, expGained));

            } else if (farmSuccess < 0.4 + farmBonus) {
                farmText += `🥕 *¡Buena cosecha!* Tus cultivos han crecido bien.`;
                const crops = Math.floor(Math.random() * 8) + 5;
                const herbs = Math.floor(Math.random() * 3) + 1;
                const expGained = 200;

                user.crops += crops;
                user.herb += herbs;

                farmRewards.push(`🥕 ${crops} Cultivos`);
                farmRewards.push(`🌿 ${herbs} Hierbas`);
                farmRewards.push(`✨ ${expGained} EXP`);
                levelUpMessages.push(...addExperience(user, expGained));

            } else {
                farmText += `🥔 Has logrado una cosecha modesta.`;
                const crops = Math.floor(Math.random() * 5) + 2;
                const expGained = 100;

                user.crops += crops;

                farmRewards.push(`🥔 ${crops} Cultivos`);
                farmRewards.push(`✨ ${expGained} EXP`);
                levelUpMessages.push(...addExperience(user, expGained));
            }

            user.seeds -= 1;
            user.stamina -= 10;
            if (user.stamina < 0) user.stamina = 0;
            user.lastfarming = currentTime;

            const finalFarmText = `
${farmText}

*🎁 Recursos obtenidos:*
${farmRewards.map(item => `• ${item}`).join('\n') || 'Ninguno'}

🌱 Semillas restantes: ${user.seeds}
🔋 Energía restante: ${user.stamina}/100
`;
            await conn.reply(m.chat, levelUpMessages.join('\n') + (levelUpMessages.length > 0 ? '\n\n' : '') + finalFarmText, m);
            break;

        case 'duel':
        case 'duelo':
            if (!m.mentionedJid || m.mentionedJid.length === 0) {
                await conn.reply(m.chat, `👤 Debes especificar a quién quieres desafiar.\n\nEjemplo: ${usedPrefix}rpg duel @usuario`, m);
                return;
            }
            if (currentTime - user.lastduel < COOLDOWN_DUEL) {
                const timeLeft = COOLDOWN_DUEL - (currentTime - user.lastduel);
                await conn.reply(m.chat, `⚔️ Estás agotado de tu último combate. Podrás volver a desafiar en ${formatCooldownTime(timeLeft)}.`, m);
                return;
            }

            const opponentJid = m.mentionedJid[0];
            if (opponentJid === m.sender) {
                await conn.reply(m.chat, `😅 No puedes desafiarte a ti mismo.`, m);
                return;
            }

            // Ensure opponent exists in DB (create if not)
            if (!db.users[opponentJid]) {
                 db.users[opponentJid] = getDefaultUserData(opponentJid, conn.getName(opponentJid) || `Usuario_${opponentJid.split('@')[0]}`);
            }
            const opponent = db.users[opponentJid];


            // Simulate sending a challenge message (actual acceptance logic would be more complex)
            await conn.reply(m.chat, `⚔️ *¡DESAFÍO DE DUELO!* ⚔️\n\n@${m.sender.split('@')[0]} ha desafiado a @${opponentJid.split('@')[0]} a un duelo.\n\n@${opponentJid.split('@')[0]} tienes 60 segundos para aceptar el duelo escribiendo *"acepto"*.`, m, {
                mentions: [m.sender, opponentJid]
            });

            // In a real bot, you would store this challenge (e.g., in a temporary object or DB field)
            // and set up a listener for the opponent's "acepto" message within the timeout.
            // For this simulation, we just apply the cooldown to the challenger.
            user.lastduel = currentTime;

            break;

        case 'rob':
        case 'robar':
            if (!m.mentionedJid || m.mentionedJid.length === 0) {
                await conn.reply(m.chat, `👤 Debes especificar a quién quieres robar.\n\nEjemplo: ${usedPrefix}rpg rob @usuario`, m);
                return;
            }
            if (currentTime - user.lastrobbery < COOLDOWN_ROBBERY) {
                const timeLeft = COOLDOWN_ROBBERY - (currentTime - user.lastrobbery);
                await conn.reply(m.chat, `🕵️ Las autoridades te están vigilando. Podrás volver a robar en ${formatCooldownTime(timeLeft)}.`, m);
                return;
            }

            const targetJid = m.mentionedJid[0];
            if (targetJid === m.sender) {
                await conn.reply(m.chat, `😅 No puedes robarte a ti mismo.`, m);
                return;
            }

            // Ensure target exists in DB (create if not, though robbing non-existent user is weird)
             if (!db.users[targetJid]) {
                 db.users[targetJid] = getDefaultUserData(targetJid, conn.getName(targetJid) || `Usuario_${targetJid.split('@')[0]}`);
            }
            const target = db.users[targetJid];

            if (target.gold < 50) {
                await conn.reply(m.chat, `😔 @${targetJid.split('@')[0]} es demasiado pobre para robarle. Necesita al menos 50 de oro.`, m, {
                    mentions: [targetJid]
                });
                return;
            }

            // Calculate success chance based on agility vs target's intelligence/agility
            const successChance = 0.3 + (user.agility * 0.03) - (Math.random() * 0.2);
            const guardedChance = (target.intelligence * 0.02) + (target.agility * 0.01);

            user.lastrobbery = currentTime; // Apply cooldown

            if (Math.random() < guardedChance) {
                // Target had protection
                user.health -= 15;
                if (user.health < 1) user.health = 1;
                await conn.reply(m.chat, `🚨 *¡ROBO FALLIDO!* 🚨\n\n@${targetJid.split('@')[0]} tenía protección. Has sido herido durante el intento de robo y perdiste 15 de salud.`, m, {
                    mentions: [targetJid]
                });
            } else if (Math.random() < successChance) {
                // Successful robbery
                let stolenAmount = Math.floor(target.gold * (Math.random() * 0.3 + 0.1)); // Between 10% and 40%
                if (stolenAmount < 10) stolenAmount = 10; // Minimum stolen amount
                 if (stolenAmount > target.gold) stolenAmount = target.gold; // Cannot steal more than they have

                user.gold += stolenAmount;
                target.gold -= stolenAmount;
                user.reputation -= 5; // Lose reputation

                await conn.reply(m.chat, `💰 *¡ROBO EXITOSO!* 💰\n\nHas robado ${stolenAmount} de oro a @${targetJid.split('@')[0]}.\n\n⚠️ Tu reputación ha disminuido por esta acción.`, m, {
                    mentions: [targetJid]
                });
            } else {
                // Failed robbery
                const penaltyGold = Math.floor(user.gold * 0.05); // Lose 5% of own gold
                user.gold -= penaltyGold;
                 if (user.gold < 0) user.gold = 0;
                user.health -= 10;
                if (user.health < 1) user.health = 1;

                await conn.reply(m.chat, `🚔 *¡ROBO FALLIDO!* 🚔\n\nHas sido sorprendido intentando robar a @${targetJid.split('@')[0]}. Pierdes ${penaltyGold} de oro y 10 de salud por el forcejeo.`, m, {
                    mentions: [targetJid]
                });
            }
            break;

        case 'marry':
        case 'casar':
            if (!m.mentionedJid || m.mentionedJid.length === 0) {
                await conn.reply(m.chat, `💍 Debes especificar a quién quieres proponer matrimonio.\n\nEjemplo: ${usedPrefix}rpg marry @usuario`, m);
                return;
            }
            if (user.marriage) {
                const partnerName = db.users[user.marriage]?.name || 'alguien';
                await conn.reply(m.chat, `💔 Ya estás casado/a con ${partnerName}. Primero debes divorciarte con ${usedPrefix}rpg divorce.`, m);
                return;
            }
             if (currentTime - user.lastmarriage < COOLDOWN_MARRIAGE_ACTION) {
                const timeLeft = COOLDOWN_MARRIAGE_ACTION - (currentTime - user.lastmarriage);
                await conn.reply(m.chat, `⏱️ Debes esperar ${formatCooldownTime(timeLeft)} antes de realizar otra acción de matrimonio.`, m);
                return;
            }


            const proposedJid = m.mentionedJid[0];
            if (proposedJid === m.sender) {
                await conn.reply(m.chat, `😅 No puedes casarte contigo mismo.`, m);
                return;
            }

             // Ensure proposed exists in DB (create if not)
             if (!db.users[proposedJid]) {
                 db.users[proposedJid] = getDefaultUserData(proposedJid, conn.getName(proposedJid) || `Usuario_${proposedJid.split('@')[0]}`);
            }
            const proposed = db.users[proposedJid];

            if (proposed.marriage) {
                const partnerName = db.users[proposed.marriage]?.name || 'alguien más';
                await conn.reply(m.chat, `💔 @${proposedJid.split('@')[0]} ya está casado/a con ${partnerName}.`, m, {
                    mentions: [proposedJid]
                });
                return;
            }

            // Simulate sending a proposal message (actual acceptance logic would be more complex)
            await conn.reply(m.chat, `💍 *¡PROPUESTA DE MATRIMONIO!* 💍\n\n@${m.sender.split('@')[0]} ha propuesto matrimonio a @${proposedJid.split('@')[0]}.\n\n@${proposedJid.split('@')[0]} tienes 60 segundos para aceptar escribiendo *"acepto"*.`, m, {
                mentions: [m.sender, proposedJid]
            });

            // In a real bot, you would store this proposal (e.g., in a temporary object or DB field)
            // and set up a listener for the proposed's "acepto" message within the timeout.
            // If accepted, you would update both users' 'marriage' field.
            // For this simulation, we just apply the cooldown to the proposer.
            user.lastmarriage = currentTime;

            break;

        case 'divorce':
        case 'divorciar':
            if (!user.marriage) {
                await conn.reply(m.chat, `😐 No estás casado/a con nadie.`, m);
                return;
            }
             if (currentTime - user.lastmarriage < COOLDOWN_MARRIAGE_ACTION) {
                const timeLeft = COOLDOWN_MARRIAGE_ACTION - (currentTime - user.lastmarriage);
                await conn.reply(m.chat, `⏱️ Debes esperar ${formatCooldownTime(timeLeft)} antes de realizar otra acción de matrimonio.`, m);
                return;
            }

            const exPartnerJid = user.marriage;
            if (db.users[exPartnerJid]) {
                db.users[exPartnerJid].marriage = ''; // Clear partner's marriage status
            }
            user.marriage = ''; // Clear user's marriage status
            user.lastmarriage = currentTime; // Apply cooldown

            await conn.reply(m.chat, `💔 *¡DIVORCIO COMPLETADO!* 💔\n\nHas terminado tu matrimonio. Ahora eres oficialmente soltero/a de nuevo.`, m);
            break;

        case 'love':
        case 'pareja':
        case 'buscarpareja':
            if (user.marriage) {
                const partnerName = db.users[user.marriage]?.name || 'alguien';
                await conn.reply(m.chat, `💞 Ya estás en una relación con ${partnerName} (@${user.marriage.split('@')[0]}).`, m, { mentions: [user.marriage] });
                return;
            }

            // Find available users (not married, not self)
            const availableUsers = Object.keys(db.users).filter(jid =>
                db.users[jid] && !db.users[jid].marriage && jid !== m.sender
            );

            if (availableUsers.length === 0) {
                await conn.reply(m.chat, `😢 No hay personas solteras disponibles en este momento... Inténtalo más tarde.`, m);
                return;
            }

            // Choose a random partner
            const partnerJid = availableUsers[Math.floor(Math.random() * availableUsers.length)];
            user.marriage = partnerJid;
            db.users[partnerJid].marriage = m.sender;

            await conn.reply(m.chat, `
💘 *¡FELICIDADES!* 💘

@${m.sender.split('@')[0]} y @${partnerJid.split('@')[0]} ahora son pareja oficialmente.

✨ El amor ha triunfado en el mundo RPG...
`, m, {
                mentions: [m.sender, partnerJid]
            });
            break;

        case 'social':
        case 'socializar':
        case 'amigos':
             if (currentTime - user.lastsocial < SOCIAL_COOLDOWN) {
                const timeLeft = SOCIAL_COOLDOWN - (currentTime - user.lastsocial);
                await conn.reply(m.chat, `⏱️ Necesitas un respiro social. Vuelve a interactuar en ${formatCooldownTime(timeLeft)}.`, m);
                return;
            }

            const personas = [
                { nombre: 'Carlos el Amargado', frase: '😒 Mira mira... *como tú papaaaaa...*', tipo: 'enemigo' },
                { nombre: 'Lina la Dulce', frase: '🌸 ¡Hola! Me encanta hablar contigo. Eres genial.', tipo: 'amigo' },
                { nombre: 'Ricky el Fiestero', frase: '🍻 ¡Vamos de fiesta! ¡Tú invitas! JAJA', tipo: 'amigo' },
                { nombre: 'Karen la Chismosa', frase: '👀 Te vi con alguien ayer... ¿ehhh? *Cuentaaa*', tipo: 'neutra' },
                { nombre: 'Doña Lucha', frase: '🥴 A mí no me hables si no traes pan.', tipo: 'enemigo' },
                { nombre: 'Lucía la Romántica', frase: '💖 Me haces sentir mariposas... o hambre, no sé.', tipo: 'amigo' },
                { nombre: 'Pedro el Traicionero', frase: '😈 *Te usé...* ahora ya no te necesito.', tipo: 'enemigo' },
                { nombre: 'Julián el Loco', frase: '🤣 JAJA ¿Tú también escuchas voces o solo yo?', tipo: 'neutra' },
                { nombre: 'Alexa la Sabia', frase: '📚 Hoy es un buen día para aprender algo nuevo.', tipo: 'amigo' },
            ];
            const persona = personas[Math.floor(Math.random() * personas.length)];
            const reacciones = { amigo: '🤝', enemigo: '💢', neutra: '🤷' };

            user.lastsocial = currentTime; // Apply cooldown

            await conn.reply(m.chat, `
🎭 *INTERACCIÓN SOCIAL* 🎭

Has conversado con: *${persona.nombre}*
${reacciones[persona.tipo]} _${persona.frase}_

${persona.tipo === 'enemigo' ? '\n💔 Parece que esta persona no fue buena compañía...' : ''}
`, m);
            break;


        case 'buyhouse':
        case 'comprarcasa':
            const housePrice = user.house ? (user.house * 5000) + 5000 : 5000; // Price increases, starts at 5k
            if (user.gold < housePrice) {
                await conn.reply(m.chat, `💰 No tienes suficiente oro. Necesitas ${housePrice} de oro para ${user.house ? 'mejorar tu casa al nivel ' + (user.house + 1) : 'comprar una casa'}.`, m);
                return;
            }

            user.gold -= housePrice;
            if (!user.house) {
                user.house = 1;
                await conn.reply(m.chat, `🏠 *¡CASA COMPRADA!* 🏠\n\nHas adquirido tu primera casa por ${housePrice} de oro. Ahora tienes un lugar para vivir y descansar.`, m);
            } else {
                user.house += 1;
                await conn.reply(m.chat, `🏡 *¡CASA MEJORADA!* 🏡\n\nHas mejorado tu casa al nivel ${user.house} por ${housePrice} de oro. Tu hogar ahora es más grande y confortable.`, m);
            }
            break;

        case 'buyfarm':
        case 'comprargranja':
            const farmPrice = user.farm ? (user.farm * 8000) + 10000 : 10000; // Price increases, starts at 10k
            if (user.gold < farmPrice) {
                await conn.reply(m.chat, `💰 No tienes suficiente oro. Necesitas ${farmPrice} de oro para ${user.farm ? 'mejorar tu granja al nivel ' + (user.farm + 1) : 'comprar una granja'}.`, m);
                return;
            }
            if (user.house < 1) {
                await conn.reply(m.chat, `🏠 Primero necesitas tener una casa antes de adquirir una granja. Compra una casa con ${usedPrefix}rpg buyhouse.`, m);
                return;
            }

            user.gold -= farmPrice;
            if (!user.farm) {
                user.farm = 1;
                await conn.reply(m.chat, `🌾 *¡GRANJA COMPRADA!* 🌾\n\nHas adquirido tu primera granja por ${farmPrice} de oro. Ahora puedes cultivar y cosechar recursos.`, m);
            } else {
                user.farm += 1;
                await conn.reply(m.chat, `🚜 *¡GRANJA MEJORADA!* 🚜\n\nHas mejorado tu granja al nivel ${user.farm} por ${farmPrice} de oro. Podrás producir más cultivos y obtener mejores cosechas.`, m);
            }
            break;

        case 'pet':
        case 'mascota':
        case 'petstats':
            if (!user.pet) {
                await conn.reply(m.chat, `🐾 No tienes ninguna mascota. Adopta una con ${usedPrefix}rpg petadopt [tipo].`, m);
                return;
            }

            const petTypes = ['🐶 Perro', '🐱 Gato', '🦊 Zorro', '🐰 Conejo', '🦜 Loro', '🐉 Dragoncito'];
            const petName = user.petName || petTypes[user.pet - 1];
            const petStatsText = `
╔═══════════════════
║ 🐾 𝐒𝐔 𝐌𝐀𝐒𝐂𝐎𝐓𝐀 🐾
╠═══════════════════
║ 📛 *Nombre:* ${petName}
║ 🏆 *Nivel:* ${user.petLevel}
║ ✨ *Experiencia:* ${user.petExp}
║ ❤️ *Cariño:* ${Math.min(100, Math.floor(user.petExp / 10))}%
╠═══════════════════
║ 💡 *Comandos de mascota:*
║ • ${usedPrefix}rpg petfeed - Alimentar
║ • ${usedPrefix}rpg petadventure - Aventura
║ • ${usedPrefix}rpg petname [nombre] (No implementado)
╚═══════════════════
`;
            await conn.reply(m.chat, petStatsText, m);
            break;

        case 'petadopt':
        case 'adoptarmascota':
            if (user.pet) {
                await conn.reply(m.chat, `🐾 Ya tienes una mascota. Solo puedes tener una a la vez.`, m);
                return;
            }
            if (!args[1]) {
                const petTypesList = [
                   '1. 🐶 Perro - Leal y enérgico',
                   '2. 🐱 Gato - Independiente y astuto',
                   '3. 🦊 Zorro - Inteligente y curioso',
                   '4. 🐰 Conejo - Ágil y adorable',
                   '5. 🦜 Loro - Parlanchín y colorido',
                   '6. 🐉 Dragoncito - Exótico y poderoso'
                ];
                await conn.reply(m.chat, `🐾 *ADOPCIÓN DE MASCOTAS* 🐾\n\nElige qué tipo de mascota quieres adoptar:\n\n${petTypesList.map(item => `• ${item}`).join('\n')}\n\nUsa ${usedPrefix}rpg petadopt [número] para adoptar.`, m);
                return;
            }

            const petChoice = parseInt(args[1]);
            if (isNaN(petChoice) || petChoice < 1 || petChoice > 6) {
                await conn.reply(m.chat, `🐾 Opción inválida. Elige un número entre 1 y 6.`, m);
                return;
            }

            const petCosts = [2000, 2000, 3000, 1500, 4000, 10000];
            const petCost = petCosts[petChoice - 1];

            if (user.gold < petCost) {
                await conn.reply(m.chat, `💰 No tienes suficiente oro. Necesitas ${petCost} de oro para adoptar esta mascota.`, m);
                return;
            }

            user.gold -= petCost;
            user.pet = petChoice;
            user.petExp = 0;
            user.petLevel = 1;
            user.petName = ['Perrito', 'Gatito', 'Zorrito', 'Conejito', 'Lorito', 'Dragoncito'][petChoice - 1];

            const petTypesDisplay = ['🐶 Perro', '🐱 Gato', '🦊 Zorro', '🐰 Conejo', '🦜 Loro', '🐉 Dragoncito'];
            await conn.reply(m.chat, `🐾 *¡MASCOTA ADOPTADA!* 🐾\n\nHas adoptado un ${petTypesDisplay[petChoice - 1]} por ${petCost} de oro.\n\nPuedes ponerle un nombre usando ${usedPrefix}rpg petname [nombre] (No implementado).`, m);
            break;

        case 'petfeed':
        case 'alimentarmascota':
            if (!user.pet) {
                await conn.reply(m.chat, `🐾 No tienes ninguna mascota. Adopta una con ${usedPrefix}rpg petadopt [tipo].`, m);
                return;
            }
            if (user.food < 2) {
                await conn.reply(m.chat, `🍖 No tienes suficiente comida para alimentar a tu mascota. Necesitas al menos 2 unidades de comida.`, m);
                return;
            }
             if (currentTime - (user.lastpetfeed || 0) < COOLDOWN_FARMING) { // Using farming cooldown for pet feed as a placeholder
                const timeLeft = COOLDOWN_FARMING - (currentTime - (user.lastpetfeed || 0));
                await conn.reply(m.chat, `⏱️ Tu mascota no tiene hambre aún. Podrás alimentarla de nuevo en ${formatCooldownTime(timeLeft)}.`, m);
                return;
            }


            user.food -= 2;
            user.petExp += 15;
            user.lastpetfeed = currentTime; // Apply cooldown

            // Level up pet
            const xpNeededForPetLevel = user.petLevel * 100;
            if (user.petExp >= xpNeededForPetLevel) {
                user.petLevel += 1;
                user.petExp = 0; // Reset exp on level up (matching JS example)
                await conn.reply(m.chat, `🐾 *¡TU MASCOTA HA SUBIDO DE NIVEL!* 🐾\n\n${user.petName} ha alcanzado el nivel ${user.petLevel}. Se ve más fuerte y feliz.`, m);
            } else {
                await conn.reply(m.chat, `🍖 Has alimentado a ${user.petName}. Se ve más feliz y ha ganado 15 puntos de experiencia.`, m);
            }
            break;

        case 'petadventure':
        case 'aventuramascota':
            if (!user.pet) {
                await conn.reply(m.chat, `🐾 No tienes ninguna mascota. Adopta una con ${usedPrefix}rpg petadopt [tipo].`, m);
                return;
            }
            if (user.petLevel < 3) {
                await conn.reply(m.chat, `🐾 Tu mascota es demasiado pequeña para aventurarse. Necesita alcanzar al menos el nivel 3.`, m);
                return;
            }
             if (currentTime - (user.lastpetadventure || 0) < COOLDOWN_ADVENTURE) { // Using adventure cooldown for pet adventure
                const timeLeft = COOLDOWN_ADVENTURE - (currentTime - (user.lastpetadventure || 0));
                await conn.reply(m.chat, `🐾 ${user.petName} está cansado de su última aventura. Podrá aventurarse de nuevo en ${formatCooldownTime(timeLeft)}.`, m);
                return;
            }

            const petAdventureSuccess = Math.random();
            let petAdventureText = `🌳 *${user.petName} se aventura en el bosque...*\n\n`;
            const petRewards = [];

            if (petAdventureSuccess < 0.2) {
                petAdventureText += `🌟 *¡HALLAZGO INCREÍBLE!* Tu mascota ha encontrado un tesoro escondido.`;
                const goldFound = Math.floor(Math.random() * 300) + 200;
                const expGained = 50;
                const petExpGained = 50;

                user.gold += goldFound;
                user.exp += expGained;
                user.petExp += petExpGained;

                petRewards.push(`💰 ${goldFound} Oro`);
                petRewards.push(`✨ ${expGained} EXP para ti`);
                petRewards.push(`🐾 ${petExpGained} EXP para ${user.petName}`);

                if (Math.random() < 0.3) {
                    petRewards.push(`💎 1 Diamante`);
                    user.diamond += 1;
                }

            } else if (petAdventureSuccess < 0.6) {
                petAdventureText += `🍖 Tu mascota ha cazado algunas presas en el bosque.`;
                const foodFound = Math.floor(Math.random() * 4) + 2;
                const expGained = 30;
                const petExpGained = 30;

                user.food += foodFound;
                user.exp += expGained;
                user.petExp += petExpGained;

                petRewards.push(`🍖 ${foodFound} Alimentos`);
                petRewards.push(`✨ ${expGained} EXP para ti`);
                petRewards.push(`🐾 ${petExpGained} EXP para ${user.petName}`);
            } else {
                petAdventureText += `🌿 Tu mascota ha explorado y jugado, pero no ha encontrado nada especial.`;
                const expGained = 15;
                const petExpGained = 20;

                user.exp += expGained;
                user.petExp += petExpGained;

                petRewards.push(`✨ ${expGained} EXP para ti`);
                petRewards.push(`🐾 ${petExpGained} EXP para ${user.petName}`);
            }

            levelUpMessages.push(...addExperience(user, expGained)); // Player also gets EXP
            // Level up pet
            const xpNeededForPetLevel = user.petLevel * 100;
            if (user.petExp >= xpNeededForPetLevel) {
                user.petLevel += 1;
                user.petExp = 0; // Reset exp on level up
                petAdventureText += `\n\n🎉 *¡${user.petName} ha subido al nivel ${user.petLevel}!*`;
            }

            user.lastpetadventure = currentTime; // Apply cooldown

            const finalPetAdventureText = `
${petAdventureText}

*🎁 Recompensas obtenidas:*
${petRewards.map(item => `• ${item}`).join('\n') || 'Ninguno'}

🐾 Nivel de ${user.petName}: ${user.petLevel}
✨ EXP de mascota: ${user.petExp}/${user.petLevel * 100}
`;
            await conn.reply(m.chat, levelUpMessages.join('\n') + (levelUpMessages.length > 0 ? '\n\n' : '') + finalPetAdventureText, m);
            break;


        case 'createclan':
        case 'crearclan':
            if (user.clan) {
                await conn.reply(m.chat, `🛡️ Ya perteneces al clan "${user.clan}". Primero debes abandonarlo con ${usedPrefix}rpg leaveclan (No implementado).`, m);
                return;
            }
            if (args.length < 2) {
                await conn.reply(m.chat, `🛡️ Debes especificar un nombre para tu clan.\n\nEjemplo: ${usedPrefix}rpg createclan Lobos Salvajes`, m);
                return;
            }

            const clanName = args.slice(1).join(' ');
            if (clanName.length > 20) {
                await conn.reply(m.chat, `🛡️ El nombre del clan es demasiado largo. Máximo 20 caracteres.`, m);
                return;
            }

            const clanCost = 5000;
            if (user.gold < clanCost) {
                await conn.reply(m.chat, `💰 No tienes suficiente oro. Necesitas ${clanCost} de oro para crear un clan.`, m);
                return;
            }

            // Check if clan name already exists
            const clanExists = Object.values(db.clans).some(c => c.name.toLowerCase() === clanName.toLowerCase());
            if (clanExists) {
                await conn.reply(m.chat, `🛡️ Ya existe un clan con ese nombre. Elige otro nombre.`, m);
                return;
            }

            user.gold -= clanCost;
            user.clan = clanName;
            user.clanRank = 'líder';

            // Create clan data
            db.clans[clanName] = getDefaultClanData(clanName, m.sender);

            await conn.reply(m.chat, `🛡️ *¡CLAN CREADO!* 🛡️\n\nHas fundado el clan "${clanName}" por ${clanCost} de oro.\n\nAhora puedes invitar a otros jugadores a unirse con ${usedPrefix}rpg claninvite @usuario (No implementado).`, m);
            break;

        case 'territory':
        case 'territorio':
            if (!user.clan) {
                await conn.reply(m.chat, `🏞️ Necesitas pertenecer a un clan para interactuar con territorios. Únete a uno con ${usedPrefix}rpg joinclan [nombre] (No implementado) o crea el tuyo con ${usedPrefix}rpg createclan [nombre].`, m);
                return;
            }
            if (!db.clans[user.clan]) {
                 await conn.reply(m.chat, `⚠️ Ha ocurrido un error con los datos de tu clan. Por favor, contacta al administrador.`, m);
                 return;
            }

            const clan = db.clans[user.clan];

            if (!args[1]) {
                // Display territory info
                const territoryInfo = `
╔══════════════════════
║ 🏞️ 𝐓𝐄𝐑𝐑𝐈𝐓𝐎𝐑𝐈𝐎 𝐃𝐄𝐋 𝐂𝐋𝐀𝐍 🏞️
╠══════════════════════
║ 🛡️ *Clan:* ${clan.name}
║ 👑 *Líder:* ${db.users[clan.leader]?.name || 'Desconocido'}
║ 👥 *Miembros:* ${clan.members.length}
╠══════════════════════
║ 🗺️ *Territorio actual:* ${clan.territory || 'Ninguno'}
${clan.territory ? `║ 💰 *Ingresos diarios:* ${Math.floor(clan.level * 200)} de oro` : ''}
╠══════════════════════
║ 💡 *Comandos disponibles:*
║ • ${usedPrefix}rpg territory claim [nombre]
║ • ${usedPrefix}rpg territory upgrade
║ • ${usedPrefix}rpg territory info
╚══════════════════════
`;
                await conn.reply(m.chat, territoryInfo, m);
                return;
            }

            const territoryAction = args[1].toLowerCase();

            switch (territoryAction) {
                case 'claim':
                case 'reclamar':
                    if (clan.territory) {
                        await conn.reply(m.chat, `🏞️ Tu clan ya controla el territorio "${clan.territory}". Puedes mejorarlo con ${usedPrefix}rpg territory upgrade.`, m);
                        return;
                    }
                    if (user.clanRank !== 'líder') {
                        await conn.reply(m.chat, `👑 Solo el líder del clan puede reclamar territorios.`, m);
                        return;
                    }
                    const territoryCost = 2000;
                    if (clan.treasury < territoryCost) {
                        await conn.reply(m.chat, `💰 El tesoro del clan no tiene suficiente oro. Necesitan ${territoryCost} de oro para reclamar un territorio.`, m);
                        return;
                    }
                    if (args.length < 3) {
                        await conn.reply(m.chat, `🏞️ Debes especificar un nombre para tu territorio.\n\nEjemplo: ${usedPrefix}rpg territory claim Valle Esmeralda`, m);
                        return;
                    }
                    const territoryName = args.slice(2).join(' ');
                    if (territoryName.length > 25) {
                        await conn.reply(m.chat, `🏞️ El nombre del territorio es demasiado largo. Máximo 25 caracteres.`, m);
                        return;
                    }

                    // Check if territory is already claimed
                    const territoryTaken = Object.values(db.clans).some(c => c.territory?.toLowerCase() === territoryName.toLowerCase());
                    if (territoryTaken) {
                        await conn.reply(m.chat, `⚔️ Ese territorio ya está bajo el control de otro clan. Deberás desafiarlo para conquistarlo con ${usedPrefix}rpg clanwar [nombre del clan] (No implementado).`, m);
                        return;
                    }

                    clan.treasury -= territoryCost;
                    clan.territory = territoryName;
                    clan.lastTerritoryClaim = currentTime; // Apply cooldown

                    await conn.reply(m.chat, `🏞️ *¡TERRITORIO RECLAMADO!* 🏞️\n\nTu clan ha establecido control sobre "${territoryName}".\n\nAhora recibirán ingresos diarios de ${Math.floor(clan.level * 200)} de oro en el tesoro del clan.`, m);
                    break;

                case 'upgrade':
                case 'mejorar':
                    if (!clan.territory) {
                        await conn.reply(m.chat, `🏞️ Tu clan no controla ningún territorio. Primero deben reclamar uno con ${usedPrefix}rpg territory claim [nombre].`, m);
                        return;
                    }
                    if (user.clanRank !== 'líder' && user.clanRank !== 'oficial') {
                        await conn.reply(m.chat, `👑 Solo el líder y oficiales del clan pueden mejorar el territorio.`, m);
                        return;
                    }
                     if (currentTime - (clan.lastTerritoryUpgrade || 0) < DAILY_COOLDOWN) { // Using daily cooldown for upgrade as placeholder
                        const timeLeft = DAILY_COOLDOWN - (currentTime - (clan.lastTerritoryUpgrade || 0));
                        await conn.reply(m.chat, `⏱️ El territorio aún se está fortificando. Podrán mejorarlo de nuevo en ${formatCooldownTime(timeLeft)}.`, m);
                        return;
                    }

                    const upgradeCost = clan.level * 1500;
                    if (clan.treasury < upgradeCost) {
                        await conn.reply(m.chat, `💰 El tesoro del clan no tiene suficiente oro. Necesitan ${upgradeCost} de oro para mejorar el territorio.`, m);
                        return;
                    }

                    clan.treasury -= upgradeCost;
                    clan.level += 1;
                    clan.lastTerritoryUpgrade = currentTime; // Apply cooldown

                    await conn.reply(m.chat, `🏞️ *¡TERRITORIO MEJORADO!* 🏞️\n\nHan invertido en la mejora de "${clan.territory}".\n\nNivel del clan: ${clan.level}\nIngresos diarios actualizados: ${Math.floor(clan.level * 200)} de oro`, m);
                    break;

                case 'info':
                case 'información':
                    if (!clan.territory) {
                        await conn.reply(m.chat, `🏞️ Tu clan no controla ningún territorio. Primero deben reclamar uno con ${usedPrefix}rpg territory claim [nombre].`, m);
                        return;
                    }
                    const territoryInfoDetailed = `
╔══════════════════════
║ 🏞️ 𝐓𝐄𝐑𝐑𝐈𝐓𝐎𝐑𝐈𝐎 "${clan.territory}" 🏞️
╠══════════════════════
║ 🛡️ *Controlado por:* ${clan.name}
║ 👑 *Administrado por:* ${db.users[clan.leader]?.name || 'Desconocido'}
║ 🏆 *Nivel del clan:* ${clan.level}
║ 💰 *Tesoro del clan:* ${clan.treasury} de oro
╠══════════════════════
║ 📊 *BENEFICIOS DIARIOS*
║ 💰 *Ingresos:* ${Math.floor(clan.level * 200)} de oro
║ 🧪 *Bonificaciones de recursos:* +${clan.level * 5}% (Note: Bonus not implemented in gathering commands yet)
╠══════════════════════
║ 🔄 *Próxima mejora:* ${clan.level * 1500} de oro
╚══════════════════════
`;
                    await conn.reply(m.chat, territoryInfoDetailed, m);
                    break;

                default:
                    await conn.reply(m.chat, `🏞️ Acción de territorio no reconocida. Opciones disponibles:\n• ${usedPrefix}rpg territory claim [nombre]\n• ${usedPrefix}rpg territory upgrade\n• ${usedPrefix}rpg territory info`, m);
            }
            break;

        case 'quest':
        case 'misión':
        case 'mision':
            if (!user.activeQuest) {
                // Generate a new quest
                const questTypes = [
                    { type: 'hunt', name: 'Caza de Bestias', target: Math.floor(Math.random() * 3) + 3, reward: { gold: 500, exp: 300 } }, // Target 3-5
                    { type: 'mine', name: 'Excavación Profunda', target: Math.floor(Math.random() * 4) + 5, reward: { gold: 400, exp: 350 } }, // Target 5-8
                    { type: 'farm', name: 'Cosecha Abundante', target: Math.floor(Math.random() * 3) + 4, reward: { gold: 350, exp: 250 } }, // Target 4-6
                    // Craft and adventure quests are more complex to track directly
                    // { type: 'craft', name: 'Artesanía Fina', target: Math.floor(Math.random() * 2) + 2, reward: { gold: 600, exp: 400 } }, // Target 2-3
                    // { type: 'adventure', name: 'Exploración Peligrosa', target: Math.floor(Math.random() * 3) + 1, reward: { gold: 700, exp: 500 } } // Target 1-3
                ];

                const randomQuest = questTypes[Math.floor(Math.random() * questTypes.length)];
                user.activeQuest = randomQuest;
                user.questProgress = 0;

                const questText = `
╔══════════════════════
║ 📜 𝐍𝐔𝐄𝐕𝐀 𝐌𝐈𝐒𝐈Ó𝐍 📜
╠══════════════════════
║ 🔍 *Misión:* ${randomQuest.name}
║ 📋 *Objetivo:* ${randomQuest.type === 'hunt' ? 'Cazar' :
                   randomQuest.type === 'mine' ? 'Minar' :
                   randomQuest.type === 'farm' ? 'Cultivar' : 'Completar'}
            ${randomQuest.target} ${randomQuest.type === 'hunt' ? 'presas' :
                                  randomQuest.type === 'mine' ? 'minerales' :
                                  randomQuest.type === 'farm' ? 'cosechas' : 'acciones'}
╠══════════════════════
║ 🎁 *RECOMPENSAS:*
║ 💰 ${randomQuest.reward.gold} Oro
║ ✨ ${randomQuest.reward.exp} EXP
╠══════════════════════
║ 📊 *Progreso:* ${user.questProgress}/${randomQuest.target}
╚══════════════════════
`;
                await conn.reply(m.chat, questText, m);

            } else {
                // Show active quest progress
                const quest = user.activeQuest;
                const questText = `
╔══════════════════════
║ 📜 𝐌𝐈𝐒𝐈Ó𝐍 𝐀𝐂𝐓𝐈𝐕𝐀 📜
╠══════════════════════
║ 🔍 *Misión:* ${quest.name}
║ 📋 *Objetivo:* ${quest.type === 'hunt' ? 'Cazar' :
                   quest.type === 'mine' ? 'Minar' :
                   quest.type === 'farm' ? 'Cultivar' : 'Completar'}
            ${quest.target} ${quest.type === 'hunt' ? 'presas' :
                                       quest.type === 'mine' ? 'minerales' :
                                       quest.type === 'farm' ? 'cosechas' : 'acciones'}
╠══════════════════════
║ 🎁 *RECOMPENSAS:*
║ 💰 ${quest.reward.gold} Oro
║ ✨ ${quest.reward.exp} EXP
╠══════════════════════
║ 📊 *Progreso:* ${user.questProgress}/${quest.target}
${user.questProgress >= quest.target ? '✅ *¡COMPLETADA! Reclama tu recompensa*' : ''}
╚══════════════════════
`;

                if (user.questProgress >= quest.target && args[1]?.toLowerCase() === 'claim') {
                    // Reclaim reward
                    user.gold += quest.reward.gold;
                    const expGained = quest.reward.exp;
                    levelUpMessages.push(...addExperience(user, expGained));

                    const rewardText = `
╔══════════════════════
║ 🎉 𝐌𝐈𝐒𝐈Ó𝐍 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀𝐃𝐀 🎉
╠══════════════════════
║ 🔍 *Misión:* ${quest.name}
╠══════════════════════
║ 🎁 *RECOMPENSAS RECIBIDAS:*
║ 💰 ${quest.reward.gold} Oro
║ ✨ ${expGained} EXP
╚══════════════════════
`;
                    user.activeQuest = null;
                    user.questProgress = 0;

                    await conn.reply(m.chat, levelUpMessages.join('\n') + (levelUpMessages.length > 0 ? '\n\n' : '') + rewardText, m);

                } else if (user.questProgress >= quest.target) {
                    await conn.reply(m.chat, `${questText}\n\nUsa ${usedPrefix}rpg quest claim para reclamar tu recompensa.`, m);
                } else {
                    await conn.reply(m.chat, questText, m);
                }
            }
            break;

        case 'daily':
        case 'diaria':
            if (currentTime - user.lastclaim < DAILY_COOLDOWN) {
                const timeLeft = DAILY_COOLDOWN - (currentTime - user.lastclaim);
                 const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                 const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

                await conn.reply(m.chat, `⏱️ Ya has reclamado tu recompensa diaria. Vuelve en ${hours} horas y ${minutes} minutos.`, m);
                return;
            }

            // Daily rewards
            const dailyRewards = {
                gold: 500 + (user.level * 50),
                exp: 300 + (user.level * 30),
                potion: 2,
                food: 3,
                seeds: Math.floor(Math.random() * 5) + 1
            };

            // Update user data
            user.gold += dailyRewards.gold;
            const expGained = dailyRewards.exp;
            levelUpMessages.push(...addExperience(user, expGained));
            user.potion += dailyRewards.potion;
            user.food += dailyRewards.food;
            user.seeds += dailyRewards.seeds;
            user.lastclaim = currentTime;

            const dailyText = `
╔══════════════════════
║ 🎁 𝐑𝐄𝐂𝐎𝐌𝐏𝐄𝐍𝐒𝐀 𝐃𝐈𝐀𝐑𝐈𝐀 🎁
╠══════════════════════
║ 📆 *Fecha:* ${new Date().toLocaleDateString()}
╠══════════════════════
║ 💰 ${dailyRewards.gold} Oro
║ ✨ ${expGained} EXP
║ 🧪 ${dailyRewards.potion} Pociones
║ 🍖 ${dailyRewards.food} Alimentos
║ 🌱 ${dailyRewards.seeds} Semillas
╠══════════════════════
║ 📊 *Estadísticas actuales:*
║ 💰 ${user.gold} Oro total
║ 🏅 Nivel: ${user.level}
╚══════════════════════
`;
            await conn.reply(m.chat, levelUpMessages.join('\n') + (levelUpMessages.length > 0 ? '\n\n' : '') + dailyText, m);
            break;


        case 'shop':
        case 'tienda':
            const shopText = `
╔══════════════════════
║ 🛒 𝐓𝐈𝐄𝐍𝐃𝐀 𝐑𝐏𝐆 🛒
╠══════════════════════
║ 📋 *ARTÍCULOS DISPONIBLES:*
║
║ 🧪 *Poción* - 150 Oro
║ Recupera 25 de salud y 15 de energía
║
║ 🍖 *Alimento* - 100 Oro
║ Necesario para alimentar mascotas
║
║ 🌱 *Semillas* - 50 Oro
║ Para cultivar en tu granja
║
║ ⛏️ *Pico* - 800 Oro
║ Herramienta necesaria para minar
║
║ 🪓 *Hacha* - 750 Oro
║ Permite talar árboles eficientemente
║
║ 🎣 *Caña de pescar* - 650 Oro
║ Para pescar en ríos y lagos
║
║ 🗡️ *Espada* - 1500 Oro
║ Mejora tus habilidades de combate
║
║ 🛡️ *Armadura* - 2000 Oro
║ Protección contra daños
╠══════════════════════
║ 💡 *COMANDOS:*
║ • ${usedPrefix}rpg buy [artículo] [cantidad]
║ • ${usedPrefix}rpg sell [recurso] [cantidad]
╚══════════════════════
`;
            await conn.reply(m.chat, shopText, m);
            break;

        case 'buy':
        case 'comprar':
            if (args.length < 2) {
                await conn.reply(m.chat, `🛒 Debes especificar qué quieres comprar.\n\nEjemplo: ${usedPrefix}rpg buy pocion 2`, m);
                return;
            }
            const itemToBuy = args[1].toLowerCase();
            const quantityToBuy = parseInt(args[2]) || 1;

            if (quantityToBuy < 1) {
                await conn.reply(m.chat, `📊 La cantidad debe ser al menos 1.`, m);
                return;
            }

            const prices = {
                'pocion': 150, 'poción': 150,
                'alimento': 100, 'comida': 100,
                'semillas': 50, 'semilla': 50,
                'pico': 800,
                'hacha': 750,
                'caña': 650, 'cañadepescar': 650,
                'espada': 1500,
                'armadura': 2000
            };

            if (!prices[itemToBuy]) {
                await conn.reply(m.chat, `🛒 Artículo '${itemToBuy}' no encontrado en la tienda. Usa ${usedPrefix}rpg shop para ver los disponibles.`, m);
                return;
            }

            const totalCost = prices[itemToBuy] * quantityToBuy;
            if (user.gold < totalCost) {
                await conn.reply(m.chat, `💰 No tienes suficiente oro. Necesitas ${totalCost} oro para comprar ${quantityToBuy} ${itemToBuy}(s).`, m);
                return;
            }

            // Process purchase
            user.gold -= totalCost;

            switch (itemToBuy) {
                case 'pocion':
                case 'poción':
                    user.potion += quantityToBuy;
                    break;
                case 'alimento':
                case 'comida':
                    user.food += quantityToBuy;
                    break;
                case 'semillas':
                case 'semilla':
                    user.seeds += quantityToBuy;
                    break;
                case 'pico':
                    user.pickaxe += quantityToBuy;
                    break;
                case 'hacha':
                    user.axe += quantityToBuy;
                    break;
                case 'caña':
                case 'cañadepescar':
                    user.fishingrod += quantityToBuy;
                    break;
                case 'espada':
                    user.weapon += quantityToBuy;
                    break;
                case 'armadura':
                    user.armor += quantityToBuy;
                    break;
            }

            await conn.reply(m.chat, `🛍️ *¡COMPRA EXITOSA!*\n\nHas comprado ${quantityToBuy} ${itemToBuy}(s) por ${totalCost} oro.`, m);
            break;

        case 'sell':
        case 'vender':
            if (args.length < 2) {
                await conn.reply(m.chat, `💰 Debes especificar qué quieres vender.\n\nEjemplo: ${usedPrefix}rpg sell piedra 10`, m);
                return;
            }
            const resourceToSell = args[1].toLowerCase();
            const amountToSell = parseInt(args[2]) || 1;

            if (amountToSell < 1) {
                await conn.reply(m.chat, `📊 La cantidad debe ser al menos 1.`, m);
                return;
            }

            const sellPrices = {
                'piedra': 10, 'hierro': 25, 'madera': 15,
                'cuero': 30, 'cuerda': 15,
                'cultivo': 40, 'cultivos': 40,
                'hierba': 20, 'hierbas': 20,
                'diamante': 750, 'diamantes': 750,
                'esmeralda': 500, 'esmeraldas': 500,
                'rubi': 600, 'rubí': 600, 'rubies': 600, 'rubíes': 600
            };

            if (!sellPrices[resourceToSell]) {
                await conn.reply(m.chat, `🛒 Recurso '${resourceToSell}' no válido para vender. Recursos vendibles: piedra, hierro, madera, cuero, cuerda, cultivos, hierbas, diamante, esmeralda, rubí.`, m);
                return;
            }

            // Check if player has enough resources and deduct
            let hasEnough = false;
            let resourceKey = resourceToSell; // Assume singular key by default
            if (resourceToSell === 'cultivos') resourceKey = 'crops';
            else if (resourceToSell === 'hierbas') resourceKey = 'herb'; // JS used 'herb' for plural too?
            else if (resourceToSell === 'diamantes') resourceKey = 'diamond';
            else if (resourceToSell === 'esmeraldas') resourceKey = 'emerald';
            else if (resourceToSell === 'rubies' || resourceToSell === 'rubíes') resourceKey = 'ruby';


            if (user[resourceKey] !== undefined && user[resourceKey] >= amountToSell) {
                 hasEnough = true;
                 user[resourceKey] -= amountToSell;
            } else if (resourceKey === 'herb' && user['herbs'] !== undefined && user['herbs'] >= amountToSell) {
                 // Check for plural key if singular didn't work (based on JS example)
                 hasEnough = true;
                 user['herbs'] -= amountToSell;
            } else if (resourceKey === 'crops' && user['cultivos'] !== undefined && user['cultivos'] >= amountToSell) {
                 hasEnough = true;
                 user['cultivos'] -= amountToSell;
            }


            if (!hasEnough) {
                // Try to get the current amount for the message
                const currentAmount = user[resourceKey] !== undefined ? user[resourceKey] : (user[`${resourceKey}s`] !== undefined ? user[`${resourceKey}s`] : 0);
                await conn.reply(m.chat, `📊 No tienes suficiente ${resourceToSell}. Solo tienes ${currentAmount}.`, m);
                return;
            }

            // Calculate gold received
            const receivedGold = sellPrices[resourceToSell] * amountToSell;
            user.gold += receivedGold;

            await conn.reply(m.chat, `💰 *¡VENTA EXITOSA!*\n\nHas vendido ${amountToSell} ${resourceToSell}(s) por ${receivedGold} oro.`, m);
            break;


        case 'soporte':
        case 'contacto':
            await conn.reply(m.chat, `
╭━━━〔 *📞 SOPORTE TÉCNICO* 〕━━━⬣
┃
┃ *👤 Nombre:* SoyMaycol
┃ *📱 WhatsApp:* wa.me/51921826291
┃ *🌐 Disponibilidad:* 24/7 (consultas, ayuda, sugerencias)
┃
┃ *❓ ¿Problemas con el bot?*
┃     No dudes en escribirme directamente.
┃
╰━━━━━━━━━━━━━━━━━━━━⬣

📌 *RPG-Ultra V4 - Editado por:* _Wirk_
📌 *Perrita no Yūsha Hecho Por:* Wirk
`, m);
            break;


        // --- Unrecognized RPG Sub-command ---
        default:
            const helpTextDefault = `Comando RPG '${type}' no reconocido. Usa ${usedPrefix}rpg para ver los comandos disponibles.`;
            await conn.reply(m.chat, helpTextDefault, m);
    }

    // --- Save Database after processing a command ---
    saveDatabase(db);
};

// --- Export the handler function ---
// This assumes your bot framework expects a default export for command handlers
export default handler;

// --- Add handler properties (adjust based on your framework) ---
handler.help = ['rpg', 'rpg <comando>'];
handler.tags = ['fun']; // Or your relevant tag
handler.command = ['rpg']; // The main command to trigger this handler

// --- Optional: Add acepte/accept logic if your framework supports listening for specific messages ---
// This is a simplified example and needs to be integrated with your bot's message listener
/*
const handleAcceptMessage = async (m, { conn }) => {
    const db = loadDatabase();
    const user = db.users[m.sender];

    // Check if the user is currently involved in a pending duel or marriage proposal in this chat
    // This requires storing the pending proposals/challenges somewhere accessible (e.g., in db.groups or a temporary in-memory object)
    // For simplicity, this example doesn't store pending challenges globally.
    // You would need to add that logic in the 'duel' and 'marry' cases.

    // Example logic (requires pending challenges to be stored):
    // if (conn.duelChallenges && conn.duelChallenges[m.chat] && conn.duelChallenges[m.chat].challenged === m.sender) {
    //     // User accepted the duel
    //     const challengerJid = conn.duelChallenges[m.chat].challenger;
    //     // Implement duel logic here
    //     await conn.reply(m.chat, `@${m.sender.split('@')[0]} ha aceptado el duelo de @${challengerJid.split('@')[0]}! ¡Que comience la batalla!`, m, { mentions: [m.sender, challengerJid] });
    //     clearTimeout(conn.duelChallenges[m.chat].timeout);
    //     delete conn.duelChallenges[m.chat];
    //     // Save DB after duel logic
    //     saveDatabase(db);
    // } else if (conn.marriageProposals && conn.marriageProposals[m.chat] && conn.marriageProposals[m.chat].proposed === m.sender) {
    //      // User accepted the marriage proposal
    //      const proposerJid = conn.marriageProposals[m.chat].proposer;
    //      // Update marriage status for both users
    //      db.users[m.sender].marriage = proposerJid;
    //      db.users[proposerJid].marriage = m.sender;
    //      await conn.reply(m.chat, `💖 ¡Felicidades! @${m.sender.split('@')[0]} y @${proposerJid.split('@')[0]} se han casado!`, m, { mentions: [m.sender, proposerJid] });
    //      clearTimeout(conn.marriageProposals[m.chat].timeout);
    //      delete conn.marriageProposals[m.chat];
    //      // Save DB after marriage
    //      saveDatabase(db);
    // }
};

// You would need to register this handleAcceptMessage function with your bot's message listener
// to trigger when a user sends a message containing "acepto" or "acepte".
// Example (conceptual, depends on framework):
// conn.on('message', async m => {
//     if (m.text && m.text.toLowerCase().includes('acepto')) {
//         handleAcceptMessage(m, { conn });
//     }
// });
*/

