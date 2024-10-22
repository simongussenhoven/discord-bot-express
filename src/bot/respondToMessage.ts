import { Message } from "discord.js";
import { stopServer } from "./stopServer";
import { sendError } from "./sendError";
import { startServer } from "./startServer";
import { ServerStatus } from "../interfaces/ServerStatus";

enum MessageContent {
  START = '!start',
  STOP = '!stop',
  STATUS = '!status'
}

export const respondToMessage = (message: Message, serverStatus: ServerStatus): void => {
  // start the server if not online
  if (message.content === MessageContent.START) {
    if (serverStatus === ServerStatus.ONLINE) {
      sendError(message, 'Server is already online');
    };

    message.reply('👍 Starting server...');
    startServer(message);
    return;
  }

  // stop the server if online
  if (message.content === MessageContent.STOP) {
    if (serverStatus === ServerStatus.OFFLINE) {
      sendError(message, 'Server is already offline')
    };
    message.reply('👍 Stopping server...');
    stopServer(message);
    return;
  }

  // check the status of the server
  if (message.content === '!status') {
    if (serverStatus === ServerStatus.ONLINE) message.reply('🟢 Server is online');
    if (serverStatus === ServerStatus.OFFLINE) message.reply('🔴 Server is offline');
    if (serverStatus === ServerStatus.UNKNOWN) message.reply('🟡 Server status is unknown');
    return;
  }

  // otherwise, send an error message
  sendError(message, 'I listen to the following commands: !start, !stop, !status');
}