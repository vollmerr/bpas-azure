#!/usr/bin/env node
const yargs = require('yargs')
  .scriptName('bpa-azure')
  .usage('Usage: $0 <command> [options]')
  // deploy
  .command('deploy', 'Compress and deploy file(s) to Azure Blob Storage')
  .example('$0 deploy --prod', 'Deploy to production')
  .alias('p', 'prod')
  // remove hash
  .command('remove-hash', 'Remove hash from file names and references in index.html')
  .example('$0 remove-hash', 'Remove hash from all files and fix index.html')
  // help
  .help('h')
  .alias('h', 'help')
  .demandCommand()
  .argv;

const command = yargs._[0];
const mode = yargs.prod ? 'prod' : 'dev';

// configure environment variables based off MODE
require('dotenv').config({ path: `.env.${mode}` });

/* eslint-disable global-require */
if (command === 'deploy') {
  require('./commands/deploy')();
}

if (command === 'remove-hash') {
  require('./commands/remove-hash')();
}
