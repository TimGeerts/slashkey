const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { closeEmbed, updateEmbed } = require('../../utils/embed');
const { logDebug, getLogChannel } = require('../../utils/logger');
const { validateSettings } = require('../../utils/settings');

const { getGuild } = require('../../utils/db');

const collectorTimeOut = 600_000;
const dungeons = [
  `Atal'Dazar`,
  `Blackrook Hold`,
  `Darkheart Thicket`,
  `Dawn: Galakrond's Fall`,
  `Dawn: Murozond's Rise`,
  `The Everbloom`,
  `Throne of the Tides`,
  `Waycrest Manor`,
];
const Emoji = {
  Tank: '🛡️',
  Healer: '🇨🇭',
  Dps: '⚔️',
};
const yesno = [
  { name: 'Yes', value: 1 },
  { name: 'No', value: 0 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('key')
    .setDescription('Start a mythic+ run')
    .addStringOption((option) =>
      option
        .setName('dungeon')
        .setDescription('The dungeon you want to run')
        .setRequired(true)
        .addChoices(
          ...dungeons.map((d) => {
            return { name: d, value: d };
          })
        )
    )
    .addNumberOption((option) =>
      option
        .setName('level')
        .setDescription('The level of key you want to run')
        .setRequired(true)
        .setMinValue(2)
    )
    .addNumberOption((option) =>
      option
        .setName('tank')
        .setDescription('Do you need a tank?')
        .setRequired(true)
        .addChoices(...yesno)
    )
    .addNumberOption((option) =>
      option
        .setName('healer')
        .setDescription('Do you need a healer?')
        .setRequired(true)
        .addChoices(...yesno)
    )
    .addNumberOption((option) =>
      option
        .setName('dps')
        .setDescription('How many dps do you need?')
        .setRequired(true)
        .setMaxValue(3)
        .setMinValue(0)
    )
    .addStringOption((option) =>
      option
        .setName('remark')
        .setDescription('Add an (optional) description for the run')
    ),

  run: async ({ interaction }) => {
    const guild = interaction.guild;
    const guildId = guild.id;
    const guildSettings = await getGuild(guildId);

    if (!guildSettings) {
      interaction.reply(
        `Configuration for your server wasn't found.\nPlease have an administrator run the \`/configure\` command first.`
      );
      return;
    }
    // if the settings are found, validate them (check roles and shit)
    const validations = validateSettings(guildSettings, guild);
    if (validations?.length) {
      validations.push(
        '\n**Please have an administrator run the `/configure` command again.**'
      );
      const validationMessages = validations.join('\n');
      interaction.reply(
        `**The SlashKey bot isn't configured correctly!**\n${validationMessages}`
      );
      return;
    }
    // all settings are present and have been validated, continue with the command
    const logChannel = getLogChannel(guildSettings, guild);
    logDebug(`\`/key\` SlashCommand executed`, guildSettings, logChannel);
    logDebug(
      `args: \`${JSON.stringify(interaction.options)}\``,
      guildSettings,
      logChannel
    );
    const dungeon = interaction.options.get('dungeon').value;
    const keyLevel = interaction.options.get('level').value;
    const tankNeeded = interaction.options.get('tank').value;
    const healerNeeded = interaction.options.get('healer').value;
    const dpsCount = interaction.options.get('dps').value;
    const remark = interaction.options.get('remark')?.value;
    const title = `[LFG] ${dungeon} +${keyLevel}`;
    const rolesMissing = [];

    const embed = new EmbedBuilder()
      .setColor('#e6cc80')
      .setTimestamp()
      .setTitle(title)
      .setDescription(remark ? remark : ' ')
      .addFields({
        name: `Author of this run`,
        value: `<@${interaction.user.id}>`,
        inline: true,
      })
      .addFields({ name: '\u200B', value: 'Signups:', inline: false });

    // is a tank needed?
    if (tankNeeded) {
      rolesMissing.push({
        id: guildSettings.tankRoleId,
        name: 'Tank',
        emoji: Emoji['Tank'],
      });
      embed.addFields({ name: Emoji['Tank'], value: '...' });
    }
    // is a healer needed?
    if (healerNeeded) {
      rolesMissing.push({
        id: guildSettings.healerRoleId,
        name: 'Healer',
        emoji: Emoji['Healer'],
      });
      embed.addFields({ name: Emoji['Healer'], value: '...' });
    }
    // are dps needed?
    if (dpsCount > 0) {
      rolesMissing.push({
        id: guildSettings.dpsRoleId,
        name: 'Dps',
        emoji: Emoji['Dps'],
      });
      embed.addFields({ name: Emoji['Dps'], value: '...' });
    }

    logDebug(
      `missing roles: \`${JSON.stringify(rolesMissing)}\``,
      guildSettings,
      logChannel
    );
    const pingString = rolesMissing.map((r) => `<@&${r.id}>`).join(' ');
    logDebug(
      `generated pingstring \`${pingString}\``,
      guildSettings,
      logChannel
    );
    await interaction.reply({
      content: `Setting up a key for ${dungeon} +${keyLevel}\nGood luck and have fun!\n*I hope you're popular enough so people join!*`,
      ephemeral: true,
    });
    logDebug(`sent ephemeral message`, guildSettings, logChannel);
    let pingMessage = await interaction.channel.send(pingString);
    logDebug(`sent pingstring`, guildSettings, logChannel);
    const message = await interaction.channel.send({ embeds: [embed] });
    logDebug(`sent embed message`, guildSettings, logChannel);

    // add role reactions
    rolesMissing.forEach((r) => {
      message.react(r.emoji);
      logDebug(
        `added reaction for \`${JSON.stringify(r.name)}\` using emoji ${r.emoji}`,
        guildSettings,
        logChannel
      );
    });

    // add generic lock reactions
    message.react('🔒');
    logDebug(
      `added reaction for \`"Close"\` using emoji 🔒`,
      guildSettings,
      logChannel
    );

    // set up reaction object for filtering so nothing else triggers the collector
    const allowedReactions = [...rolesMissing.map((r) => r.emoji), '🔒'];

    // create collector to 'act' on reactions
    // filter it to only look for reactions that are defined in the 'allowedReactions' array, and not done by a bot
    const filter = (reaction, user) => {
      return !user.bot && allowedReactions.includes(reaction.emoji.name);
    };
    const collector = message.createReactionCollector({
      filter,
      time: collectorTimeOut,
      dispose: true,
    });

    collector.on('collect', async (reaction, user) => {
      logDebug(
        `reaction \`${reaction.emoji.name}\` collected for user \`${user.id}\``,
        guildSettings,
        logChannel
      );
      // check if the user is the author of the interaction
      const userIsAuthor = user.id === interaction.user.id;
      // check if the user has the developer role (devRole)
      const memberForUser = await interaction.guild.members.fetch(user.id);
      const userHasDevRole = memberForUser.roles.cache.some(
        (r) => r.id === guildSettings.devRoleId
      );

      logDebug(
        `userIsAuthor: \`${userIsAuthor}\` - userHasDevRole \`${userHasDevRole}\``,
        guildSettings,
        logChannel
      );

      let roleToAssign = {};
      switch (reaction.emoji.name) {
        case '🔒':
          if (userIsAuthor || userHasDevRole) {
            pingMessage.delete();
            pingMessage = null;
            closeEmbed(embed);
            message.reactions.removeAll();
            message.edit({ embeds: [embed] });
            logDebug(
              `message closed and reactions removed`,
              guildSettings,
              logChannel
            );
          } else {
            // ignore the reaction
            reaction.users.remove(user);
            logDebug(
              `user \`${user.id}\` not allowed to use '🔒' reaction`,
              guildSettings,
              logChannel
            );
          }
          break;
        default:
          // get the role to assign based on the emoji
          roleToAssign = rolesMissing.find(
            (r) => r.emoji === reaction.emoji.name
          );
          // add chosen reaction
          updateEmbed(embed, user.id, roleToAssign.emoji);
          message.edit({ embeds: [embed] });
          logDebug(
            `user \`${user.id}\` has been assigned the \`${roleToAssign.name}\` role`,
            guildSettings,
            logChannel
          );
          break;
      }
    });

    collector.on('remove', (reaction, user) => {
      if (reaction.emoji.name === '🔒') return;
      const roleToRemove = rolesMissing.find(
        (r) => r.emoji === reaction.emoji.name
      );
      updateEmbed(embed, user.id, roleToRemove.emoji, false);
      message.edit({ embeds: [embed] });
      logDebug(
        `rolereaction \`${roleToRemove.name}\` has been removed for user \`${user.id}\``,
        guildSettings,
        logChannel
      );
    });

    collector.on('end', () => {
      if (!pingMessage) return;
      pingMessage.delete();
      closeEmbed(embed);
      message.reactions.removeAll();
      message.edit({ embeds: [embed] });
      logDebug(
        `collector timed out, removed reactions and closed message`,
        guildSettings,
        logChannel
      );
    });
  },

  options: {
    deleted: false,
  },
};
