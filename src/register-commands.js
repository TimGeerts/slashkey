require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const dungeons = [
        `Atal'Dazar`, 'Blackrook Hold'
]

const yesno = [
    {
        name: 'Yes',
        value: 1
    }, 
    { 
        name: 'No',
        value: 0
    }
]


const commands = [
  {
    name: 'hey',
    description: 'Replies with hey!',
  },
  {
    name: 'ping',
    description: 'Pong!',
  },
  {
    name: 'key',
    description: 'Start a mythic+ run',
    options: [
        {
            name: 'dungeon',
            description: 'The dungeon you want to run.',
            type: ApplicationCommandOptionType.String,
            choices: dungeons.map((d) => { 
                return {
                    name: d,
                    value: d
                }
            }),
            required: true
        },
        {
            name: 'level',
            description: 'The level of key you want to run',
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: 'tank',
            description: 'Do you need a tank?',
            type: ApplicationCommandOptionType.Number,
            choices: yesno,
            required: true
        },
        {
            name: 'healer',
            description: 'Do you need a healer?',
            type: ApplicationCommandOptionType.Number,
            choices: yesno,
            required: true
        },
        {
            name: 'dps',
            description: 'How many dps do you need?',
            type: ApplicationCommandOptionType.Number,
            choices: ['0','1','2','3'].map((x) => {
                return {
                    name: x,
                    value: parseInt(x)
                }
            }),
            required: true
        }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();