import { Message } from "discord.js";
import { ServerStatus } from "../interfaces/ServerStatus";
const wol = require("wakeonlan");

export const startServer = (message: Message) => {
  wol("60:45:CB:86:3C:C6").then(() => {
    console.log(`${message.author} started the server`)
  });
}