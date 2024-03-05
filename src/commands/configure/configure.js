const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
const { validateSettings } = require('../../utils/settings');
const { logError, getLogChannel } = require('../../utils/logger');
const { getGuild, setGuild } = require('../../utils/db');

const inputFields = [
  {
    customId: 'devRole',
    label: 'Bot maintainer role (id)',
  },
  {
    customId: 'tankRole',
    label: 'Tank role (id)',
  },
  {
    customId: 'healerRole',
    label: 'Healer role (id)',
  },
  {
    customId: 'dpsRole',
    label: 'Dps role (id)',
  },
  {
    customId: 'logChannelId',
    label: 'Log channel (id)',
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('configure')
    .setDescription('Shows a modal to configure the bot settings'),

  run: async ({ interaction }) => {
    // initially allow the command by default
    let commandAllowed = true;
    const guild = interaction.guild;
    const guildId = guild.id;
    const guildSettings = await getGuild(guildId);

    if (guildSettings && guildSettings.devRole) {
      // if there's saved guildsettings, check if the user has the dev role to execute this command
      const memberForUser = await interaction.guild.members.fetch(
        interaction.user.id
      );
      commandAllowed = memberForUser.roles.cache.some(
        (r) => r.id === guildSettings.devRole
      );
    }

    if (!commandAllowed) {
      interaction.reply({
        content:
          "You don't have the correct role to execute the `/configure` command.",
        ephemeral: true,
      });
      return;
    }

    const logChannel = getLogChannel(guildSettings, guild);
    const modal = new ModalBuilder({
      customId: `settings-modal-${interaction.id}-${interaction.user.id}`,
      title: 'Configure SlashKey',
    });

    const rows = [];

    inputFields.forEach((field) => {
      const val =
        guildSettings && guildSettings[field.customId]
          ? guildSettings[field.customId]
          : '';
      const t = new TextInputBuilder({
        customId: field.customId,
        label: field.label,
        value: val,
        style: TextInputStyle.Short,
      }).setRequired(true);
      const row = new ActionRowBuilder().addComponents(t);
      rows.push(row);
    });

    modal.addComponents(...rows);
    await interaction.showModal(modal);
    // wait for the modal to be submitted
    await interaction
      .awaitModalSubmit({
        filter: (i) =>
          i.customId ===
          `settings-modal-${interaction.id}-${interaction.user.id}`,
        time: 300_000,
      })
      .then(async (modalInteraction) => {
        const configuration = {};
        inputFields.forEach((field) => {
          const val = modalInteraction.fields.getTextInputValue(field.customId);
          configuration[field.customId] = val;
        });
        configuration['debugEnabled'] = 'false';
        configuration['id'] = guildId;
        await setGuild(configuration);
        const validations = validateSettings(configuration, guild);

        let reply =
          ':white_check_mark: Your configuration has been saved and validated.';
        if (validations?.length) {
          validations.push(
            '\n**Please run the `/configure` command again to fix the errors.\nThe bot will not run correctly until these issues are resolved.**'
          );
          const validationMessages = validations.join('\n');
          reply = `:x: **Your configuration has some validation errors**\n${validationMessages}`;
        }
        modalInteraction.reply({
          content: reply,
          ephemeral: true,
        });
      })
      .catch((err) => {
        logError(err.message, logChannel);
      });
  },

  options: {
    deleted: false,
  },
};
