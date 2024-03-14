const { setGuild } = require('../../utils/db');

module.exports = async (guild) => {
  console.log(`SlashBot joined a new guild "${guild.name}" (${guild.id}).`);
  await setGuild({ id: guild.id, guildName: guild.name });
};
