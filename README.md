# Discord.JS v14 Command Handler
This is an advanced command handler using Discord.js v14

## Installation
Run `npm i @thatbadname/discord-command-handler discord.js` in a console and you are done!

## Usage
We reccommend that you copy and paste the example index.js code bellow into your index.js file for your bot. This will automagically create all the files that your bot will need to function. 
### Cooldowns
Yep, there is a built in cooldown system. You can access it using
```js
const Handler = require("@thatbadname/discord-command-handler")
Handler.main.cooldown(client, key, {id: 0123456789012345678, personal: 0})
```
`client` is your discord.js client, `key` is, for example, the command name (it can also be a button id, ect), `{id}` is the id of the user you want to put on cooldown and `{personal}` is the cooldown time in seconds.


### Command Handler Options
```js
// The default values have been filled in

Handler.main.DiscordCommandHandler(client,  {
  mainDir: __dirname,
  // The main directory of your bot

  configFile: 'config.json',
  /* Your bots config file. This should be a .json file and should contain:
  {
    "token":"",
    "clientId":"",
    "testGuildId":""
  }
  where token is your bots token, clientId is your bots id and testGuildId is the main development/support server for your bot
  */
 
  eventsDir: '/events',
  // This is the directory where all your event folders should be. Default The structure should follow: mainDir/eventsDir/<folder>/<eventFile>

  commandsDir: '/commands',
  // This is the directory where all your event folders should be. The structure should follow: mainDir/commandDir/<folder>/<commandFile>

  components: {
    main: '/components',
    buttons: '/buttons',
    selectMenus: '/selectMenus'
  },
  // This is where component files should be stored. The structure should follow: mainDir/mainComponentDir/<buttonDir|selectMenuDir>/<componentFile>

  builtIn =  {
    automaticRepair: true,
    helpCommand: true
  },
  /*
  automaticRepair, when enabled will create all the files that your bot will need to function. We reccomend leaving this as true if this is your first time running the bot

  helpCommand, when true will create the help command and its parent directory. For this to work automaticRepair must also be enabled.
  */

  ownerIds = [],
  // Put any ids of users that you want to be able to run ownerOnly: true commands

  ownerOnlyMessage = 'This command is owner only',
  // This is the message that will be sent if a user tries to use an ownerOnly command

  cooldownMessage = 'Please try again <t:{time}:R>',
  // This is the message that will be sent if a user tries to use a command while they are on cooldown. {time} will be replaced with the epoch timestamp of when the cooldown ends
})
```
### Making a new command
Here is an example of a very simple ping pong command. For more advanced command creation check out the [Discord.JS docs](https://discordjs.guide/slash-commands/advanced-creation.html#adding-options)
```js
const {
  SlashCommandBuilder,
} = require('discord.js') // Require SlashCommandBuilder from discord.js

module.exports = {
  testOnly: true, // If true this command will only be available in your test server
  ownerOnly: false, // If true this command will only be runnable if the users id is part of ownerIds
  hide: false, // If true this command will be hidden from the built in help command
  data: new SlashCommandBuilder() // The data of the slash command
    .setName('ping') // The name of the command
    .setDescription('Pong!'), // The commands description

  async execute(interaction, client) {
    // Put your commands code here

    interaction.reply({
      content:
        `Pong!`
    }) // Reply to the interaction with "Pong!"
  }
}
```

### Making a new event
This is an example of a simple ready event
```js
module.exports = {
  name: 'ready', // The name of the event from the discord api
  once: true, // If true this event will only run once

  async execute(client) {
    // Put code to execute when this event is called here

    console.log(`[Startup] ${client.user.username} is online`)
  }
}
```

### Making a new (button) component
This is an example of a button component
```js
module.exports = {
  data: {
    name: 'example-button' // This is the custom ID of the button
  },

  async execute(interaction, client) {
    // Code to execute when the button is pressed

    interaction.reply({content: `You pressed a button!`})
  }
}
```

### Making a new (select menu) component
This is an example of a select menu component
```js
module.exports = {
  data: {
    name: 'example-selectMenu' // This is the custom ID of the select menu
  },

  async execute(interaction, client) {
    // Code to execute when the select menu is used

    interaction.reply({content: `You chose ${interaction.values[0]}`})
  }
}
```
### Example index.js
```js
const { Client, GatewayIntentBits } = require("discord.js")
const Handler = require("@thatbadname/discord-command-handler")
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
})

Handler.main.DiscordCommandHandler(client,  {
  mainDir: __dirname,
  configFile: 'config.json',
  eventsDir: '/events',
  commandsDir: '/commands',
  components: {
    main: '/components',
    buttons: '/buttons',
    selectMenus: '/selectMenus'
  }
})
```

## Functions
The package comes loaded with a few functions. These can be access using
```js
const Handler = require("@thatbadname/discord-command-handler")
Handler.functions
```
### Id Generation
You can use the generateId function to make an id
```js
// Usage
const Handler = require("@thatbadname/discord-command-handler")
Handler.functions.generateId(length, prefix)

// Example
const Handler = require("@thatbadname/discord-command-handler")
Handler.functions.generateId(5, 'D') // Returns something like: D-t76Kj
```
`length` is the length of id that you want, `prefix` is the prefix of the id