const fs = require('fs')
const {
  REST
} = require('@discordjs/rest')
const {
  Routes
} = require('discord-api-types/v10')
const path = require('path')

module.exports = (client, mainDir, commandDir, config, directory = ["./events"]) => {
  const loadCommands = async () => {
    const commandFolders = fs.readdirSync(path.join(mainDir, commandDir))
    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`${path.join(mainDir, commandDir)}/${folder}`).filter(file => file.endsWith('.js'))

      const {
        commands,
        globalCommandArray,
        localCommandArray
      } = client
      for (const file of commandFiles) {
        let command = require(`${path.join(mainDir, commandDir)}/${folder}/${file}`)
        command = {
          testOnly: command.testOnly || false,
          ownerOnly: command.ownerOnly || false,
          hide: command.hide || false,
          personalCooldown: command.personalCooldown || 0,
          slash: command.slash,
          // globalCooldown: command.globalCooldown || 0,
          // guildCooldown: command.guildCooldown || 0,
          data: command.data,
          execute: command.execute
        }

        commands.set(command.data.name, command)
        if (command.slash === true || command.slash === 'both' || command.slash === undefined) {
          if (command.testOnly === true) {
            localCommandArray.push(command.data.toJSON())
          } else {
            globalCommandArray.push(command.data.toJSON())
          }
        }
      }
    }

    const rest = new REST({
      version: "10"
    }).setToken(config.token)
    try {
      console.log(`[Global Handler] Started refreshing (/) commands`)

      if (client.globalCommandArray.length >= 1) await rest.put(
        Routes.applicationCommands(config.clientId), {
          body: client.globalCommandArray
        }
      )
      console.log(`[Global Handler] Successfully reloaded (/) commands`)
      console.log(`[Local Handler] Started refreshing (/) commands`)

      if (client.localCommandArray.length >= 1) await rest.put(
        Routes.applicationCommands(config.clientId, config.testGuild), {
          body: client.localCommandArray
        }
      )

      console.log(`[Local Handler] Successfully reloaded (/) commands`)
    } catch (error) {
      console.error(error)
    }
  }

  const loadingCommands = directory.map((dirs) => {
    loadCommands(dirs)
  })

  Promise.all(loadingCommands)
}