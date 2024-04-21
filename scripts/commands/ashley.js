const axios = require('axios');

module.exports.config = {
    name: "ashley",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes", //API BY MARK
    description: "EDUCATIONAL",
    usePrefix: true,
    commandCategory: "ai",
    usages: "[question]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const content = args.join(' ');
    const apiUrl = `https://markdev69-51fd0d410a95.herokuapp.com/api/gpt4?query=${content}`;

    if (!content) return api.sendMessage("Please provide a question first.", event.threadID, event.messageID);

    try {
      api.sendMessage("𝘼𝙨𝙝𝙡𝙚𝙮𝙎𝙚𝙖𝙧𝙘𝙝𝙞𝙣𝙜...🔎", event.threadID, event.messageID);

        const response = await axios.get(apiUrl);
        const { Mark } = response.data;

        api.sendMessage(`𝗔𝗦𝗛𝗟𝗘𝗬 🙆‍♀️:\n\n${Mark}`, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
