const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Component } = require("discord.js");
const { getSettings, putSettings, validateSettings } = require('../../utils/settings');
const { logDebug, logError } = require("../../utils/logger");

const inputFields = [
    {
        customId: 'devRole',
        label: 'Bot maintainer role (id)'
    },
    {
        customId: 'tankRole',
        label: 'Tank role (id)'
    },
    {
        customId: 'healerRole',
        label: 'Healer role (id)'
    },
    {
        customId: 'dpsRole',
        label: 'Dps role (id)'
    },
    {
        customId: 'logChannelId',
        label: 'Log channel (id)'
    }
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('Shows a modal to configure the bot settings'),
    
    run: async ({ interaction }) => {
        const guild = interaction.guild;
        const guildId = guild.id;
        const guildSettings = await getSettings(guildId);
        const modal = new ModalBuilder({
            customId: `settings-modal-${interaction.user.id}`,
            title: `Configure SlashKey`
        });

        let rows = [];

        inputFields.forEach((field) => {
            const val = guildSettings ? guildSettings[field.customId]: ''
            const t = new TextInputBuilder({
                customId: field.customId,
                label: field.label,
                value: val,
                style: TextInputStyle.Short
            }).setRequired(true);
            const row = new ActionRowBuilder().addComponents(t);
            rows.push(row);
        });

        modal.addComponents(...rows);
        await interaction.showModal(modal);
        // wait for the modal to be submitted
        await interaction
            .awaitModalSubmit({ 
                filter: (i) =>  i.customId === `settings-modal-${interaction.user.id}`,
                time: 300000
             })
            .then(async (modalInteraction) => {
                let configuration = { };
                inputFields.forEach((field) => {
                    const val = modalInteraction.fields.getTextInputValue(field.customId);
                    configuration[field.customId] = val;
                });
                configuration['debugEnabled'] = "false";
                await putSettings(guildId, configuration);
                const validations = validateSettings(configuration, guild);

                if(validations?.length) {
                    validations.push('\n**Please run the \`/configure\` command again to fix the errors.**')
                    const validationMessages = validations.join('\n');
                    modalInteraction.reply({
                        content: `:x: **Your configuration was saved but there are some validation errors**\n${validationMessages}`,
                        ephemeral: true
                    });
                } else {
                    logDebug('this is a test', interaction.guild);
                    // reply to the modal
                    modalInteraction.reply({
                        content: `:white_check_mark: Your configuration has been saved and validated.`,
                        ephemeral: true
                    });
                }
            })
            .catch((err) => {
                logError(err.message, interaction.guild);
            });
    },
    
    options: {
        deleted: false,
    },
};