const commandInvokedChecks = require('@thatbadname/discord-command-handler')

module.exports = {
  name: 'messageCreate',
  once: false,

  async execute(message, client) {
    if (!client.allowPrefixCommands) return
    if (!message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(client.prefix)) return
    const {
      commands
    } = client
    const commandName = message.content.replace(`<@${client.user.id}>`, '').replace(client.prefix, '').split(' ')[0]

    const command = commands.get(commandName)
    if (!command || !(command.slash === false)) return
    const checks = commandInvokedChecks.main.commandInvokedChecks(client, command, message.author.id)
    if (checks.ownerCheck) return message.reply({
      content: client.ownerOnlyMessage
    })
    if (checks.cooldown.active) return message.reply({
      content: client.cooldownMessage.replaceAll('{time}', `${checks.cooldown.personal}`)
    })
    const args = message.content.replace(`<@${client.user.id}>`, '').replace(client.prefix, '').split(' ').slice(1)

    try {
      await command.execute(message, args, client)
    } catch (error) {
      console.error(error)
    }
  }
}