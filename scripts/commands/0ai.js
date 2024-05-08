const {get} = require('axios');
const url = "https://markdevs-last-api.onrender.com";
module.exports = {
    config: {
       name: "ai",
       version: "1.0.0",
       hasPermission: 0,
       credits: "unknown",
       description: "OpenAI official AI with no prefix",
       commandCategory: "education",
       usePrefix: false,
       usages: "...",
       cooldowns: 0
    },
    run: async function({api, event, args}){
            let prompt = args.join(' '), id = event.senderID;
           async function r(msg){
                 api.sendMessage(msg, event.threadID, event.messageID)
             }
            if(!prompt) return r("Please provide a question first.");
            r("Please bear with me while I ponder your request...");
            try {
                const res = await get(url+"/gpt4?prompt="+prompt+"&uid="+id);
                const answer = res.data.gpt4;
                return r(`📦𝗚𝗣𝗧4+ 𝗖𝗢𝗡𝗧𝗜𝗡𝗨𝗘𝗦 𝗔𝗜\n━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${prompt}\n━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${answer}\n\ncredits: www.facebook.com/mark.dev69`);
            } catch (e){
                return r(e.message)
            }
    }
}
