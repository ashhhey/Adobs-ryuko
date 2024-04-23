const axios = require('axios');

module.exports.config = {
  name: "ipcheck",
  version: "7",
  hasPermssion: 2,
  credits: "Eugene Aguilar",
  description: "Check IP address information",
  usePrefix: true,
  commandCategory: "other",
  cooldowns: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const info = args.join(" ");
    if (!info) {
      api.sendMessage(`⚠️ | Please enter an IP address.`, event.threadID, event.messageID);
      return;
    }

    api.sendMessage(`Checking IP address...`, event.threadID, event.messageID);

    const response = await axios.get(`http://ip-api.com/json/${info}`);
    const c = response.data.country;
    const r = response.data.countryCode;
    const n = response.data.regionName;
    const t = response.data.timezone;
    const i = response.data.query;
    const s = response.data.isp;
    const cc = response.data.city;

    api.sendMessage(`✅ | IP Address Information:\ncountry: ${c}\nregion: ${n}\ncountrycode: ${r}\ntimezone: ${t}\nISP: ${s}\nIP: ${i}\ncity: ${cc}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(`🔴 | Error checking IP address\n${error}`, event.threadID, event.messageID);
    console.log(error);
  }
};
