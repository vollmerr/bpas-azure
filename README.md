# bpa-azure

This project contains scripts for tasks in Azure.

## Quick start
This will show how to get the project running for production mode. Follow these same instructions for any other environments, replacing `production` with the environment name (such as development).

1. Install the package using `npm install --save bpa-azure`
2. Copy the `.env.sample` file to `.env.production`
3. Fill out any publicly available environment variables (NO SECRETS SUCH AS API KEYS HERE!) in `.env.production`
4. If there are any secrets being used, such as `DEPLOY_ACCOUNT_KEY`, copy the `.env.sample` file to `.env.production.local`
5. Make sure your `.gitignore` contains `.env.production.local`. There will be sensitive data present that should not be commited to a repository.
6. Fill out any private variables in `.env.production.local` (secrets such as API keys should go here)
7. Add a script in the `package.json`, such as for deploying:

```
"scripts": {
  "deploy:prod": "bpa-azure deploy --env=production"
}
```
6. Running `npm run deploy:prod` should now compress and deploy the file(s) targeted in `.env.production` or `.env.production.local`

## Commands
The following commands are available:

- [deploy](./examples/deploy/)
  - Compress and deploy a file or files in a folder to Azure Blob Storage
- [remove-hash](./examples/remove-hash/)
  - Removes hash values from the filename of files in a folder
