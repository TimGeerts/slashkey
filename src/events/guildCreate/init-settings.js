const { putSettings } = require('../../utils/settings');

module.exports = async (guild) => {
    console.log(`SlashBot joined a new guild "${guild.name}" (${guild.id}).`);
    await putSettings(guild.id, {
        devRole: "",
        tankRole: "",
        healerRole: "",
        dpsRole: "",
        logChannelId: "",
        debugEnabled: "false"
    });
};