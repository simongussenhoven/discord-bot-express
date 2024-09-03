module.exports = {
  apps: [
    {
      name: "discord-bot",
      script: "./src/app.ts",
      interpreter: "node",
      interpreterArgs: "--import tsx",
    },
  ],
};
