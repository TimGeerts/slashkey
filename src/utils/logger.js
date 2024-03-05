const { getSettings } = require("./settings");

module.exports = {
    log: async (message, prefix, guild = null) => {
        const guildSettings = await getSettings(guild.id);
        const logChannel = guild.channels.cache.find(c => c.id === guildSettings.logChannelId);
        const timestamp = `[${new Date().toISOString()}]`;
        const msg = `${prefix} - ${timestamp}\n${message}`;
        if(logChannel) {
            logChannel.send(msg);
        } else {
            console.log(msg);
        }
    },
    logError: (message, guild) => {
        module.exports.log(message, ':red_circle: ERROR', guild);
    },
    logDebug: async (message, guild) => {
        const guildSettings = await getSettings(guild.id);
        if(guildSettings?.debugEnabled === 'true') {
            module.exports.log(message, ':orange_circle: DEBUG', guild);
        }
    }
}