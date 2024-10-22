import { ActivityType, Client } from "discord.js";
import { ServerStatus } from "../interfaces/ServerStatus";

export const getServerStatus = async (client: Client) => {
  const type = ActivityType.Custom
  const user = client.user;
  try {
    const response = await fetch('http://192.168.2.99:5000');
    if (response) {
      console.info(new Date().toLocaleString() + ': Server is online');
      user?.setActivity("Server is online", { type });
      user?.setStatus("online");
      return ServerStatus.ONLINE;
    }
  }
  catch (error) {
    console.info(new Date().toLocaleString() + ': Server is offline');
    user?.setActivity("Server is offline", { type });
    user?.setStatus("dnd");
    return ServerStatus.OFFLINE;
  }
  return ServerStatus.UNKNOWN;
}