# 🗝️ SlashKey - Mythic+ run organizer bot for World of Warcraft

Welcome to the SlashKey bot for World of Warcraft!  
This bot is designed to help you easily create and manage mythic+ runs within your Discord server.

**Disclaimer:** This bot is not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft is a registered trademark of Blizzard Entertainment, Inc.

## 🔢 Latest version - 1.0.0

This version works for **Season 3 of Dragonflight**, it will be updated whenever a new Mythic+ season starts.

## 📚 Features

- **Run Creation**: Easily create mythic+ runs by specifying the dungeon, key level, and desired roles.
- **Role Assignment**: Automatically assign roles to participants based on their chosen reaction.
- **Configurability**: Customize various aspects of the bot's behavior using the `config.json` file.

## ✅ Installation

1. Clone this repository to your local machine or server.
2. Install dependencies by running `npm install`.
3. **Rename the `example.env` file** to `.env` and set your bot token   
*(depending on where you're running this code you might need to set an environment variable on your hosting service instead of in a `.env` file)*
4. Configure the bot by editing the `config.json` file.
5. Start the bot by running `node src/index.js` or `npm start`.  
*(again, depending on where you're running this code you might need to use different commands to run the code)*

## 📝 Environment variables

For this bot to run, you will need a `bot token` to be set in the environment variables (`.env` for localhost, but it might be different depending on where you're hosting the bot).  
The only variable that needs to be set is the `TOKEN` variable.

For example:  
``
TOKEN = <token>
``  
*replacing `<token>` by your bot token*

More information on how to create a discord bot and get its token to use can be found [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)  
Information on how to host a discord bot can be found all over the internet so I won't go into the million different ways people do it.

## 🧮 Discord roles

As a prerequisite for using this bot, your discord server should have the following roles:
> The roles don't have to be named exactly like in this example as the bot uses their id's to work,  
but you need to have these four roles in order for the bot to work correctly.
- `Tank`
- `Healer`
- `Dps`
- `SomeAdminRole`


## 🔧 Configuration

In the sourcecode there is an `example.config.json` file with several properties that can be set.  
First **rename this file to `config.json`** and then add the correct properties to it. 
- `devRole`: the role id for admins of the bot
- `tankRole`: the role id used for the `Tank` role
- `healerRole`: the role id used for the `Healer` role
- `dpsRole`: the role id used for the `Dps` role
- `logChannelId`: the channel id where you would like the bot to log to
- `debugEnabled`: by default the bot only logs a `ready` event, but setting this to true will also log any debug statements


## ▶️ Usage

### Creating a run

To create a new mythic+ run, simply use the `/key` command.  
The bot will then reply you with a prompt to get all the necessary information to start organize the run.

**Prompts:**
- **dungeon** (*required*): gives you a selection of dungeons to choose from
- **level** (*required*): type in a number for the keylevel (for instance 15 to run a +15 key)
- **tank** (*required*): gives you a choice between `Yes` and `No` whether or not your run needs a tank
- **healer** (*required*): gives you a choice between `Yes` and `No` whether or not your run needs a healer
- **dps** (*required*): type in a number (0-3) depending on how many dps your run needs
- **remark** (*optional*): allows you to optionally add a remark to the run (will be shown in the description of the signup template)

### Example
#### /key command
![SlashKey command example](/assets/slashkey-command.png "SlashKey command example")

#### Resulting signup message
After running the command, a signup message will be posted into the chat, pinging the missing roles for the run.  

![SlashKey signup message example](/assets/slashkey-embed.png "SlashKey signup message example")

#### Signing up for a run
People can sign up for a run by reacting with the appropriate role icon  
*(if someone wants to tank the run, they can react with '🛡️' and they'll be signed up for that role)*  

>Signups are first come first serve, if the role is filled, it's filled.  
If you want to unsign from a run, just click the react button again to remove your reaction.  
If you changed your mind and want to swap role, unsign first by removing your reaction, and then sign for the correct one.  

After signing up for a run, that discord member will be listed in the signup message

![SlashKey signed example](/assets/slashkey-embed-signed.png "SlashKey signed example")

#### Locking the run

There's an extra reaction added to each run, the `🔒` reaction, this is used to close the run so it doesn't accept anymore signups.
> This one only accepts clicks from the author of the run or anyone in the discord that has the `devRole` configured in the `config.json` file.

#### Timeout
By default, any posted run will automatically close after 10 minutes.  
This setting is not configurable for now, but I might add the option in a later version.
