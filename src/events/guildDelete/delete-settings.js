const { removeGuild } = require('../../utils/db');

module.exports = async (guild) => {
  console.log(
    `SlashBot got removed from the guild "${guild.name}" (${guild.id}).`
  );
  removeGuild(guild.id);
};
