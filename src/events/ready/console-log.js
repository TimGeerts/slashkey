const { init, logStart, logError, logDebug } = require('../../utils/utils');

module.exports = async (c) => {
    await init(c);
    logStart(`${c.user.username} is online.`);
};