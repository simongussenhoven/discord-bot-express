import { Client } from "discord.js";
import { ServerStatus } from "../interfaces/ServerStatus";

export const setServerStatus = (serverStatus: ServerStatus, client: Client) => {
  if (serverStatus === ServerStatus.ONLINE) {
    client.user?.setActivity("Server is online");
    client.user?.setStatus("online");
  }
  else {
    client.user?.setActivity("Server is offline");
    client.user?.setStatus("dnd");
  }
}