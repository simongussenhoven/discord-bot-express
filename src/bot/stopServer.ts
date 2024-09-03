import { ActivityType, Message } from "discord.js";
const { Client: SshClient } = require('ssh2');
import { sendError } from './sendError'

export const stopServer = (message: Message, client: any) => {
  message.channel.send('Shutting down server...');
  const ssh = new SshClient();
  ssh.on('ready', () => {
    ssh.exec('sudo shutdown now', (err: any, stream: any) => {
      if (err) {
        sendError(message, client);
      }
      stream.on('close', (code: any, signal: any) => {
        ssh.end();
        message.channel.send('Server is shutting down');
      });
    });
  }).connect({
    host: '192.168.2.99',
    port: '22',
    username: 'sshuser',
    password: process.env.SSH_PASSWORD,
  });
}