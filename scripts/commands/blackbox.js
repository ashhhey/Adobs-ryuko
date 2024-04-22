const axios = require('axios');

module.exports.config = {
  name: "blackbox",
  version: "9",
  hasPermssion: 0,
  credits: "Eugene Aguilar",
  usePrefix: true,
  description: "ai powered by blackbox",
  commandCategory: "ai",
  cooldowns: 0,
};

module.exports.handleEvent = async function ({api, event}) {
  const lowerBody = event.body.toLowerCase();

  if (!(lowerBody.startsWith("blackbox") || lowerBody.startsWith("Blackbox"))) {
    return;
  }

  try {
    const args = event.body.split(/\s+/);
    args.shift();
    const ask = args.join(" ");

    if (!ask) {
      api.sendMessage(`Please enter a question.`, event.threadID, event.messageID);
      return;
    }

    api.sendMessage(`answering, please wait a minute...`, event.threadID, event.messageID);

    const response = await axios.get(`https://api.easy-api.online/api/blackbox?query=${ask}`);
    const ans = response.data.response;
    api.sendMessage(ans, event.threadID, event.messageID);
  } catch (e) {
    api.sendMessage(`Error fetching blackbox API!!\n${e}`, event.threadID, event.messageID);
  }
};

module.exports.run = async function ({api, event}) 
{};
