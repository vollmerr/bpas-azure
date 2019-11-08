# Examples - deploy
For this example we will use the 'staging' environment. To try a different environment replace all occurances of 'staging' with that environment.

1. Copy a `.env.staging` to `.env.staging.local`
2. Fill out the environment variables in `.env.staging.local` to point to a dev Azure Blob Storage
3. Optionally comment out `DEPLOY_FILE` for deploying the entire folder
4. Run `npm run deploy:staging`
5. The files should be compressed in the `dist` folder, and uploaded to the specified Azure Blob Storage
6. To run again, replace the contents of the `dist` folder with the contents of the `copy` folder
