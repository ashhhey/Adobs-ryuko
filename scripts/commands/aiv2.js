const axios = require('axios');

module.exports.config = {
    name: "aiv2",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes", //API BY MARK
    description: "EDUCATIONAL",
    usePrefix: true,
    commandCategory: "AI",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const question = args.join(' ');
    const apiUrl = `https://markdevs-last-api.onrender.com/api/v3/gpt4?ask=${encodeURIComponent(question)}`;

    if (!question) return api.sendMessage("Please provide a question first.", event.threadID, event.messageID);

    try {
        api.sendMessage("Please bear with me while I ponder your request...", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const answer = response.data.answer;

        api.sendMessage(`📦𝗚𝗣𝗧4+ 𝗔𝗜\n━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${question}\n━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${answer}\n\ncredits: www.facebook.com/mark.dev69`, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
