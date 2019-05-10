# Examples - remove-hash

1. Copy the `.env.sample` into this directory renamed as `.env.dev` (runs in dev by default, will need .prod in actual app)
2. Optionally change the `DEPLOY_FOLDER` to a different folder to remove hashes from
3. Use `npm run remove-hash`
4. The files should be renamed to `file.js` and `style.css` in the folder targeted by `DEPLOY_FOLDER` (dist by default)
5. To run again, replace the contents of the folder targeted by `DEPLOY_FOLDER` with the contents of the `copy` folder
