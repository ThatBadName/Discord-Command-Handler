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
        const command = require(`${path.join(mainDir, commandDir)}/${folder}/${file}`)
        if (command.testOnly === true) {
          commands.set(command.data.name, command)
          localCommandArray.push(command.data.toJSON())
        } else {
          commands.set(command.data.name, command)
          globalCommandArray.push(command.data.toJSON())
        }
      }
    }

    const rest = new REST({
      version: "10"
    }).setToken(config.token)
    try {
      console.log(`[Global Handler] Started refreshing (/) commands`)

      if (client.globalCommandArray.length >= 0) await rest.put(
        Routes.applicationCommands(config.clientId), {
          body: client.globalCommandArray
        }
      )
      console.log(`[Global Handler] Successfully reloaded (/) commands`)
      console.log(`[Local Handler] Started refreshing (/) commands`)

      if (client.localCommandArray.length >= 0) await rest.put(
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