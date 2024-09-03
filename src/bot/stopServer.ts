import { ActivityType, Message } from "discord.js";
const { Client: SshClient } = require('ssh2');
import { sendError } from './sendError'
import { sshConfig } from '../../config/sshConfig';

export const stopServer = (message: Message, client: any) => {
  console.log(process.env.PRIVATE_KEY)
  console.log(JSON.stringify(sshConfig))
  console.log('Stopping server...');
  const sshClient = new SshClient();
  sshClient.on('ready', () => {
    sshClient.exec('sudo -i shutdown -h now', (err: Error, stream: any) => {
      if (err) {
        console.log('(SSH Connection error)', err);
        sendError(message, 'Could not connect to server');
        sshClient.end();
        return;
      }

      stream.on('close', (code: any, signal: any) => {
        console.log(`Shutdown command sent. Stream closed with code ${code} and signal ${signal}`);
        sshClient.end();
      });

      stream.on('error', (err: any) => {
        console.error('(SSH Stream Connection)', err);
        sendError(message, 'Could not connect to server');
        sshClient.end();
      });

      // It's optional to consume the stream's output
      stream.on('data', (data: any) => {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', (data: any) => {
        console.log('STDERR: ' + data);
      });
    });
  }).on('error', (err: any) => {
    // Handle SSH connection errors
    console.error('(SSH Connection)', err);
    sendError(message, 'Could not connect to server');
  }).connect(sshConfig);
}