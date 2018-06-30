import express from 'express';
import http from 'http';
import config from './config';
import log from './logger';
import routes from './routes';
import DatabaseClient from "./database/index";

const app = express();

routes(app);

const server = http.createServer(app);
server.listen(config.port);
server.on('error', error => log.error(error));
server.on('listening', () => log.info(`Listening at ${config.url}`));
const db = DatabaseClient.connect(server);

process.on('uncaughtException', (error) => {
  log.error(error);
});

