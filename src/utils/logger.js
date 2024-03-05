const { ChannelType } = require('discord.js');

module.exports = {
    getLogChannel: (guildConfiguration, guild) => {
        try {
            let ret = null;
            if(guildConfiguration?.id && guildConfiguration?.logChannelId) {
                ret = guild.channels.cache.find(c => c.id === guildConfiguration.logChannelId && c.type === ChannelType.GuildText);
            }
            return ret;
        } catch (error) {
            console.log(error);
        }
    },
    logError: (message, channel) => {
        module.exports.log(message, ':red_circle: ERROR', channel);
    },
    logDebug: (message, guildConfiguration, channel) => {
        if(guildConfiguration?.id && guildConfiguration?.debugEnabled === true) {
            module.exports.log(message, ':orange_circle: DEBUG', channel);
        }
        // if(guildSettings?.debugEnabled === 'true') {
        //     module.exports.log(message, ':orange_circle: DEBUG', channel);
        // }
    },
    log: async (message, prefix, channel = null) => {
        const timestamp = `[${new Date().toISOString()}]`;
        const msg = `${prefix} - ${timestamp}\n${message}`;
        if(channel) {
            channel.send(msg);
        } else {
            console.log(msg);
        }
    }
}