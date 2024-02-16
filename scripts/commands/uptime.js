const axios = require('axios');
const os = require('os');
const { performance } = require('perf_hooks');

module.exports.config = {
    name: 'up',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'oten',
    usePrefix: false,
    description: 'Display Bot Ms/Ping',
    commandCategory: 'system',
    usages: '',
    cooldowns: 0
};

function byte2mb(bytes) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let l = 0, n = parseInt(bytes, 10) || 0;
  while (n >= 1024 && ++l) n = n / 1024;
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}module.exports.run = async ({ api, event }) => {
  const dateNow = Date.now()
  const up = process.uptime(); // gets the uptime in seconds
  const days = Math.floor(up / 86400);
  const hours = Math.floor(up % 86400 / 3600);
  const minutes = Math.floor(up % 3600 / 60);
  const seconds = Math.floor(up % 60);
  const cpuCores = os.cpus().length;
  const totalRam = (os.totalmem() / (1024 ** 3)).toFixed(2);
  const freeRam = (os.freemem() / (1024 ** 3)).toFixed(2);   
  const upt = os.uptime();
  const botStatus = "online";
  const pidusage = await global.nodemodule["pidusage"](process.pid);
  const t = global.data.allUserID.length;
  const e = global.data.allThreadID.length;
  const h = pidusage.cpu.toFixed(1);
  const g = byte2mb(pidusage.memory);
  const ping = (Date.now()) - dateNow;
  const response = `${global.config.BOTNAME} has been working for ${days} day(s) ${hours} hour(s) ${minutes} minute(s) ${seconds} second(s).\n❖Total users: ${t}\n❖Total Threads: ${e}\n❖Cpu usage: ${h}%\n❖RAM usage: ${g}\n❖Ping: ${ping}ms\n\n𝗔𝗗𝗠𝗜𝗡: www.facebook.com/mark.dev69`;

    api.sendMessage(`${response}`, event.threadID);
};