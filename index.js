#!/usr/bin/env node
const yargs = require('yargs')
  .scriptName('bpa-azure')
  .usage('Usage: $0 <command> [options]')
  .option('env', {
    alias: 'e',
    describe: 'Environment to target',
    default: 'development',
  })
  // deploy
  .command('deploy', 'Compress and deploy file(s) to Azure Blob Storage')
  .example('$0 deploy --env=production', 'Deploy to production environment')
  // remove hash
  .command('remove-hash', 'Remove hash from file names and references in index.html')
  .example('$0 remove-hash', 'Remove hash from all files and fix index.html')
  // help
  .help('h')
  .alias('h', 'help')
  .demandCommand()
  .argv;

// load environment variables based off env param
require('./utils/env-var').loadEnvVars(yargs.env);

const command = yargs._[0];
/* eslint-disable global-require */
if (command === 'deploy') {
  require('./commands/deploy')();
}

if (command === 'remove-hash') {
  require('./commands/remove-hash')();
}
