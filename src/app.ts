import express, { response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

import { initClient } from './bot/initClient';
import { ServerStatus } from './interfaces/ServerStatus';
import { respondToMessage } from './bot/respondToMessage';
import { ChannelType, Message } from 'discord.js';
import { getServerStatus } from './bot/getServerStatus';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// state of the server
let serverStatus: ServerStatus = ServerStatus.UNKNOWN;
let message: Message | null = null;

// initialize the bot
const client = initClient();
client.once("ready", async () => console.log("Bot was started successfully!"));
if (process.env.BOT_TOKEN) {
  client.login(process.env.BOT_TOKEN)
}
else {
  console.error("No token provided")
}

// respond to direct messages
client.on("messageCreate", (newMessage: Message) => {
  if (newMessage.channel.type !== ChannelType.DM || newMessage.author.bot) return;
  message = newMessage;
  respondToMessage(message, serverStatus);
});

// watch the server status, if it changes, update the bot status
// if there is a message, reply to it
setInterval(async () => {
  const response: ServerStatus = await getServerStatus(client);
  if (response !== serverStatus) {
    if (message) {
      if (response === ServerStatus.ONLINE) message.reply('🟢 Server is online');
      if (response === ServerStatus.OFFLINE) message.reply('🔴 Server is offline');
    }
    serverStatus = response;
    message = null;
  }

}, 10000);

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
