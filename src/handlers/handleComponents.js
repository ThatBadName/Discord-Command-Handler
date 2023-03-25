const fs = require('fs')
const path = require('path')

module.exports = (client, mainDir, componentDir, buttonDir, selectDir, directory = ["./events"]) => {
  const loadComponents = async () => {
    const componentFolders = fs.readdirSync(path.join(mainDir, componentDir))
    console.log(`[Components] Started loading components`)
    for (const folder of componentFolders) {
      const componentFiles = fs.readdirSync(`${path.join(mainDir, componentDir)}/${folder}`).filter(
        (file) => file.endsWith('.js')
      )

      const {
        buttons,
        selectMenus
      } = client

      switch (folder) {
        case "buttons":
          for (const file of componentFiles) {
            const button = require(`${path.join(mainDir, componentDir)}/${folder}/${file}`)
            buttons.set(button.data.name, button)
          }
          break

        case "selectMenus":
          for (const file of componentFiles) {
            const menu = require(`${path.join(mainDir, componentDir)}/${folder}/${file}`)
            selectMenus.set(menu.data.name, menu)
          }
          break

        default:
          break
      }
    }
    console.log(`[Components] Finished loading components`)
  }

  const loadingComponents = directory.map((dirs) => {
    loadComponents(dirs)
  })

  Promise.all(loadingComponents)
}