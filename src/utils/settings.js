const fetch = require("node-fetch");

const API_URL = 'https://slashkey-cb817-default-rtdb.europe-west1.firebasedatabase.app/'
const SETTINGS_URL = `${API_URL}settings`;
let SETTINGS_CACHE = null;

module.exports = {
  loadSettings: async () => {
    try {
      console.log('loading all settings into cache');
      const response = await fetch(`${SETTINGS_URL}.json`);
      SETTINGS_CACHE = await response.json();
      console.log(`settings loaded, found settings for ${Object.keys(SETTINGS_CACHE).length} guild(s)`);
      return;
    } catch (error) {
      console.log(error);
    }
  },
  getSettings: async (guildId) => {
    if(!SETTINGS_CACHE || !SETTINGS_CACHE[guildId]) {
      await module.exports.loadSettings();
    }
    return new Promise((resolve) => {
      resolve(SETTINGS_CACHE[guildId])
    });
    
  },
  putSettings: (guildId, settings) => {
    return fetch(`${SETTINGS_URL}/${guildId}.json`, {
      method: "put",
      body: JSON.stringify(settings),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => {
        SETTINGS_CACHE[guildId] = settings;
        return r.json();
      })
      .catch((error) => console.log(error));
  },
  deleteSettings: (guildId) => {
    return fetch(`${SETTINGS_URL}/${guildId}.json`, {
      method: "delete",
    })
      .then((r) => {
        delete SETTINGS_CACHE[guildId];
        return r.json();
      })
      .catch((error) => console.log(error));
  },
  validateSettings: (settings, guild) => {
    // first validate if all properties are available
    let ret = [];
    const settingsToCheck = ['devRole', 'tankRole', 'healerRole', 'dpsRole', 'logChannelId'];
    settingsToCheck.forEach(s => {
      if(!Object.hasOwn(settings, s)) {
        ret.push(`* The property \`${s}\` is undefined`);
      }
    })
    // I could make all of these "else if" statements, but I'd rather have the complete validation message in one go
    if (!roleExists(settings.devRole, guild)) {
      ret.push(`* The property \`devRole\` does not match a role on your server`);
    }
    if (!roleExists(settings.tankRole, guild)) {
      ret.push(`* The property \`tankRole\` does not match a role on your server`);
    }
    if (!roleExists(settings.healerRole, guild)) {
      ret.push(`* The property \`healerRole\` does not match a role on your server`);
    }
    if (!roleExists(settings.dpsRole, guild)) {
      ret.push(`* The property \`dpsRole\` does not match a role on your server`);
    }
    if (!channelExists(settings.logChannelId, guild)) {
      ret.push(`* The property \`logChannelId\` does not match a channel on your server`);
    }
    return ret;
  }
}

function roleExists(roleId, guild) {
  return !!guild.roles.cache.find(r => r.id === roleId);
}
function channelExists(channelId, guild) {
  return !!guild.channels.cache.find(c => c.id === channelId);
}