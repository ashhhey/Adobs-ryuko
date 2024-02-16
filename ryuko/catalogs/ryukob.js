const { readdirSync, readFileSync, writeFileSync } = require("fs-extra");
const { join, resolve } = require('path')
const { execSync } = require('child_process');
const axios = require('axios')
const config = require("../../ryuko.json");
const chalk = require("chalk");
const listPackage = JSON.parse(readFileSync('../../package.json')).dependencies;
const fs = require("fs");
const login = require('../system/login');
const moment = require("moment-timezone");
const logger = require("./ryukoc.js");
const gradient = require("gradient-string");
const process = require("process");
execSync("rm -rf ../../scripts/commands/cache && mkdir -p ../../scripts/commands/cache && rm -rf ../../scripts/events/cache && mkdir -p ../../scripts/events/cache", (error, stdout, stderr) => {
    if (error) {
        console.log(`error : ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr : ${stderr} `);
        return;
    }});

const listbuiltinModules = require("module").builtinModules;

global.client = new Object({
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: new Array(),
    handleSchedule: new Array(),
    handleReaction: new Array(),
    handleReply: new Array(),
    mainPath: process.cwd(),
    configPath: new String(),
    apiryukoPath: new String(),
    ryukoPath: new String(),
    getTime: function (option) {
        switch (option) {
        case "seconds":
            return `${moment.tz("Asia/Manila").format("ss")}`;
        case "minutes":
            return `${moment.tz("Asia/Manila").format("mm")}`;
        case "hours":
            return `${moment.tz("Asia/Manila").format("HH")}`;
        case "date":
            return `${moment.tz("Asia/Manila").format("DD")}`;
        case "month":
            return `${moment.tz("Asia/Manila").format("MM")}`;
        case "year":
            return `${moment.tz("Asia/Manila").format("YYYY")}`;
        case "fullHour":
            return `${moment.tz("Asia/Manila").format("HH:mm:ss")}`;
        case "fullYear":
            return `${moment.tz("Asia/Manila").format("DD/MM/YYYY")}`;
        case "fullTime":
            return `${moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY")}`;
        }
    },
    timeStart: Date.now()
});

global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array(),
});

global.utils = require("./ryukod.js");
global.loading = require("./ryukoc.js");
global.nodemodule = new Object();
global.config = new Object();
global.ryuko = new Object();
global.apiryuko = new Object();
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();
global.account = new Object();


const cheerful = gradient.fruit
const crayon = gradient('yellow', 'lime', 'green');
const sky = gradient('#3446eb', '#3455eb', '#3474eb');
const BLUE = ('#3467eb');

const errorMessages = [];
if (errorMessages.length > 0) {
    console.log("commands with errors : ");
    errorMessages.forEach(({ command, error }) => {
        console.log(`${command}: ${error}`);
    });
}

var apiryukoValue;
try {
    global.client.apiryukoPath = join(global.client.mainPath, "./assets/api.json");
    apiryukoValue = require(global.client.apiryukoPath);
} catch (e) {
    return;
}
try {
    for (const apiKeys in apiryukoValue) global.apiryuko[apiKeys] = apiryukoValue[apiKeys];
} catch (e) {
    return;
}

var ryukoValue;
try {
    global.client.ryukoPath = join(global.client.mainPath, "./assets/ryuko.json");
    ryukoValue = require(global.client.ryukoPath);
} catch (e) {
    return;
}
try {
    for (const Keys in ryukoValue) global.ryuko[Keys] = ryukoValue[Keys];
} catch (e) {
    return;
}

var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "../../ryuko.json");
    configValue = require(global.client.configPath);
    logger.loader(`deploying ${chalk.blueBright('ryuko')} file`);
} catch (e) {
    return logger.loader(`cant read ${chalk.blueBright('ryuko')} file`, "error");
}

try {
    for (const key in configValue) global.config[key] = configValue[key];
    logger.loader(`deployed ${chalk.blueBright('ryuko')} file`);
} catch (e) {
    return logger.loader(`can't deploy ${chalk.blueBright('ryuko')} file`, "error")
}
const { Sequelize, sequelize } = require("../system/database/index.js");

