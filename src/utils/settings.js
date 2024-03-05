module.exports = {
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