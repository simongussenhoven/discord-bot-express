import { Message } from "discord.js";
import { stopServer } from "./stopServer";
import { sendError } from "./sendError";
import { startServer } from "./startServer";
import { ServerStatus } from "../interfaces/ServerStatus";

type MessageContent = '!start' | '!stop' | '!status'

export const respondToMessage = (message: Message, serverStatus: ServerStatus) => {
  // start the server if not online
  if (message.content === '!start') {
    if (serverStatus === ServerStatus.ONLINE) return sendError(message, 'Server is already online');
    return startServer(message);
  }

  // stop the server if online
  if (message.content === '!stop') {
    if (serverStatus === ServerStatus.OFFLINE) return sendError(message, 'Server is already offline');
    return stopServer(message);
  }

  // check the status of the server
  if (message.content === '!status') {
    if (serverStatus === ServerStatus.ONLINE) return message.reply('Server is online');
    if (serverStatus === ServerStatus.OFFLINE) return message.reply('Server is offline');
    if (serverStatus === ServerStatus.UNKNOWN) return message.reply('Server status is unknown');

  }

  // otherwise, send an error message
  return sendError(message, 'I listen to the following commands: !start, !stop, !status');
}