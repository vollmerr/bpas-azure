const stream = require('stream');
const zlib = require('zlib');
const path = require('path');
const fs = require('fs');
const util = require('util');
const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  StorageURL,
  SharedKeyCredential,
  uploadStreamToBlockBlob,
} = require('@azure/storage-blob');
const chalk = require('chalk');

const pipeline = util.promisify(stream.pipeline);

const account = process.env.DEPLOY_ACCOUNT;
const accountKey = process.env.DEPLOY_ACCOUNT_KEY;
const containerName = process.env.DEPLOY_CONTAINER;
const targetFolder = process.env.DEPLOY_FOLDER;
const targetFile = process.env.DEPLOY_FILE;
const compressType = process.env.DEPLOY_COMPRESSION_TYPE;

const sharedKeyCredential = new SharedKeyCredential(account, accountKey);
const storagePipeline = StorageURL.newPipeline(sharedKeyCredential);
const serviceURL = new ServiceURL(`https://${account}.blob.core.windows.net`, storagePipeline);
const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
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
  const timer = Aborter.timeout(30 * 60 * 1000);
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, fileName);
  await uploadStreamToBlockBlob(
    timer,
    fs.createReadStream(filePath),
    blockBlobURL,
    4 * 1024 * 1024,
    20,
    { progress: ev => console.log(ev) },
  );
  await blockBlobURL.setHTTPHeaders(timer, { blobContentEncoding: compressType });
};

// compress a file then upload it to Azure
const deployFile = async (fileName) => {
  const filePath = path.join(targetPath, fileName);
  await compressFile(filePath);
  await uploadFile(filePath, fileName);
  console.log(`successfully deployed ${chalk.magenta(fileName)}`);
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
    console.log(chalk.green('successfully deployed all files!'));
  } catch (err) {
    console.error(err);
  }
};

const deploy = () => {
  if (targetFile) {
    deployFile(targetFile);
  } else {
    deployFolder();
  }
};

deploy();
