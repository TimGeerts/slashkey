const { devRole, tankRole, healerRole, dpsRole, logChannelId, debugEnabled } = require('../../config.json');

let _logChannel = null;

module.exports = {
    init: async (client) => {
        const channel = await client.channels.cache.find(
            (c) => c.id === logChannelId && c.type === 0
          );
          if (channel) {
            _logChannel = channel;
          }
    },
    logStart: (message) => {
        log(`:robot: ${message}`);
    },
    logSuccess: (message) => {
        log(`:white_check_mark: ${message}`);
    },
    logError: (message) => {
        log(message, "ERROR", true);
    },
    logDebug: (message) =>  {
        if (debugEnabled && debugEnabled === "true") {
            log(message, "DEBUG", true);
        }
    },
    hasDevRole: async (userId, guild) => {
        const memberForUser = await guild.members.fetch(userId);
        return memberForUser.roles.cache.some((r) => r.id === devRole);
    },
    getPingStringForRoles: (roles) => {
        const idsToMention = [];
        if(roles.includes('Tank')) {
            idsToMention.push(tankRole);
        }
        if(roles.includes('Healer')) {
            idsToMention.push(healerRole);
        }
        if(roles.includes('Dps')) {
            idsToMention.push(dpsRole);
        }
        return idsToMention.map((id) => `<@&${id}>`).join(" ");
    }
}

function log(message, prefix, timestamp) {
    if (prefix) {
        prefix = `[${prefix}] - `;
      } else {
        prefix = "";
      }
      if (timestamp) {
        prefix += `[${new Date().toISOString()}]\n`;
      }
      if (_logChannel) {
        _logChannel.send(`${prefix}${message}`);
      } else {
        console.log(`${prefix}${message}`);
      }
}