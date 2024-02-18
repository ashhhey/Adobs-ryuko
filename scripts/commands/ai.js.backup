const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "EDUCATION",
    usePrefix: false,
    commandCategory: "other",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const content = encodeURIComponent(args.join(" "));
    const apiUrl = `https://ai-chat-gpt-4-lite.onrender.com/api/hercai?question=${content}`;

    if (!content) return api.sendMessage("Please provide your question to search.", event.threadID, event.messageID);

    try {
        api.sendMessage("Please bear with me while I ponder your request...", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const  reply = response.data.reply;
                                 api.sendMessage(`${reply}\n\n𝖼𝗋𝖾𝖽𝗂𝗍𝗌: www.facebook.com/mark.dev69`, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};