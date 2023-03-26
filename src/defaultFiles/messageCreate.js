module.exports = {
  name: 'messageCreate',
  once: false,

  async execute(message, client) {
    if (!message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(client.prefix)) return
    const {
      commands
    } = client
    const {
      commandName
    } = message.content.split(' ')[1]

    const command = commands.get(commandName)
    if (!command || command.slash===false) return
    const checks = commandInvokedChecks.main.commandInvokedChecks(client, command, interaction.user.id)
    if (checks.ownerCheck) return message.reply({content: client.ownerOnlyMessage})
    if (checks.cooldown.active) return message.reply({content: client.cooldownMessage.replaceAll('{time}', `${checks.cooldown.personal}`)})
    const args = message.content.split(' ').slice(1)

    try {
      await command.execute(message, args, client)
    } catch (error) {
      console.error(error)
    }
  }
}