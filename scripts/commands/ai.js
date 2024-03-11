/* 
If you encounter any errors, please give me feedback. Contact me on facebook https://facebook.com/joshg101
*/

const { get } = require('axios');
let url = "https://ai-tools.replit.app";

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  hasPermission: 0,
  credits: "unknown",
  description: "OpenAI official AI with no prefix",
  commandCategory: "education",
  usePrefix: true,
  usages: "...",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
    function sendMessage(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }
    if (!args[0]) return sendMessage('Please provide a question first.');
    const prompt = args.join(" ");
    try {
        api.sendMessage("Please bear with me while I ponder your request...", event.threadID, event.messageID);
        const response = await get(`${url}/gpt?prompt=${encodeURIComponent(prompt)}&uid=${event.senderID}`);
        const data = response.data;
        return sendMessage(`${data.gpt4}\n\ncredits: www.facebook.com/mark.dev69`);
    } catch (error) {
        return sendMessage(error.message);
    }
}
