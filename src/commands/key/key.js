const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { closeEmbed, updateEmbed } = require('../../utils/embed')
const { getEmojiForRole, getRoleForEmoji } = require('../../utils/emoji')
const { hasDevRole, getPingStringForRoles, logDebug } = require('../../utils/utils');

const collectorTimeOut = 600000;
const dungeons = [
    `Atal'Dazar`, `Blackrook Hold`, `Darkheart Thicket`, `Dawn: Galakrond's Fall`, `Dawn: Murozond's Rise`, `The Everbloom`, `Throne of the Tides`, `Waycrest Manor`
]

const yesno = [{name: 'Yes',value: 1}, { name: 'No',value: 0}]

const allowedReactions = [
    getEmojiForRole('Tank'),
    getEmojiForRole('Healer'),
    getEmojiForRole('Dps'), 
    '🔒'
];

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
        logDebug(`\`/key\` SlashCommand executed`);
        logDebug(`args: \`${JSON.stringify(interaction.options)}\``);
        const dungeon = interaction.options.get('dungeon').value;
	    const keyLevel = interaction.options.get('level').value;
	    const tankNeeded = interaction.options.get('tank').value;
	    const healerNeeded = interaction.options.get('healer').value;
	    const dpsCount = interaction.options.get('dps').value;
        const remark = interaction.options.get('remark')?.value;
        const title = `[LFG] ${dungeon} +${keyLevel}`;
        let rolesNeeded = [];

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
            rolesNeeded.push('Tank');
            embed.addFields(
                {
                    name: getEmojiForRole('Tank'), value: '...' 
                }
            );
        }
        // is a healer needed?
        if(healerNeeded) {
            rolesNeeded.push('Healer');
            embed.addFields(
                {
                    name: getEmojiForRole('Healer'), value: '...' 
                }
            );
        }
        // are dps needed?
        if(dpsCount > 0) {
            rolesNeeded.push('Dps');
            embed.addFields(
                {
                    name: getEmojiForRole('Dps'), value: '...'
                }
            )
        }

        logDebug(`missing roles: \`${JSON.stringify(rolesNeeded)}\``);
        const pingString = getPingStringForRoles(rolesNeeded);
        logDebug(`generated pingstring \`${pingString}\``);
        await interaction.reply({ 
            content: `Setting up a key for ${dungeon} +${keyLevel}\nGood luck and have fun!\n*I hope you're popular enough so people join!*`, 
            ephemeral: true 
        });
        logDebug(`sent ephemeral message`);
        let pingMessage = await interaction.channel.send(pingString);
        logDebug(`sent pingstring`);
        const message = await interaction.channel.send({ embeds: [embed]});
        logDebug(`sent embed message`);
        
        // add role reactions
        rolesNeeded.forEach((r) => {
            const emoji = getEmojiForRole(r);
            message.react(emoji);
            logDebug(`added reaction for \`${JSON.stringify(r)}\` using emoji ${emoji}`);
          });

        // add generic lock reactions
        message.react('🔒');
        logDebug(`added reaction for \`"Close"\` using emoji 🔒`);
        
        // create collector to 'act' on reactions
        // filter it to only look for reactions that are defined in the 'allowedReactions' array, and not done by a bot
        const filter = (reaction, user) => {
            return !user.bot && allowedReactions.includes(reaction._emoji.name)
        };
        const collector = message.createReactionCollector({
            filter,
            time: collectorTimeOut,
            dispose: true
        })

        collector.on('collect', async (reaction, user) => {
            logDebug(`reaction \`${reaction.emoji.name}\` collected for user \`${user.id}\``);
            const userIsAuthor = user.id === interaction.user.id;
            const userHasDevRole = await hasDevRole(user.id, interaction.guild);
            logDebug(`userIsAuthor: \`${userIsAuthor}\` - userHasDevRole \`${userHasDevRole}\``);

            switch(reaction.emoji.name) {
                case '🔒':
                    if(userIsAuthor || userHasDevRole) {
                        pingMessage.delete();
                        pingMessage = null;
                        closeEmbed(embed);
                        message.reactions.removeAll();
                        message.edit({ embeds: [embed] });
                        logDebug(`message closed and reactions removed`);
                    } else {
                        // ignore the reaction
                        reaction.users.remove(user);
                        logDebug(`user \`${user.id}\` not allowed to use ${reaction.emoji.name} reaction`);
                    }
                    break;
                default: 
                    // get the role to assign based on the emoji
                    const roleToAssign = getRoleForEmoji(reaction.emoji.name);
                    // add chosen reaction
                    updateEmbed(embed, user.id, roleToAssign);
                    message.edit({ embeds: [embed] });
                    logDebug(`user \`${user.id}\` has been assigned the \`${roleToAssign}\` role`);
                    break;
            }
        })

        collector.on('remove', (reaction, user) => {
            const roleToRemove = getRoleForEmoji(reaction.emoji.name);
            updateEmbed(embed, user.id, roleToRemove, false);
            message.edit({ embeds: [embed] });
            logDebug(`rolereaction \`${roleToRemove}\` has been removed for user \`${user.id}\``);
        })
        
        collector.on('end', () => {
            if(!pingMessage) return;
            pingMessage.delete();
            closeEmbed(embed);
            message.reactions.removeAll();
            message.edit({ embeds: [embed] })
            logDebug(`collector timed out, removed reactions and closed message`);
        })
    },
 
    options: {
        devOnly: false,
        deleted: false,
    },
};