let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import fetch from 'node-fetch'
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'
import ws from 'ws'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isOwner, isROwner, isBotAdmin, participants, groupMetadata }) {
if (!m.messageStubType || !m.isGroup) return

const usuario = `@${m.sender.split`@`[0]}`
const groupName = (await conn.groupMetadata(m.chat)).subject
const groupAdmins = participants.filter((p) => p.admin)
const chat = global.db.data.chats[m.chat]
const mentionsString = [m.sender, m.messageStubParameters[0], ...groupAdmins.map((v) => v.id)]
const mentionsContentM = [m.sender, m.messageStubParameters[0]]
const vn = 'https://files.catbox.moe/6w3m3o.mp3'
const vn2 = 'https://files.catbox.moe/6w3m3o.mp3'

const getMentionedJid = () => {
return m.messageStubParameters.map(param => `${param}@s.whatsapp.net`)
}

let who = m.messageStubParameters[0] + '@s.whatsapp.net'
let user = global.db.data.users[who]
let userName = user ? user.name : await conn.getName(who)
let redes = `github.com/Ado926`
let adiosbye = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/fBuJM.jpg')
let adi = await (await fetch(adiosbye)).buffer()
let ppUrl = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/zliac.jpg');
let welc = await (await fetch(ppUrl)).buffer()
let admingp = `💣 @${m.messageStubParameters[0].split`@`[0]} ha sido promovido a Administrador por ${usuario}`
let noadmingp = `💣 @${m.messageStubParameters[0].split`@`[0]} ha sido degradado de Administrador por ${usuario}`

if (chat.detect && m.messageStubType == 2) {
const uniqid = (m.isGroup ? m.chat : m.sender).split('@')[0]
const sessionPath = './Sessions/'
for (const file of await fs.readdir(sessionPath)) {
if (file.includes(uniqid)) {
await fs.unlink(path.join(sessionPath, file))
console.log(`${chalk.yellow.bold('[ ⚠️ Archivo Eliminado ]')} ${chalk.greenBright(`'${file}'`)}\n` +
`${chalk.blue('(Session PreKey)')} ${chalk.redBright('que provoca el "undefined" en el chat')}`
)}}

} if (chat.detect && m.messageStubType == 29) {
await conn.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: null })
return

} if (chat.detect && m.messageStubType == 30) {
await conn.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: null })
return

if (chat.welcome && m.messageStubType === 27) {
    conn.sendMessage(m.chat, {
        audio: { url: vn },
        contextInfo: {
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelRD.id,
                serverMessageId: '',
                newsletterName: channelRD.name
            },
            forwardingScore: 9999999,
            isForwarded: true,
            mentionedJid: getMentionedJid(),
            externalAdReply: {
                title: `╭━━━✦ *ＭＡＩ ᴛᴇ ᴅᴀ ʟᴀ ʙɪᴇɴᴠᴇɴɪᴅᴀ* ✦━━━╮`,
                body: `¡Holii ${userName}!`,
                previewType: "PHOTO",
                thumbnailUrl: null,
                thumbnail: icons,
                sourceUrl: redes,
                showAdAttribution: true
            }
        },
        seconds: '455',
        ptt: true,
        mimetype: 'audio/mpeg',
        fileName: `bienvenida.mp3`
    }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 });

} else if (chat.welcome && (m.messageStubType === 28 || m.messageStubType === 32)) {
    conn.sendMessage(m.chat, {
        audio: { url: vn2 },
        contextInfo: {
            forwardedNewsletterMessageInfo: {
                newsletterJid: channelRD.id,
                serverMessageId: '',
                newsletterName: channelRD.name
            },
            forwardingScore: 9999999,
            isForwarded: true,
            mentionedJid: getMentionedJid(),
            externalAdReply: {
                title: `╭━━━✦ *ＭＡＩ ᴛᴇ ᴅɪᴄᴇ ᴀᴅɪᴏ́s* ✦━━━╮`,
                body: `${userName}, hasta pronto :(`,
                previewType: "PHOTO",
                thumbnailUrl: null,
                thumbnail: icons,
                sourceUrl: redes,
                showAdAttribution: true
            }
        },
        seconds: '455',
        ptt: true,
        mimetype: 'audio/mpeg',
        fileName: `bye.mp3`
    }, { quoted: m, ephemeralExpiration: 24 * 60 * 100, disappearingMessagesInChat: 24 * 60 * 100 });

} else {
    if (m.messageStubType == 2) return;
    console.log({
        messageStubType: m.messageStubType,
        messageStubParameters: m.messageStubParameters,
        type: WAMessageStubType[m.messageStubType],
    });
}

export default handler;