module.exports = {
  validateSettings: (settings, guild) => {
    // first validate if all properties are available
    let ret = [];
    const settingsToCheck = [
      'devRoleId',
      'tankRoleId',
      'healerRoleId',
      'dpsRoleId',
      'logChannelId',
    ];
    settingsToCheck.forEach((s) => {
      if (!Object.hasOwn(settings, s)) {
        ret.push(`* The property \`${s}\` is undefined`);
      }
    });
    // I could make all of these "else if" statements, but I'd rather have the complete validation message in one go
    if (!roleExists(settings.devRoleId, guild)) {
      ret.push(
        `* The role \`${settings.devRole}\` does not match a role on your server`
      );
    }
    if (!roleExists(settings.tankRoleId, guild)) {
      ret.push(
        `* The role \`${settings.tankRole}\` does not match a role on your server`
      );
    }
    if (!roleExists(settings.healerRoleId, guild)) {
      ret.push(
        `* The role \`${settings.healerRole}\` does not match a role on your server`
      );
    }
    if (!roleExists(settings.dpsRoleId, guild)) {
      ret.push(
        `* The role \`${settings.dpsRole}\` does not match a role on your server`
      );
    }
    if (!channelExists(settings.logChannelId, guild)) {
      ret.push(
        `* The channel \`${settings.logChannel}\` does not match a channel on your server`
      );
    }
    return ret;
  },
};

function roleExists(role, guild) {
  return !!guild.roles.cache.find((r) => r.id === role);
}
function channelExists(channel, guild) {
  return !!guild.channels.cache.find((c) => c.id === channel);
}
