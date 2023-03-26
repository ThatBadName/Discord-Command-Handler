const { Collection } = require('discord.js')

function cooldown(client, key, cooldown = {id, personal}) {
  const { cooldowns } = client;

	if (!cooldowns.has(key)) {
		cooldowns.set(key, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(key);
	const defaultCooldownDuration = 0;
	const cooldownAmount = (cooldown.personal ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(cooldown.id)) {
		const expirationTime = timestamps.get(cooldown.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return {cancelCommand: true, expiredTimestamp}
		}
	}

	timestamps.set(cooldown.id, now);
	setTimeout(() => timestamps.delete(cooldown.id), cooldownAmount);
}

module.exports = cooldown