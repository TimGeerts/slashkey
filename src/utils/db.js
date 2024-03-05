const { createClient } = require('@supabase/supabase-js');
let dbClient;

module.exports = {
  init: (url, token) => {
    dbClient = createClient(url, token);
  },
  getGuilds: async () => {
    const { data, error } = await dbClient.from('guilds').select();
    if (error) console.log(error);
    return data;
  },
  getGuild: async (guildId) => {
    let ret = null;
    const { data, error } = await dbClient
      .from('guilds')
      .select()
      .eq('id', guildId);
    if (error) console.log(error);
    //should only return one record
    if (data.length !== 0) {
      ret = data[0];
    } else {
      console.log(
        `no record for the guild ${guildId} was found in the database`
      );
    }
    return ret;
  },
  setGuild: async (guildConfiguration) => {
    const { error } = await dbClient
      .from('guilds')
      .upsert(guildConfiguration)
      .select();
    if (error) console.log(error);
  },
  removeGuild: async (guildId) => {
    const { error } = await dbClient.from('guilds').delete().eq('id', guildId);
    if (error) console.log(error);
  },
};
