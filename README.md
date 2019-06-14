
# bpa-azure

This project contains scripts for tasks in Azure.

## Getting Started
To start using this project in your own:

1. Use `npm install --save bpa-azure` to install this project.
2. Copy the `.env.sample` file to `.env.dev` and `.env.prod`.
3. Make sure your `.gitignore` contains `.env.dev` and `.env.prod`. There will be sensitive data present that should not be commited to a repository.
4. Fill out the variables in the `.env.dev` and `.env.prod` to match your deploy environments.
5. Add scripts in the `package.json` for deploying in dev and prod, such as:

```
"scripts": {
  "deploy": "bpa-azure deploy",
  "deploy:prod": "bpa-azure deploy --prod"
}
```
6. Running `npm run deploy` or `npm run deploy:prod` should now compress and deploy the file(s) targeted in `.env.dev` or `.env.prod`.

## Commands
The following commands are available:

- [deploy](./examples/deploy/)
  - Compress and deploy a file or files in a folder to Azure Blob Storage
- [remove-hash](./examples/remove-hash/)
  - Removes hash values from the filename of files in a folder
