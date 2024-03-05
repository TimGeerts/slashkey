const { deleteSettings } = require('../../utils/settings');

module.exports = async (guild) => {
    console.log(`SlashBot got removed from the guild "${guild.name}" (${guild.id}).`);
    await deleteSettings(guild.id);
};