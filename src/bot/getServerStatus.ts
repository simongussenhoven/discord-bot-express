import { ActivityType, Client } from "discord.js";
import { ServerStatus } from "../interfaces/ServerStatus";
import { Message } from "discord.js";

export const getServerStatus = async (client: Client, currentStatus: ServerStatus) => {
  const type = ActivityType.Custom
  const user = client.user;
  try {
    const response = await fetch('http://192.168.2.99:5000');
    if (response) {
      console.info(new Date().toLocaleString() + ': Server is online');
      user?.setActivity("Server is online", { type });
      user?.setStatus("online");
      return currentStatus === ServerStatus.STARTING ? ServerStatus.ONLINE : currentStatus;
    }
  }
  catch (error) {
    console.info(new Date().toLocaleString() + ': Server is offline');
    user?.setActivity("Server is offline", { type });
    user?.setStatus("dnd");
    return currentStatus === ServerStatus.STOPPING ? ServerStatus.OFFLINE : currentStatus;
  }
  return ServerStatus.UNKNOWN;
}