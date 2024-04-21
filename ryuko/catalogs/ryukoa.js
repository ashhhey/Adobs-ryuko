console.clear();
const { spawn } = require("child_process");
const express = require("express");
const app = express();
const chalk = require('chalk');
const logger = require("./ryukoc.js");
const path = require('path');
const PORT = process.env.PORT || 3000;
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/website/ryuko.html'));
});
console.clear();
function startBot(message) {
    (message) ? logger(message, "starting") : "";
  console.log(chalk.bold.blue('DEPLOYING MAIN SYSTEM\n'));
  logger.loader(`deploying app on port ${chalk.blueBright(PORT)}`);
  app.listen(PORT.loader(`app deployed on port 3000`));
  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "ryukob.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });
  child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot();
            global.countRestart += 1;
            return;
        } else return;
    });

  child.on("error", function(error) {
    logger("an error occurred : " + JSON.stringify(error), "error");
  });
};
startBot();
