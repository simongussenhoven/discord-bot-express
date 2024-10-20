module.exports = {
  apps: [
    {
      name: "discord-bot",
      script: "./src/app.ts",
      exec_mode: "fork", // default PM2 mode, can also be omitted
      interpreter: "npx",
      interpreterArgs: "ts-node",
    },
  ],
};