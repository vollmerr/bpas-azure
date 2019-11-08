const stream = require('stream');
const zlib = require('zlib');
const path = require('path');
const fs = require('fs');
const util = require('util');
const mime = require('mime-types');
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
} = require('@azure/storage-blob');
const chalk = require('chalk');

const { log, error } = require('../utils/logger')('deploy');
const { getEnvVar, getRequiredEnvVar } = require('../utils/env-var');

const pipeline = util.promisify(stream.pipeline);

const account = getRequiredEnvVar('DEPLOY_ACCOUNT');
const accountKey = getRequiredEnvVar('DEPLOY_ACCOUNT_KEY');
const containerName = getRequiredEnvVar('DEPLOY_CONTAINER');
const targetFolder = getRequiredEnvVar('DEPLOY_FOLDER');
const targetFile = getEnvVar('DEPLOY_FILE');
const compressType = getRequiredEnvVar('DEPLOY_COMPRESSION_TYPE');

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const storagePipeline = newPipeline(sharedKeyCredential);
const serviceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  storagePipeline,
);
const containerClient = serviceClient.getContainerClient(containerName);
const targetPath = path.resolve('.', targetFolder);

// compress a file using the given compression type, keeping the original name
// defaults to brottli compression
const compressFile = async (filePath) => {
  let compress;
  if (compressType === 'gzip') {
    compress = zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });
  } else {
    compress = zlib.createBrotliCompress();
  }

  const read = fs.createReadStream(filePath);
  const write = fs.createWriteStream(`${filePath}.tmp`);
  // send contents from read stream to write stream, compressed
  await pipeline(read, compress, write);
  fs.renameSync(`${filePath}.tmp`, filePath);
};

// upload a file to Azure, and set compression type header
const uploadFile = async (filePath, fileName) => {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  const fileStream = fs.createReadStream(filePath);
  const bufferSize = 4 * 1024 * 1024;
  const maxConcurrency = 10;
  const blobContentType = mime.lookup(fileName);
  const options = {
    onProgress: log,
    blobHTTPHeaders: {
      blobContentEncoding: compressType,
      blobContentType,
    },
  };

  await blockBlobClient.uploadStream(
    fileStream,
    bufferSize,
    maxConcurrency,
    options,
  );
};

// compress a file then upload it to Azure
const deployFile = async (fileName) => {
  const filePath = path.join(targetPath, fileName);
  await compressFile(filePath);
  await uploadFile(filePath, fileName);
  log(`successfully deployed ${chalk.magenta(fileName)}`);
};

// deploys all files in a given directory to Azure, compressed
// using the given compression type
const deployFolder = async () => {
  try {
    const fileNames = fs.readdirSync(targetPath);

    if (!fileNames.length) {
      throw new Error('Empty `DEPLOY_FOLDER` provided');
    }

    const promises = fileNames.map(deployFile);

    await Promise.all(promises);
    log('successfully deployed all files!');
  } catch (err) {
    error(err);
  }
};

const deploy = async () => {
  log('starting to deploy files...');

  if (targetFile) {
    await deployFile(targetFile);
  } else {
    await deployFolder();
  }
};

module.exports = deploy;
