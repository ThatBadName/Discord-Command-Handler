const fs = require('fs')
const path = require('path')

module.exports = (client, mainDir, eventsDir, directory = ["./events"]) => {
  const loadEvents = async () => {
    const eventFolders = fs.readdirSync(path.join(mainDir, eventsDir))
    console.log(`[Events] Started loading events`)
    for (const folder of eventFolders) {
      const eventFiles = fs.readdirSync(`${path.join(mainDir, eventsDir)}/${folder}`).filter(file => file.endsWith('.js'))
      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            const event = require(`${path.join(mainDir, eventsDir)}/${folder}/${file}`)
            if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
            else client.on(event.name, (...args) => event.execute(...args, client))
          }
          break

        default:
          break
      }
    }
    console.log(`[Events] Finished loading events`)
  }

  const loadingEvents = directory.map((dirs) => {
    loadEvents(dirs)
  })

  Promise.all(loadingEvents)
}