import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { morgan, ratelimit } from './middleware';
import { errorHandler } from './util';
import routes from './api/v1';
import config from './config';
import fs from 'fs';
import path from 'path';
import { CoinbaseCommerceClient } from 'node-coinbase-commerce';

export const coinbaseclient = new CoinbaseCommerceClient(config.coinbase.secret);

const app = express();
app.set('trust proxy', 1 /* number of proxies between user and server */);

const httpServer = createHttpServer(app);
const httpsServer = createHttpsServer({
  key: fs.readFileSync(path.join(__dirname, '../certs/privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem')),
  ca: fs.readFileSync(path.join(__dirname, '../certs/fullchain.pem')),
}, app);

// Middlewares
app.use(morgan);
app.use(helmet());
app.use(cors({
    origin: 'https://front-sigma-nine.vercel.app', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true // If you need to include credentials (like cookies)
}));
app.use(express.json());
app.use(ratelimit.global);

// Routes
app.use('/v1', routes);

// Handlers
app.use(errorHandler.notFound);
app.use(errorHandler.global);

export default httpsServer;