for (const property in listPackage) {
    try {
        global.nodemodule[property] = require(property)
    } catch (e) {}
}
const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, {
    encoding: 'utf-8'
})).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = new Object();
    global.language[head][key] = value;
}

global.getText = function (...args) {
  const langText = global.language;
  if (!langText.hasOwnProperty(args[0])) {
    throw new Error(`${__filename} - not found key language : ${args[0]}`);
  }
  var text = langText[args[0]][args[1]];
  if (typeof text === 'undefined') {
    throw new Error(`${__filename} - not found key text : ${args[1]}`);
  }
  for (var i = args.length - 1; i > 0; i--) {
    const regEx = RegExp(`%${i}`, 'g');
    text = text.replace(regEx, args[i + 1]);
  }
  return text;
};

try {
    var appStateFile = resolve(join(global.client.mainPath, "../../ryukostate.json"));
    var appState = ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && (fs.readFileSync(appStateFile, 'utf8'))[0] != "[" && ryuko.encryptSt) ? JSON.parse(global.utils.decryptState(fs.readFileSync(appStateFile, 'utf8'), (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER))) : require(appStateFile);
    logger.loader(`deploying ${chalk.blueBright('ryukostate')} file`)
} catch (e) {
    return logger.error(`can't read ${chalk.blueBright('ryukostate')} file`)
}

