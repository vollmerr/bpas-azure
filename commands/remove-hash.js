const path = require('path');
const fs = require('fs');

const { log } = require('../utils/logger');

const targetFolder = process.env.DEPLOY_FOLDER;
const targetPath = path.resolve('.', targetFolder);

//          $1                                                                $2
// matches (atleast one non period, period), atleast one non period, period, (atleast one charatcer)
const hashMatch = /^([^.]+\.)[^.]+\.(.+)$/;

// go through all files in target path and remove hashes
// requires only single js/css files so no name collisions
const removeHash = () => {
  log('starting to remove hashes...');

  fs.readdirSync(targetPath)
    .filter((x) => x.match(hashMatch))
    .forEach((file) => {
      const withHash = path.resolve(targetPath, file);
      const withoutHash = path.resolve(targetPath, file.replace(hashMatch, '$1$2'));
      fs.renameSync(withHash, withoutHash);
    });

  log('successfully removed all hashes');
};

module.exports = removeHash;
