const { loadSettings } = require("../../utils/settings");

module.exports = async (c) => {
    try {
        const allGuilds = c.guilds.cache.map(guild => `${guild.name} - ${guild.id}`);
        console.log(`${c.user.username} is online and being used in the ${allGuilds.length} guild(s)`);
        console.log(allGuilds.join('\n'));
        await loadSettings();
    } catch (error) {
        console.error(error);
    }
};