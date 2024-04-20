module.exports.config = {
  name: "help",
  version: "1.0.2",
  hasPermission: 0,
  credits: "ryuko",
  description: "beginner's guide",
  usePrefix: true,
  commandCategory: "utility",
  usages: "[Shows Commands]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60
  }
};

module.exports.languages = {
  en: {
    moduleInfo:
      "「 %1 」\n%2\n\n❯ Version: %4\n❯ Usage: %3\n❯ Category: %5\n❯ Cooldown: %6 seconds(s)\n❯ Permission: %7",
    helpList:
      `there are %1 commands and %2 categories of ${global.config.BOTNAME} ai.`,
    user: "user",
    adminGroup: "group admin",
    adminBot: "bot admin",
  },
};


module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;  

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0)
    return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;
  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${
        command.config.usages ? command.config.usages : ""
      }`,
      command.config.version,
      command.config.commandCategory,
      command.config.cooldowns,
      command.config.hasPermssion === 0
        ? getText("user")
        : command.config.hasPermssion === 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;

  if (!command) {
    const commandList = Array.from(commands.values());
    const categories = new Set(commandList.map((cmd) => cmd.config.commandCategory.toLowerCase()));
    const categoryCount = categories.size;

    const categoryNames = Array.from(categories);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(categoryNames.length / itemsPerPage);

    let currentPage = 1;
    if (args[0]) {
      const parsedPage = parseInt(args[0]);
      if (
        !isNaN(parsedPage) &&
        parsedPage >= 1 &&
        parsedPage <= totalPages
      ) {
        currentPage = parsedPage;
      } else {
        return api.sendMessage(
          `oops, you went too far. please choose a page between 1 and ${totalPages}.`,
          threadID,
          messageID
        );
      }
    }
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleCategories = categoryNames.slice(startIdx, endIdx);

    let msg = "";
    for (let i = 0; i < visibleCategories.length; i++) {
      const category = visibleCategories[i];
      const categoryCommands = commandList.filter(
        (cmd) =>
          cmd.config.commandCategory.toLowerCase() === category
      );
      const commandNames = categoryCommands.map((cmd) => cmd.config.name);
      const yt = `${
        category.charAt(0).toUpperCase() + category.slice(1)
      }`;
      const numberFont = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
      ];
      msg += `⌈${formatFont(yt)}⌋\n${commandNames.join(", ")}\n\n`;
    }
    const numberFontPage = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
    ];
    msg += `page (${numberFontPage[currentPage - 1]} of ${
      numberFontPage[totalPages - 1]
    })`;
    msg += getText(commands.size, categoryCount, prefix);

    const axios = require("axios");
    const fs = require("fs-extra");
    const imgP = [];
    const img = [
      "https://i.ibb.co/ZLnvPwQ/Picsart-23-07-24-11-03-50-602.png"
    ];
    const path = __dirname + "/cache/menu.png";
    const rdimg = img[Math.floor(Math.random() * img.length)];

    const { data } = await axios.get(rdimg, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(path, Buffer.from(data, "utf-8"));
    imgP.push(fs.createReadStream(path));
    const msgg = {
  body: `List category\n\n${msg}`
    };

    const sentMessage = await api.sendMessage(msgg, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 500));
        return api.unsendMessage(info.messageID);
      } else return;
    }, messageID);
  } else {
    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${
          command.config.usages ? command.config.usages : ""
        }`,
        command.config.version,
        command.config.commandCategory,
        command.config.cooldowns,
        command.config.hasPermssion === 0
          ? getText("user")
          : command.config.hasPermssion === 1
          ? getText("adminGroup")
          : getText("adminBot"),
        command.config.credits
      ),
      threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 500));
        return api.unsendMessage(info.messageID);
      } else return;
    }, messageID);
  }
};
function formatFont(text) {
  const fontMapping = {
    a: "𝗔", b: "𝗕", c: "𝗖", d: "𝗗", e: "𝗘", f: "𝗙", g: "𝗚", h: "𝗛", i: "𝗜", j: "𝗝", k: "𝗞", l: "𝗟", m: "𝗠",
    n: "𝗡", o: "𝗢", p: "𝗣", q: "𝗤", r: "𝗥", s: "𝗦", t: "𝗧", u: "𝗨", v: "𝗩", w: "𝗪", x: "𝗫", y: "𝗬", z: "𝗭",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠",
    N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭"
  };

  let formattedText = "";
  for (const char of text) {
    formattedText += char in fontMapping ? fontMapping[char] : char;
  }

  return formattedText;
      }
