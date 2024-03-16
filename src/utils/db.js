const { createClient } = require('@supabase/supabase-js');
let dbClient;

const T_GUILDS = 'guilds';
const T_LOGS = 'logs';

module.exports = {
  init: (url, token) => {
    dbClient = createClient(url, token);
  },
  logDbError: async (guildId, message, err) => {
    const logRecord = {
      guildId,
      type: 'ERROR',
      message,
      details: err,
    };
    const { error } = await dbClient.from(T_LOGS).insert(logRecord).select();
    if (error) console.log(error);
  },
  getGuild: async (guildId) => {
    let ret = null;
    const { data, error } = await dbClient
      .from(T_GUILDS)
      .select()
      .eq('id', guildId);
    if (error) {
      error.params = { guildId: guildId };
      module.exports.logDbError(guildId, `getGuild function failed`, error);
      return null;
    }
    //should only return one record
    if (data.length !== 0) {
      ret = data[0];
    } else {
      const customError = {
        params: { guildId: guildId },
        message: `no record for the guild ${guildId} was found in the database`,
      };
      module.exports.logDbError(
        guildId,
        `getGuild function failed`,
        customError
      );
    }
    return ret;
  },
  setGuild: async (guildConfiguration) => {
    const { data, error } = await dbClient
      .from(T_GUILDS)
      .upsert(guildConfiguration)
      .select();

    if (error) {
      console.log(`guildConfig: ${guildConfiguration}`);
      error.params = guildConfiguration;
      module.exports.logDbError(
        guildConfiguration.id,
        `setGuild function failed`,
        error
      );
    }
    return data;
  },
  removeGuild: async (guildId) => {
    const { data, error } = await dbClient
      .from(T_GUILDS)
      .delete()
      .eq('id', guildId);

    if (error) {
      console.log(error);
      error.params = { guildId: guildId };
      console.log(error);
      module.exports.logDbError(guildId, `removeGuild function failed`, error);
    }
    return data;
  },
};
