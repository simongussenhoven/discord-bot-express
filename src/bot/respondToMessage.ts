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

export const respondToMessage = (message: Message, serverStatus: ServerStatus): ServerStatus => {
  // start the server if not online
  if (message.content === MessageContent.START) {
    if (serverStatus === ServerStatus.ONLINE) {
      sendError(message, 'Server is already online');
      return serverStatus;
    };
    if (serverStatus === ServerStatus.STARTING) {
      sendError(message, 'Server is already starting');
      return serverStatus
    };
    message.reply('👍 Starting server...');
    startServer(message);
    return ServerStatus.STARTING;
  }

  // stop the server if online
  if (message.content === MessageContent.STOP) {
    if (serverStatus === ServerStatus.OFFLINE) {
      sendError(message, 'Server is already offline')
      return serverStatus;
    };
    if (serverStatus === ServerStatus.STOPPING) {
      sendError(message, 'Server is already stopping');
      return serverStatus;
    };
    message.reply('👍 Stopping server...');
    stopServer(message);
    return ServerStatus.STOPPING;
  }

  // check the status of the server
  if (message.content === '!status') {
    if (serverStatus === ServerStatus.ONLINE) message.reply('🟢 Server is online');
    if (serverStatus === ServerStatus.OFFLINE) message.reply('🔴 Server is offline');
    if (serverStatus === ServerStatus.UNKNOWN) message.reply('🟡 Server status is unknown');
    return serverStatus;
  }

  // otherwise, send an error message
  sendError(message, '⚠️ I listen to the following commands: !start, !stop, !status');
  return serverStatus;
}