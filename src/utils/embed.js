const { getEmojiForRole } = require('./emoji')

module.exports = {
    closeEmbed: (embed) => {
        embed
            .setColor('#000000')
            .setTimestamp()
            .setTitle(embed.data.title.replace('[LFG]', '[CLOSED]'))
            .setDescription('*Signups are closed*');
    },
    updateEmbed: (embed, userId, role, add = true) => {
        if (!embed?.data?.fields) return;
        const userTag = `<@${userId}>`;
        // determine if the current user has already signed (only used for 'add' action)
        const signed = embed.data.fields.some((f) => f.value === userTag);
        // determine the fields we need based on the role/emoji
        const fields = embed.data.fields.filter((f) => f.name === getEmojiForRole(role));

        // if the reaction is to "add" an unexisting signup
        if (add && !signed) {
            // find the first empty field
            let empField = fields.find((f) => f.value === '...');
            if (empField) {
                empField.value = userTag;
            }
        }
        // if the reaction is to "remove" an existing signup
        if (!add && signed) {
            // find the first field containing the user (there should actually only be one)
            let userField = fields.find((f) => f.value === userTag);
            if (userField) {
                userField.value = '...';
            }
        }
    }
}