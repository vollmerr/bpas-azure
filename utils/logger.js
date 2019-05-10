const chalk = require('chalk');

const log = (...msg) => {
  console.log(chalk.blueBright('bpa-azure: '), ...msg);
};

const warn = (...msg) => {
  console.warn(chalk.yellowBright('bpa-azure: '), ...msg);
};

const error = (...msg) => {
  console.error(chalk.redBright('bpa-azure: '), ...msg);
};

module.exports = {
  log,
  warn,
  error,
}
