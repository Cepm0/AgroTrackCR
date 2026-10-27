import { createApp } from './app.js';
import { mkdirSync } from 'node:fs';
import express from 'express';
mkdirSync('data',{recursive:true});
const {app}=createApp(process.env.DATABASE_PATH||'data/agrotrack.sqlite');
if(process.env.NODE_ENV==='production')app.use(express.static('dist'));
else {const {createServer}=await import('vite');const vite=await createServer({server:{middlewareMode:true,hmr:{port:Number(process.env.HMR_PORT||24678)},fs:{deny:['**/.git/**','**/data/**','**/*.sqlite*','**/.env*']}},appType:'spa'});app.use(vite.middlewares);}
const port=Number(process.env.PORT||3000);app.listen(port,'0.0.0.0',()=>console.log(`AgroTrack CR iniciado en puerto ${port}`));
