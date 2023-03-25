# Discord.JS v14 Command Handler
This is an advanced command handler using Discord.js v14

## Roadmap
- [ ] Built in blacklist system
- [ ] Built in functions

## Installation
Run `npm i @thatbadname/discord-command-handler discord.js` in a console and you are done!

## Usage
Use the example code bellow and it will automatically create the required files\
Rest coming soon

## Example index.js
```js
const { Client, GatewayIntentBits } = require("discord.js");
const Handler = require("@thatbadname/discord-command-handler");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
})

Handler(client,  {
  mainDir: __dirname,
  configFile: "config.json",
  token: "<bot_token>",
  handlerDir: `/handlers`,
  eventsDir: '/events',
  commandsDir: '/commands',
  components: {
    main: '/components',
    buttons: '/buttons',
    selectMenus: '/selectMenus'
  }
})
```