# Examples - deploy

1. Copy the `.env.sample` into this directory renamed as `.env.dev` or `.env.prod`
2. Fill out the environment variables in `.env.dev` or `.env.prod` to point to a dev Azure Blob Storage
3. Optionally comment out `DEPLOY_FILE` for deploying the entire folder
4. Use `npm run deploy` or `npm run deploy:prod`
5. The files should be compressed in the `/dist` folder, and uploaded to the specified Azure Blob Storage
6. To run again, replace the contents of the `/dist` folder with the contents of the `/copy` folder
