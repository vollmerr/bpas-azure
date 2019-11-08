const chalk = require('chalk');

const log = (name) => (...msg) => {
  console.log(chalk.bgBlue(' bpa-azure '), chalk.blueBright(`[${name}]`), ...msg);
};

const warn = (name) => (...msg) => {
  console.warn(chalk.bgYellow(' bpa-azure '), chalk.yellowBright(`[${name}]`), ...msg);
};

const error = (name) => (...msg) => {
  console.error(chalk.bgRed(' bpa-azure '), chalk.redBright(`[${name}]`), ...msg);
};

const logger = (name) => ({
  log: log(name),
  warn: warn(name),
  error: error(name),
});

module.exports = logger;
