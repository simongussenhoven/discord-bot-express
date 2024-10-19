import { ActivityType, Client } from "discord.js";
import { ServerStatus } from "../interfaces/ServerStatus";
import { Message } from "discord.js";

export const getServerStatus = async (message: Message | null, serverStatus: ServerStatus, client: Client) => {
  try {
    const response = await fetch('http://192.168.2.99:5000');
    if (response) {
      console.info(new Date().toLocaleString() + ': Server is online');
      if (serverStatus === ServerStatus.OFFLINE) message?.reply('Server status changed to online');
      client.user?.setActivity("Server is online", { type: ActivityType.Custom });
      client.user?.setStatus("online");
      return ServerStatus.ONLINE;
    }
  }
  catch (error) {
    console.info(new Date().toLocaleString() + ': Server is offline');
    client.user?.setActivity("Server is offline", { type: ActivityType.Custom });
    client.user?.setStatus("dnd");
    if (serverStatus === ServerStatus.ONLINE) message?.reply('Server status changed to offline');
    return ServerStatus.OFFLINE;
  }
  return ServerStatus.UNKNOWN;
}