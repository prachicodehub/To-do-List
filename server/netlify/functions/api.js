// Netlify Function entry: the whole Express app runs behind /api/* (see netlify.toml).
import serverless from 'serverless-http';
import app from '../../src/app.js';

// basePath strips the function prefix if Netlify passes the rewritten path, so Express still sees /api/...
export const handler = serverless(app, { basePath: '/.netlify/functions/api' });
