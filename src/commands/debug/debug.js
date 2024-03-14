const { SlashCommandBuilder } = require('discord.js');

const { getGuild, setGuild } = require('../../utils/db');

const yesno = [
  { name: 'Yes', value: 1 },
  { name: 'No', value: 0 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Allows you to enable/disable debugging for the bot')
    .addNumberOption((option) =>
      option
        .setName('enable')
        .setDescription('Do you want to enable debugging?')
        .setRequired(true)
        .addChoices(...yesno)
    ),

  run: async ({ interaction }) => {
    let commandAllowed = false;
    const guild = interaction.guild;
    const guildId = guild.id;
    const guildSettings = await getGuild(guildId);

    if (!guildSettings) {
      interaction.reply(
        `Configuration for your server wasn't found.\nPlease have an administrator run the \`/configure\` command first.`
      );
      return;
    }

    if (guildSettings.devRoleId) {
      // if there's saved guildsettings, check if the user has the dev role to execute this command
      const memberForUser = await interaction.guild.members.fetch(
        interaction.user.id
      );
      commandAllowed = memberForUser.roles.cache.some(
        (r) => r.id === guildSettings.devRoleId
      );
    } else {
      interaction.reply(
        `The \`BOT MAINTAINER ROLE\` for your server wasn't found.\nPlease have an administrator run the \`/configure\` command.`
      );
      return;
    }

    if (!commandAllowed) {
      interaction.reply({
        content:
          "You don't have the correct role to execute the `/debug` command.",
        ephemeral: true,
      });
      return;
    }

    const enable = !!(interaction.options.get('enable').value === 1);
    const configuration = {
      id: guildId,
      debugEnabled: enable,
    };
    await setGuild(configuration);
    const reply = enable
      ? `Debugging is now enabled for this server, things might get hectic! :scream:`
      : `Debugging has been disabled for this server.`;
    interaction.reply({
      content: reply,
      ephemeral: true,
    });
  },

  options: {
    deleted: false,
  },
};
