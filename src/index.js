require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { CommandKit } = require('commandkit');
const { init } = require('./utils/db');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

new CommandKit({
  client,
  commandsPath: path.join(__dirname, 'commands'),
  eventsPath: path.join(__dirname, 'events'),
  skipBuiltInValidations: true,
  bulkRegister: true,
});

client.login(process.env.TOKEN);
init(process.env.SUPABASE, process.env.SUPA_SERVICE_ROLE);
