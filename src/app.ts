import express, { response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

import { initClient } from './bot/initClient';
import { ServerStatus } from './interfaces/ServerStatus';
import { readMessage } from './bot/readMessages';
import { Message } from 'discord.js';
import { getServerStatus } from './bot/getServerStatus';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// this stuff concerns the bot
let serverStatus: ServerStatus = ServerStatus.UNKNOWN;
let channel = null as any;

const client = initClient();
client.once("ready", async () => console.log("Bot was started successfully!"));
if (process.env.BOT_TOKEN) {
  client.login(process.env.TOKEN)
}
else {
  console.error("No token provided")
}
client.on("messageCreate", (message: Message) => {
  channel = message.channel;
  readMessage(message, serverStatus, client);
});


setInterval(async () => {
  serverStatus = await getServerStatus(serverStatus, channel, client)
}, 10000)

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Server is running',
    status: 'success',
    statusCode: 200,
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
