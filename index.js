#!/usr/bin/env node
const yargs = require('yargs')
  .scriptName('bpa-azure')
  .usage('Usage: $0 <command> [options]')
  // deploy
  .command('deploy', 'Compress and deploy file(s) to Azure Blob Storage')
  .example('$0 deploy --prod', 'Deploy to production')
  .alias('p', 'prod')
  // help
  .help('h')
  .alias('h', 'help')
  .demandCommand()
  .argv;

const command = yargs._[0];

if (command === 'deploy') {
  const mode = yargs.prod ? 'prod' : 'dev';
  // configure environment variables based off MODE
  require('dotenv').config({ path: `.env.${mode}` });
  require('./deploy');
}
