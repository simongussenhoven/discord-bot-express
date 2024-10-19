import { ActivityType, Message } from "discord.js";
const { Client: SshClient } = require('ssh2');
import { sendError } from './sendError'

export const stopServer = (message: Message) => {
  message.reply('Shutting down server...');
  const ssh = new SshClient();
  ssh.on('ready', () => {
    // delay shutdown by 1 second
    ssh.exec('sudo shutdown -h +5', (err: any, stream: any) => {
      if (err) {
        sendError(message, 'Error shutting down server');
      }
      stream.on('close', (code: any, signal: any) => {
        ssh.end();
        message.reply('Server is shutting down');
      });
    });
  }).connect({
    host: '192.168.2.99',
    port: '22',
    username: 'sshuser',
    password: process.env.SSH_PASSWORD,
  });
}