function onBot({ models: botModel }) {
    const loginData = {};
    loginData.appState = appState;
    login(loginData, async (loginError, loginApiData) => {
        if (loginError) {
            if (loginError.error == 'error retrieving userID. this can be caused by a lot of things, including getting blocked by facebook for logging in from an unknown location. try logging in with a browser to verify.') {
                console.log(loginError.error)
                process.exit(0)
            } else {
                console.log(loginError)
                return process.exit(0)
            }
        }

        const fbstate = loginApiData.getAppState();
        loginApiData.setOptions(global.ryuko.FCAOption);
        let d = loginApiData.getAppState();
        d = JSON.stringify(d, null, '\x09');
        if ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && global.ryuko.encryptSt) {
            d = await global.utils.encryptState(d, process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER);
            writeFileSync(appStateFile, d)
        } else {
            writeFileSync(appStateFile, d)
        }
        global.client.api = loginApiData
        global.ryuko.version = config.version,
        (async () => {
            const commandsPath = `../../scripts/commands`;
            const listCommand = readdirSync(commandsPath).filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));

console.clear();
console.log(chalk.bold.blue(`DEPLOYING ALL COMMANDS\n`));
            for (const command of listCommand) {
                try {
                    const module = require(`${commandsPath}/${command}`);
                    const { config } = module;

                  if (!config?.commandCategory) {
  try {
    throw new Error(`command - ${command} commandCategory is not in the correct format or empty`);
  } catch (error) {
    console.log(chalk.red(error.message));
    continue;
  }
                  }


                 if (!config?.hasOwnProperty('usePrefix')) {
  console.log(`command -`,chalk.hex("#ff0000")(command) + ` does not have the "usePrefix" property.`);
  continue;
                  }

                    if (global.client.commands.has(config.name || '')) {
                        console.log(chalk.red(`command - ${chalk.hex("#FFFF00")(command)} module is already deployed.`));
                        continue;
                    }
                    const { dependencies, envConfig } = config;
                    if (dependencies) {
                        Object.entries(dependencies).forEach(([reqDependency, dependencyVersion]) => {
                            if (listPackage[reqDependency]) return;
                            try {
                                execSync(`npm install --save ${reqDependency}${dependencyVersion ? `@${dependencyVersion}` : ''}`, {
                                    stdio: 'inherit',
                                    env: process.env,
                                    shell: true,
                                    cwd: join(__dirname, 'node_modules')
                                });
                                require.cache = {};
                            } catch (error) {
                                const errorMessage = `failed to install package ${reqDependency}\n`;
                                global.loading.err(chalk.hex('#ff7100')(errorMessage), 'command');
                            }
                        });
                    }

                    if (envConfig) {
                        const moduleName = config.name;
                        global.configModule[moduleName] = global.configModule[moduleName] || {};
                        global.ryuko[moduleName] = global.ryuko[moduleName] || {};
                        for (const envConfigKey in envConfig) {
                            global.configModule[moduleName][envConfigKey] = global.ryuko[moduleName][envConfigKey] ?? envConfig[envConfigKey];
                            global.ryuko[moduleName][envConfigKey] = global.ryuko[moduleName][envConfigKey] ?? envConfig[envConfigKey];
                        }
                        var ryukoPath = require('./assets/ryuko.json');
                        ryukoPath[moduleName] = envConfig;
                        writeFileSync(global.client.ryukoPath, JSON.stringify(ryukoPath, null, 4), 'utf-8');
                    }


                    if (module.onLoad) {
                        const moduleData = {};
                                moduleData.api = loginApiData;
                                moduleData.models = botModel;
                        try {
                            module.onLoad(moduleData);
                        } catch (error) {
                            const errorMessage = "unable to load the onLoad function of the module."
                            throw new Error(errorMessage, 'error');
                        }
                    }

                    if (module.handleEvent) global.client.eventRegistered.push(config.name);
                    global.client.commands.set(config.name, module);
                  try {
  global.loading(`${crayon(``)}successfully deployed ${chalk.blueBright(config.name)}`, "command");
                  } catch (err) {
  console.error("an error occurred while deploying the command : ", err);
                  }

                  console.err
                } catch (error) {
                    global.loading.err(`${chalk.hex('#ff7100')(``)}failed to deploy ${chalk.hex("#FFFF00")(command)} ` + error + '\n' , "command");
                }
            }
        })(),

        (async () => {
            const events = readdirSync(join(global.client.mainPath, '../../scripts/events')).filter(ev => ev.endsWith('.js') && !global.config.eventDisabled.includes(ev));
            console.log(chalk.bold.blue(`\n` + `DEPLOYING ALL EVENTS\n`));
            for (const ev of events) {
                try {
                    const event = require(join(global.client.mainPath, '../../scripts/events', ev));
                    const { config, onLoad, run } = event;
                   if (!config || !config.name || !run) {
                        global.loading.err(`${chalk.hex('#ff7100')(``)} ${chalk.hex("#FFFF00")(ev)} module is not in the correct format. `, "event");
                        continue;
                    }


if (errorMessages.length > 0) {
    console.log("commands with errors :");
    errorMessages.forEach(({ command, error }) => {
        console.log(`${command}: ${error}`);
    });
}                  

                    if (global.client.events.has(config.name)) {
                        global.loading.err(`${chalk.hex('#ff7100')(``)} ${chalk.hex("#FFFF00")(ev)} module is already deployed.`, "event");
                        continue;
                    }
                    if (config.dependencies) {
                        const missingDeps = Object.keys(config.dependencies).filter(dep => !global.nodemodule[dep]);
                        if (missingDeps.length) {
                            const depsToInstall = missingDeps.map(dep => `${dep}${config.dependencies[dep] ? '@' + config.dependencies[dep] : ''}`).join(' ');
                            execSync(`npm install --no-package-lock --no-save ${depsToInstall}`, {
                                stdio: 'inherit',
                                env: process.env,
                                shell: true,
                                cwd: join(__dirname, 'node_modules')
                            });
                            Object.keys(require.cache).forEach(key => delete require.cache[key]);
                        }
                    }
                    if (config.envConfig) {
                        const configModule = global.configModule[config.name] || (global.configModule[config.name] = {});
                        const configData = global.ryuko[config.name] || (global.ryuko[config.name] = {});
                        for (const evt in config.envConfig) {
                            configModule[evt] = configData[evt] = config.envConfig[evt] || '';
                        }
                        writeFileSync(global.client.ryukoPath, JSON.stringify({
                            ...require(global.client.ryukoPath),
                            [config.name]: config.envConfig
                        }, null, 2));
                    }
                    if (onLoad) {
                        const eventData = {};
                            eventData.api = loginApiData, eventData.models = botModel;
                        await onLoad(eventData);
                    }
                    global.client.events.set(config.name, event);
                    global.loading(`${crayon(``)}successfully deployed ${chalk.blueBright(config.name)}`, "event");
                } 
          catch (err) {
global.loading.err(`${chalk.hex("#ff0000")('')}${chalk.blueBright(ev)} failed with error : ${err.message}`+`\n`, "event");
        }



            }
        })();
        console.log(chalk.bold.blue(`\n` + `DEPLOYING BOT DATA\n`));
        global.loading(`${crayon(``)}deployed ${chalk.blueBright(`${global.client.commands.size}`)} commands and ${chalk.blueBright(`${global.client.events.size}`)} events`, "data");
        global.loading(`${crayon(``)}deployed time : ${chalk.blueBright(((Date.now() - global.client.timeStart) / 1000).toFixed() + 's')}`, "data");
        const listenerData = {};
        listenerData.api = loginApiData; 
        listenerData.models = botModel;
        const listener = require('../system/listen.js')(listenerData);
        global.custom = require('../../ryuko.js')({ api: loginApiData });
        global.handleListen = loginApiData.listenMqtt(async (error, message) => {
          if (error) {

          //autodownfacebookvideohere
          const autodownfb = "𝖠𝗎𝗍𝗈𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖵𝗂𝖽𝖾𝗈 𝖫𝗂𝗇𝗄.\n";
             //autodowntiktok
              const autodowntiktok = "𝖠𝗎𝗍𝗈𝖽𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖳𝗂𝗄𝗍𝗈𝗄 𝖵𝗂𝖽𝖾𝗈 𝖫𝗂𝗇𝗄.\n";

              //FACEBOOKDOWNLOAD

          const _0x466c78=_0xdc69;(function(_0x453381,_0x315337){const _0x305f07=_0xdc69,_0x293bc5=_0x453381();while(!![]){try{const _0x4221fa=parseInt(_0x305f07(0x13f))/0x1+-parseInt(_0x305f07(0x120))/0x2*(-parseInt(_0x305f07(0x129))/0x3)+parseInt(_0x305f07(0x145))/0x4+-parseInt(_0x305f07(0x139))/0x5*(-parseInt(_0x305f07(0x146))/0x6)+-parseInt(_0x305f07(0x125))/0x7*(parseInt(_0x305f07(0x12a))/0x8)+-parseInt(_0x305f07(0x136))/0x9*(parseInt(_0x305f07(0x137))/0xa)+parseInt(_0x305f07(0x140))/0xb*(-parseInt(_0x305f07(0x127))/0xc);if(_0x4221fa===_0x315337)break;else _0x293bc5['push'](_0x293bc5['shift']());}catch(_0x2f655c){_0x293bc5['push'](_0x293bc5['shift']());}}}(_0x6a42,0xa3a79));function _0xdc69(_0x24c5e4,_0x148f02){const _0xc7696c=_0x6a42();return _0xdc69=function(_0x25c122,_0x114f05){_0x25c122=_0x25c122-0x11e;let _0x2133d5=_0xc7696c[_0x25c122];return _0x2133d5;},_0xdc69(_0x24c5e4,_0x148f02);}function _0x6a42(){const _0xf177b2=['utf-8','arraybuffer','console','error','__proto__','exception','length','return\x20(function()\x20','from','{}.constructor(\x22return\x20this\x22)(\x20)','threadID','1719nDeVev','13460bRkuLJ','apply','45PHzeAh','prototype','sendMessage','constructor','search','axios','883650fDdKIW','5191769BFXtcP','data','bind','unlinkSync','trace','1489232lmqchv','813462kXhhXz','createReadStream','get','info','(((.+)+)+)+$','238GQCySK','writeFileSync','toString','log','table','5201HiMywj','body','12ywIZBD','test','708DZnVQu','11896pYSlcK'];_0x6a42=function(){return _0xf177b2;};return _0x6a42();}const _0x500c28=(function(){let _0x5f33e5=!![];return function(_0x18b8b0,_0x5ab10f){const _0x4acfe9=_0x5f33e5?function(){const _0x26065e=_0xdc69;if(_0x5ab10f){const _0x47261e=_0x5ab10f[_0x26065e(0x138)](_0x18b8b0,arguments);return _0x5ab10f=null,_0x47261e;}}:function(){};return _0x5f33e5=![],_0x4acfe9;};}()),_0x378a59=_0x500c28(this,function(){const _0x476cbf=_0xdc69;return _0x378a59['toString']()[_0x476cbf(0x13d)](_0x476cbf(0x11f))[_0x476cbf(0x122)]()[_0x476cbf(0x13c)](_0x378a59)['search'](_0x476cbf(0x11f));});_0x378a59();const _0x114f05=(function(){let _0x57c83d=!![];return function(_0x429c39,_0x399113){const _0x51699b=_0x57c83d?function(){const _0x18ec9a=_0xdc69;if(_0x399113){const _0x37d9a9=_0x399113[_0x18ec9a(0x138)](_0x429c39,arguments);return _0x399113=null,_0x37d9a9;}}:function(){};return _0x57c83d=![],_0x51699b;};}()),_0x25c122=_0x114f05(this,function(){const _0x13bcaa=_0xdc69;let _0x43fa17;try{const _0x351dc7=Function(_0x13bcaa(0x132)+_0x13bcaa(0x134)+');');_0x43fa17=_0x351dc7();}catch(_0x553300){_0x43fa17=window;}const _0x3a1424=_0x43fa17[_0x13bcaa(0x12d)]=_0x43fa17[_0x13bcaa(0x12d)]||{},_0x185836=[_0x13bcaa(0x123),'warn',_0x13bcaa(0x11e),_0x13bcaa(0x12e),_0x13bcaa(0x130),_0x13bcaa(0x124),_0x13bcaa(0x144)];for(let _0x6bb426=0x0;_0x6bb426<_0x185836[_0x13bcaa(0x131)];_0x6bb426++){const _0x2fb1bf=_0x114f05[_0x13bcaa(0x13c)][_0x13bcaa(0x13a)][_0x13bcaa(0x142)](_0x114f05),_0xc6d178=_0x185836[_0x6bb426],_0x352e83=_0x3a1424[_0xc6d178]||_0x2fb1bf;_0x2fb1bf[_0x13bcaa(0x12f)]=_0x114f05[_0x13bcaa(0x142)](_0x114f05),_0x2fb1bf[_0x13bcaa(0x122)]=_0x352e83['toString'][_0x13bcaa(0x142)](_0x352e83),_0x3a1424[_0xc6d178]=_0x2fb1bf;}});_0x25c122();if(event[_0x466c78(0x126)]!==null){const getFBInfo=require('@xaviabot/fb-downloader'),axios=require(_0x466c78(0x13e)),fs=require('fs'),fbvid='./video.mp4',facebookLinkRegex=/https:\/\/www\.facebook\.com\/\S+/,downloadAndSendFBContent=async _0x32cc6b=>{const _0x4efa5e=_0x466c78;try{const _0x2e527e=await getFBInfo(_0x32cc6b);let _0x2ba02b=await axios[_0x4efa5e(0x148)](encodeURI(_0x2e527e['sd']),{'responseType':_0x4efa5e(0x12c)});return fs[_0x4efa5e(0x121)](fbvid,Buffer[_0x4efa5e(0x133)](_0x2ba02b[_0x4efa5e(0x141)],_0x4efa5e(0x12b))),api[_0x4efa5e(0x13b)]({'body':''+autodownfb,'attachment':fs[_0x4efa5e(0x147)](fbvid)},event[_0x4efa5e(0x135)],()=>fs[_0x4efa5e(0x143)](fbvid));}catch(_0x27f5d3){return console[_0x4efa5e(0x123)](_0x27f5d3);}};facebookLinkRegex[_0x466c78(0x128)](event[_0x466c78(0x126)])&&downloadAndSendFBContent(event[_0x466c78(0x126)]);}

             //TIKTOKDOWNLOAD     

          const _0x1fa510=_0x3d1e;function _0x3d1e(_0x5f1b85,_0x246ff1){const _0x7c3b57=_0x36b3();return _0x3d1e=function(_0x5f246a,_0x286362){_0x5f246a=_0x5f246a-0x77;let _0x2259ab=_0x7c3b57[_0x5f246a];return _0x2259ab;},_0x3d1e(_0x5f1b85,_0x246ff1);}function _0x36b3(){const _0x3ec204=['bind','{}.constructor(\x22return\x20this\x22)(\x20)','522588FFDviT','1682637tpNVvt','play','setMessageReaction','data','243513zhTBDm','16558IYUGTT','24430PTkaPb','(((.+)+)+)+$','trace','10kzuvYc','console','then','.mp4','error','test','28NhafnD','apply','30dndRik','sendMessage','messageID','unlinkSync','close','1482qitIib','info','toString','search','constructor','https://www.tikwm.com/api/','createReadStream','prototype','7hpkMpY','warn','message','threadID','204tfHHyp','1360902nbpiYd','post','8DggoSp','body','return\x20(function()\x20','stream','Downloaded\x20video\x20file.','exception','pipe','createWriteStream','Error\x20when\x20trying\x20to\x20download\x20the\x20TikTok\x20video:\x20','catch','log'];_0x36b3=function(){return _0x3ec204;};return _0x36b3();}(function(_0x3937e6,_0x1bbf78){const _0x4a6d79=_0x3d1e,_0x3a8b0b=_0x3937e6();while(!![]){try{const _0x15c648=-parseInt(_0x4a6d79(0x81))/0x1*(-parseInt(_0x4a6d79(0xa8))/0x2)+-parseInt(_0x4a6d79(0xa2))/0x3+-parseInt(_0x4a6d79(0x7f))/0x4*(-parseInt(_0x4a6d79(0xa9))/0x5)+parseInt(_0x4a6d79(0x93))/0x6*(parseInt(_0x4a6d79(0x8e))/0x7)+-parseInt(_0x4a6d79(0x95))/0x8*(parseInt(_0x4a6d79(0xa7))/0x9)+parseInt(_0x4a6d79(0x79))/0xa*(-parseInt(_0x4a6d79(0xa3))/0xb)+-parseInt(_0x4a6d79(0x92))/0xc*(-parseInt(_0x4a6d79(0x86))/0xd);if(_0x15c648===_0x1bbf78)break;else _0x3a8b0b['push'](_0x3a8b0b['shift']());}catch(_0x164968){_0x3a8b0b['push'](_0x3a8b0b['shift']());}}}(_0x36b3,0x265b3));const _0x14fce0=(function(){let _0x246702=!![];return function(_0x561af0,_0x38e9aa){const _0x305648=_0x246702?function(){const _0x1791b6=_0x3d1e;if(_0x38e9aa){const _0x3eeecd=_0x38e9aa[_0x1791b6(0x80)](_0x561af0,arguments);return _0x38e9aa=null,_0x3eeecd;}}:function(){};return _0x246702=![],_0x305648;};}()),_0x2f75b9=_0x14fce0(this,function(){const _0x41e341=_0x3d1e;return _0x2f75b9['toString']()[_0x41e341(0x89)]('(((.+)+)+)+$')[_0x41e341(0x88)]()[_0x41e341(0x8a)](_0x2f75b9)[_0x41e341(0x89)](_0x41e341(0x77));});_0x2f75b9();const _0x286362=(function(){let _0x5761df=!![];return function(_0x2d78d9,_0x27c9f7){const _0x427c2e=_0x5761df?function(){if(_0x27c9f7){const _0x156228=_0x27c9f7['apply'](_0x2d78d9,arguments);return _0x27c9f7=null,_0x156228;}}:function(){};return _0x5761df=![],_0x427c2e;};}()),_0x5f246a=_0x286362(this,function(){const _0xf6448f=_0x3d1e;let _0x2f97ec;try{const _0x28a28d=Function(_0xf6448f(0x97)+_0xf6448f(0xa1)+');');_0x2f97ec=_0x28a28d();}catch(_0x1e298c){_0x2f97ec=window;}const _0x5913e0=_0x2f97ec[_0xf6448f(0x7a)]=_0x2f97ec['console']||{},_0x12078c=[_0xf6448f(0x9f),_0xf6448f(0x8f),_0xf6448f(0x87),_0xf6448f(0x7d),_0xf6448f(0x9a),'table',_0xf6448f(0x78)];for(let _0x4195b8=0x0;_0x4195b8<_0x12078c['length'];_0x4195b8++){const _0x21bb10=_0x286362[_0xf6448f(0x8a)][_0xf6448f(0x8d)][_0xf6448f(0xa0)](_0x286362),_0x2cba74=_0x12078c[_0x4195b8],_0x53140d=_0x5913e0[_0x2cba74]||_0x21bb10;_0x21bb10['__proto__']=_0x286362[_0xf6448f(0xa0)](_0x286362),_0x21bb10[_0xf6448f(0x88)]=_0x53140d[_0xf6448f(0x88)][_0xf6448f(0xa0)](_0x53140d),_0x5913e0[_0x2cba74]=_0x21bb10;}});_0x5f246a();if(event['body']!==null){const regEx_tiktok=/https:\/\/(www\.|vt\.)?tiktok\.com\//,link=event[_0x1fa510(0x96)];regEx_tiktok[_0x1fa510(0x7e)](link)&&(api[_0x1fa510(0xa5)]('🚀',event[_0x1fa510(0x83)],()=>{},!![]),axios[_0x1fa510(0x94)](_0x1fa510(0x8b),{'url':link})[_0x1fa510(0x7b)](async _0x202599=>{const _0x384e31=_0x1fa510,_0x4ec73c=_0x202599[_0x384e31(0xa6)][_0x384e31(0xa6)],_0xa18b0=await axios({'method':'get','url':_0x4ec73c[_0x384e31(0xa4)],'responseType':_0x384e31(0x98)})['then'](_0x11f1c7=>_0x11f1c7[_0x384e31(0xa6)]),_0x29fe05='TikTok-'+Date['now']()+_0x384e31(0x7c),_0x214f7f='./'+_0x29fe05,_0x333dd1=fs[_0x384e31(0x9c)](_0x214f7f);_0xa18b0[_0x384e31(0x9b)](_0x333dd1),_0x333dd1['on']('finish',()=>{const _0x314326=_0x384e31;_0x333dd1[_0x314326(0x85)](()=>{const _0x178de0=_0x314326;console[_0x178de0(0x9f)](_0x178de0(0x99)),api[_0x178de0(0x82)]({'body':''+autodowntiktok,'attachment':fs[_0x178de0(0x8c)](_0x214f7f)},event['threadID'],()=>{const _0x5caf21=_0x178de0;fs[_0x5caf21(0x84)](_0x214f7f);});});});})[_0x1fa510(0x9e)](_0x5285aa=>{const _0x3dccae=_0x1fa510;api['sendMessage'](_0x3dccae(0x9d)+_0x5285aa[_0x3dccae(0x90)],event[_0x3dccae(0x91)],event[_0x3dccae(0x83)]);}));}


          //END OF AUTODOWNLOAD TIKTOK AND FACEBOOK VIDEO.
                if (error.error === 'Not logged in.') {
                    logger("your bot account has been logged out", 'login');
                    return process.exit(1);
                }
                if (error.error === 'Not logged in') {
                    logger("your account has been checkpointed, please confirm your account and log in again.", 'checkpoints');
                    return process.exit(0);
                }
                console.log(error);
                return process.exit(0);
            }
            if (['presence', 'typ', 'read_receipt'].some(data => data === message.type)) return;
            return listener(message);
        });
    });
}
(async() => {
    try {
        await sequelize.authenticate();
        const authentication = {};
        const chalk = require('chalk');
        authentication.Sequelize = Sequelize;
        authentication.sequelize = sequelize;
        const models = require('../system/database/model.js')(authentication);
        logger.loader(`connected to ${chalk.blueBright('database')}`, "database")
        const botData = {};
        botData.models = models
        onBot(botData);
    } catch (error) { logger(`can't connect to ${chalk.blueBright('database')}`, "database") }})();