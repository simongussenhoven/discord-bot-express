module.exports = {
  apps: [
    {
      name: "discord-bot",
      script: "./src/app.ts",
      interpreter: "npx",
      interpreterArgs: "ts-node",
    },
  ],
};
