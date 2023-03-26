const fs = require('fs')
const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js')

module.exports = {
  testOnly: true,
  ownerOnly: false,
  hide: false,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of all bot commands')
    .setDMPermission(false),

  async execute(interaction, client) {
    const helpEmbed = new EmbedBuilder()
      .setTitle(`${client.user.username} Help Menu`)

    for (const folder of fs.readdirSync(`./commands`, 'ascii')) {
      helpEmbed.addFields({
        name: `${folder}`,
        value: `${
          fs.readdirSync(`./commands/${folder}`, 'ascii')
            .map((file) => {
              const cmd = require(`../../commands/${folder}/${file}`)
              return cmd.hide === false ? `\`${cmd.data.name}\`` : ''
            })
            .join(`, `)
            .length === 0 ? 'No Commands' : fs.readdirSync(`./commands/${folder}`, 'ascii')
              .map((file) => {
                const cmd = require(`../../commands/${folder}/${file}`)
                return cmd.hide === false ? `\`${cmd.data.name}\`` : ''
              })
              .join(`, `)
            }`,
        inline: true
      })
    }

    interaction.reply({
      embeds: [
        helpEmbed
      ]
    })
  }
}