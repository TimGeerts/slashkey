const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { closeEmbed, updateEmbed } = require('../../utils/embed');
const { logDebug } = require('../../utils/logger');
const { validateSettings } = require('../../utils/settings');

const { getGuild } = require('../../utils/db');

const collectorTimeOut = 600_000;
const dungeons = [
    `Atal'Dazar`, `Blackrook Hold`, `Darkheart Thicket`, `Dawn: Galakrond's Fall`, `Dawn: Murozond's Rise`, `The Everbloom`, `Throne of the Tides`, `Waycrest Manor`
]
const Emoji = {
    Tank: '🛡️',
    Healer: '🇨🇭',
    Dps: '⚔️'
}
const yesno = [{name: 'Yes',value: 1}, { name: 'No',value: 0}]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('key')
        .setDescription('Start a mythic+ run')
        .addStringOption(option => 
            option.setName('dungeon')
                .setDescription('The dungeon you want to run')
                .setRequired(true)
                .addChoices(
                    ...dungeons.map(d => { return { name: d, value: d}})
                )
        )
        .addNumberOption(option =>
            option.setName('level')
                .setDescription('The level of key you want to run')
                .setRequired(true)
                .setMinValue(2)
        )
        .addNumberOption(option =>
            option.setName('tank')
                .setDescription('Do you need a tank?')
                .setRequired(true)
                .addChoices(...yesno)
        )
        .addNumberOption(option =>
            option.setName('healer')
                .setDescription('Do you need a healer?')
                .setRequired(true)
                .addChoices(...yesno)
        )
        .addNumberOption(option =>
            option.setName('dps')
                .setDescription('How many dps do you need?')
                .setRequired(true)
                .setMaxValue(3)
                .setMinValue(0)
        )
        .addStringOption(option => 
            option.setName('remark')
                .setDescription('Add an (optional) description for the run')
        ),

    run: async ({ interaction }) => {
        const guild = interaction.guild;
        const guildId = guild.id;
        const guildSettings = await getGuild(guildId);

        if(!guildSettings) {
            interaction.reply(`Configuration for your server wasn't found.\nPlease have an administrator run the \`/configure\` command first.`)
            return;
        }
        // if the settings are found, validate them (check roles and shit)
        const validations = validateSettings(guildSettings, interaction.guild);
        if(validations?.length) {
            validations.push('\n**Please have an administrator run the \`/configure\` command again.**')
            const validationMessages = validations.join('\n');
            interaction.reply(`**The SlashKey bot isn't configured correctly!**\n${validationMessages}`);
            return;
        }
        // all settings are present and have been validated, continue with the command
        logDebug(`\`/key\` SlashCommand executed`, guild);
        logDebug(`args: \`${JSON.stringify(interaction.options)}\``, guild);
        const dungeon = interaction.options.get('dungeon').value;
	    const keyLevel = interaction.options.get('level').value;
	    const tankNeeded = interaction.options.get('tank').value;
	    const healerNeeded = interaction.options.get('healer').value;
	    const dpsCount = interaction.options.get('dps').value;
        const remark = interaction.options.get('remark')?.value;
        const title = `[LFG] ${dungeon} +${keyLevel}`;
        let rolesMissing = [];

        const embed = new EmbedBuilder()
            .setColor('#e6cc80')
            .setTimestamp()
            .setTitle(title)
            .setDescription(remark ? remark : ' ')
            .addFields(
                {name: '\u200B', value: '\u200B', inline: true }
            );
        
        // is a tank needed?
        if(tankNeeded) {
            rolesMissing.push({ id: guildSettings.tankRole, name: 'Tank', emoji: Emoji['Tank']});
            embed.addFields({ name: Emoji['Tank'], value: '...' });
        }
        // is a healer needed?
        if(healerNeeded) {
            rolesMissing.push({ id: guildSettings.healerRole, name: 'Healer', emoji: Emoji['Healer']});
            embed.addFields({ name: Emoji['Healer'], value: '...' });
        }
        // are dps needed?
        if(dpsCount > 0) {
            rolesMissing.push({ id: guildSettings.dpsRole, name: 'Dps', emoji: Emoji['Dps']});
            embed.addFields({ name: Emoji['Dps'], value: '...' });
        }

        logDebug(`missing roles: \`${JSON.stringify(rolesMissing)}\``, guild);
        const pingString = rolesMissing.map((r) => `<@&${r.id}>`).join(" ");
        logDebug(`generated pingstring \`${pingString}\``, guild);
        await interaction.reply({ 
            content: `Setting up a key for ${dungeon} +${keyLevel}\nGood luck and have fun!\n*I hope you're popular enough so people join!*`, 
            ephemeral: true 
        });
        logDebug(`sent ephemeral message`, guild);
        let pingMessage = await interaction.channel.send(pingString);
        logDebug(`sent pingstring`, guild);
        const message = await interaction.channel.send({ embeds: [embed]});
        logDebug(`sent embed message`, guild);
        
        // add role reactions
        rolesMissing.forEach((r) => {
            message.react(r.emoji);
            logDebug(`added reaction for \`${JSON.stringify(r.name)}\` using emoji ${r.emoji}`, guild);
        });

        // add generic lock reactions
        message.react('🔒');
        logDebug(`added reaction for \`"Close"\` using emoji 🔒`, guild);
        
        // set up reaction object for filtering so nothing else triggers the collector
        const allowedReactions = [...rolesMissing.map((r) => r.emoji), '🔒'];
        
        
        // create collector to 'act' on reactions
        // filter it to only look for reactions that are defined in the 'allowedReactions' array, and not done by a bot
        const filter = (reaction, user) => {
            return !user.bot && allowedReactions.includes(reaction.emoji.name)
        };
        const collector = message.createReactionCollector({
            filter,
            time: collectorTimeOut,
            dispose: true
        })

        collector.on('collect', async (reaction, user) => {
            logDebug(`reaction \`${reaction.emoji.name}\` collected for user \`${user.id}\``, guild);
            // check if the user is the author of the interaction
            const userIsAuthor = user.id === interaction.user.id;
            // check if the user has the developer role (devRole)
            const memberForUser = await interaction.guild.members.fetch(user.id);
            const userHasDevRole = memberForUser.roles.cache.some((r) => r.id === guildSettings.devRole);

            logDebug(`userIsAuthor: \`${userIsAuthor}\` - userHasDevRole \`${userHasDevRole}\``, guild);

            switch(reaction.emoji.name) {
                case '🔒':
                    if(userIsAuthor || userHasDevRole) {
                        pingMessage.delete();
                        pingMessage = null;
                        closeEmbed(embed);
                        message.reactions.removeAll();
                        message.edit({ embeds: [embed] });
                        logDebug(`message closed and reactions removed`, guild);
                    } else {
                        // ignore the reaction
                        reaction.users.remove(user);
                        logDebug(`user \`${user.id}\` not allowed to use '🔒' reaction`, guild);
                    }
                    break;
                default: 
                    // get the role to assign based on the emoji
                    const roleToAssign = rolesMissing.find((r) => r.emoji === reaction.emoji.name);                   
                    // add chosen reaction
                    updateEmbed(embed, user.id, roleToAssign.emoji);
                    message.edit({ embeds: [embed] });
                    logDebug(`user \`${user.id}\` has been assigned the \`${roleToAssign.name}\` role`, guild);
                    break;
            }
        })

        collector.on('remove', (reaction, user) => {
            if(reaction.emoji.name === '🔒') return;
            const roleToRemove = rolesMissing.find((r) => r.emoji === reaction.emoji.name); 
            updateEmbed(embed, user.id, roleToRemove.emoji, false);
            message.edit({ embeds: [embed] });
            logDebug(`rolereaction \`${roleToRemove.name}\` has been removed for user \`${user.id}\``, guild);
        })
        
        collector.on('end', () => {
            if(!pingMessage) return;
            pingMessage.delete();
            closeEmbed(embed);
            message.reactions.removeAll();
            message.edit({ embeds: [embed] })
            logDebug(`collector timed out, removed reactions and closed message`, guild);
        })
    },
 
    options: {
        deleted: false, 
    },
};