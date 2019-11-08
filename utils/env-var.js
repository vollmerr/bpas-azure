// Based off create-react-apps environemnt variable configuration
// Refer to https://create-react-app.dev/docs/adding-custom-environment-variables/
// for file precedence, etc
const fs = require('fs');

const { log, error } = require('./logger')('env-var');

const loadEnvVars = (environment) => {
  const dotenvFiles = [
    `.env.${environment}.local`,
    `.env.${environment}`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    environment !== 'test' && '.env.local',
    '.env',
  ].filter(Boolean);

  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      /* eslint-disable global-require */
      require('dotenv').config({
        path: dotenvFile,
      });
      /* eslint-enable global-require */
      log(`using environment: ${dotenvFile}`);
    }
  });
};

const getEnvVar = (name) => process.env[name];

const getRequiredEnvVar = (name) => {
  const envVar = getEnvVar(name);

  if (!envVar) {
    throw error(`environment variable '${name}' is not set`);
  }

  return envVar;
};

module.exports = {
  loadEnvVars,
  getEnvVar,
  getRequiredEnvVar,
};
