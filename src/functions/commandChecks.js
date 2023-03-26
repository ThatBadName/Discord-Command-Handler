const cooldown = require('../functions/cooldown')

function commandInvokedChecks(client, command, id) {
  let r = {
    ownerCheck: false,
    cooldown: {
      personal: null,
      // guild: 0,
      // global: 0,
      active: false,
      message: ''
    }
  }
  if (command.ownerOnly === true && !client.ownerIds.includes(id)) r.ownerCheck = true
  const cCooldown = cooldown(client, command.name, {id: id, personal: command.personalCooldown})
  if (cCooldown && cCooldown.cancelCommand===true) {
    r.cooldown.active = true
    r.cooldown.personal = cCooldown.expiredTimestamp
  }

  return r
}

module.exports = commandInvokedChecks