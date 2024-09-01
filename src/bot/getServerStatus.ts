import { ActivityType, Client } from "discord.js";
import { ServerStatus } from "../interfaces/ServerStatus";

export const getServerStatus = async (serverStatus: ServerStatus, channel: any, client: Client) => {
  try {
    const response = await fetch('http://192.168.2.99:5000');
    if (response) {
      console.info(new Date().toLocaleString() + ': Server is online');
      if (channel && serverStatus === ServerStatus.OFFLINE) channel.send('Server status changed to online');
      client.user?.setActivity("Server is online", { type: ActivityType.Custom });
      client.user?.setStatus("online");
      return ServerStatus.ONLINE;
    }
  }
  catch (error) {
    console.info(new Date().toLocaleString() + ': Server is offline');
    client.user?.setActivity("Server is offline", { type: ActivityType.Custom });
    client.user?.setStatus("dnd");
    if (channel && serverStatus === ServerStatus.ONLINE) channel.send('Server status changed to offline');
    return ServerStatus.OFFLINE;
  }
  return ServerStatus.UNKNOWN;
}