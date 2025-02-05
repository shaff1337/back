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
    origin: '*',
    methods: ['GET', 'POST']
}));
app.use(express.json());
app.use(ratelimit.global);
app.use('*', cors()); // Allow preflight requests

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allowed methods
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers

    // Handle preflight requests (CORS Preflight)
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});



// Routes
app.use('/v1', routes);



// Handlers
app.use(errorHandler.notFound);
app.use(errorHandler.global);

export default httpsServer;