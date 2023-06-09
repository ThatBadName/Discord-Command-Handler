const fs = require('fs')
const path = require('path')
const {
  Collection
} = require('discord.js')
const loadEvents = require(`./handlers/handleEvents`)
const loadCommands = require(`./handlers/handleCommands`)
const loadComponents = require(`./handlers/handleComponents`)

const generateId = require('./functions/generateId')
const commandInvokedChecks = require('./functions/commandChecks')
const cooldowns = require('./functions/cooldown')

const DiscordCommandHandler = async (
  client, {
    mainDir = __dirname,
    configFile = 'config.json',
    commandsDir = '/commands',
    eventsDir = '/events',
    databaseDir = '',
    components = {
      main: '/components',
      buttons: '/buttons',
      selectMenus: '/selectMenus'
    },
    builtIn =  {
      automaticRepair: true,
      helpCommand: true
    },
    ownerIds = [],
    ownerOnlyMessage = 'This command is owner only',
    cooldownMessage = 'Please try again <t:{time}:R>',
    prefix = '!',
    allowPrefixCommands = false,
  }
) => {
  // Check that everything is valid  
  if (!mainDir) {
    throw new TypeError(`[Handler] Please provide a mainDir`)
  } else if (!fs.lstatSync(mainDir).isDirectory()) {
    throw new TypeError(`[Handler] mainDir must be a directory. Please set it to "__dirname"`)
  }
  if (!client) {
    throw new Error(`[Handler] Please provide a Discord client`)
  }

  const config = JSON.parse(fs.readFileSync(`${path.join(mainDir)}/${configFile}`))
  if (!config.token) {
    throw new Error(`[Handler] Please provide a valid bot token in your config file: "token":"<token>"`)
  }
  if (!config.clientId) {
    throw new Error(`[Handler] Please provide a valid client id in your config file: "clientId":"<id>"`)
  }
  if (!config.testGuildId) {
    throw new Error(`[Handler] Please provide a valid test server id in your config file: "testGuildId":"<id>"`)
  }
  // Everything is vaild

  console.log(`[Handler] Setup has been done correctly. Starting bot`)

  client.config = require(path.join(mainDir, configFile))
  client.commands = new Collection()
  client.buttons = new Collection()
  client.selectMenus = new Collection()
  client.cooldowns = new Collection()
  client.globalCommandArray = []
  client.localCommandArray = []

  const component = {
    ...components
  }

  const built = {
    ...builtIn
  }

  if (built.automaticRepair === true) {
    if (!fs.existsSync(`${path.join(mainDir, commandsDir)}`)) {
      fs.mkdirSync(`${path.join(mainDir, commandsDir)}`)
      console.log(`[AutoRepair] Created commands dir`)
    }

    if (!fs.existsSync(`${path.join(mainDir, eventsDir)}`)) {
      fs.mkdirSync(`${path.join(mainDir, eventsDir)}`)
      console.log(`[AutoRepair] Created events dir`)
    }

    if (!fs.existsSync(`${path.join(mainDir, component.main)}`)) {
      fs.mkdirSync(`${path.join(mainDir, component.main)}`)
      console.log(`[AutoRepair] Created components dir`)
    }

    if (!fs.existsSync(`${path.join(mainDir, component.main, component.buttons)}`)) {
      fs.mkdirSync(`${path.join(mainDir, component.main, component.buttons)}`)
      console.log(`[AutoRepair] Created components/buttons dir`)
    }

    if (!fs.existsSync(`${path.join(mainDir, component.main, component.selectMenus)}`)) {
      fs.mkdirSync(`${path.join(mainDir, component.main, component.selectMenus)}`)
      console.log(`[AutoRepair] Created components/selectMenus dir`)
    }

    if (!fs.existsSync(`${path.join(mainDir, eventsDir)}/client`)) {
      fs.mkdirSync(`${path.join(mainDir, eventsDir)}/client`)
      console.log(`[AutoRepair] Created events/client dir`)
    }

    if (built.helpCommand===true && !fs.existsSync(`${path.join(mainDir, commandsDir)}/Misc`)) {
      fs.mkdirSync(`${path.join(mainDir, commandsDir)}/Misc`)
      console.log(`[AutoRepair] Created commands/Misc dir`)
    }

    if (built.helpCommand===true && !fs.existsSync(`${path.join(mainDir, commandsDir)}/Misc/help.js`)) {
      fs.writeFileSync(`${path.join(mainDir, commandsDir)}/Misc/help.js`, fs.readFileSync(`${path.join(__dirname)}/defaultFiles/help.js`, 'utf8'))
      console.log(`[AutoRepair] Created commands/Misc/help.js file`)
    }

    if (!fs.existsSync(`${path.join(mainDir, eventsDir)}/client/ready.js`)) {
      fs.writeFileSync(`${path.join(mainDir, eventsDir)}/client/ready.js`, fs.readFileSync(`${path.join(__dirname)}/defaultFiles/ready.js`, 'utf8'))
      console.log(`[AutoRepair] Created events/client/ready.js file`)
    }

    if (!fs.existsSync(`${path.join(mainDir, eventsDir)}/client/interactionCreate.js`)) {
      fs.writeFileSync(`${path.join(mainDir, eventsDir)}/client/interactionCreate.js`, fs.readFileSync(`${path.join(__dirname)}/defaultFiles/interactionCreate.js`, 'utf8'))
      console.log(`[AutoRepair] Created events/client/interactionCreate.js file`)
    }

    if (allowPrefixCommands===true && !fs.existsSync(`${path.join(mainDir, eventsDir)}/client/messageCreate.js`)) {
      fs.writeFileSync(`${path.join(mainDir, eventsDir)}/client/messageCreate.js`, fs.readFileSync(`${path.join(__dirname)}/defaultFiles/messageCreate.js`, 'utf8'))
      console.log(`[AutoRepair] Created events/client/messageCreate.js file`)
    }
  }

  loadEvents(client, mainDir, eventsDir)
  loadComponents(client, mainDir, component.main)
  loadCommands(client, mainDir, commandsDir, config)
  client.dirs = {
    main: mainDir,
    commands: commandsDir,
    events: eventsDir,
    database: databaseDir
  }
  client.ownerIds = ownerIds
  client.ownerOnlyMessage = ownerOnlyMessage
  client.cooldownMessage = cooldownMessage
  client.prefix = prefix
  client.allowPrefixCommands = allowPrefixCommands
  client.login(config.token).catch((err) => {
    console.warn(err)
    throw new Error(`[Handler] Please check that your bot token is valid`)
  })
}

module.exports.main = {
  DiscordCommandHandler,
  commandInvokedChecks,
  cooldowns
}

module.exports.functions = {
  generateId
}