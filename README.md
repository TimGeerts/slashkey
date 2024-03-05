# 🗝️ SlashKey - Mythic+ Discord Bot

Welcome to the SlashKey Discord Bot for World of Warcraft!  
This bot is designed to help you easily create and manage mythic+ runs within your Discord server.

> The bot has been updated for Dragonflight Season 3

**Disclaimer:** This bot is not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft is a registered trademark of Blizzard Entertainment, Inc.

## 📚 Features

- **Run Creation**: Easily create mythic+ runs by specifying the dungeon, key level, and desired roles.
- **Ping notifications**: Missing roles will automatically be pinged in the Discord where the run is posted.
- **Run Signups**: Sign up to created runs by using the Discord reaction system.
- **Configurability**: Configure the settings for the bot specifically for your Discord server.

## 📑 Changelog

### 1.0.0 - Initial commit

- Works for World of Warcraft - Dragonflight - Season 3
- Added `/configurate` and `/key` commands

## 🛑 Requirements

### Make sure your server has the needed Discord roles!

As a prerequisite for using this bot, your Discord server should have the following roles:
> The roles don't have to be named exactly like in this example as the bot uses their id's to work,  
but you need to have these four roles in order for the bot to work correctly.
- `Tank` (used for pinging tanks)
- `Healer` (used for pinging healers)
- `Dps` (used for pinging dps)
- `SomeAdminRole` (used to grant certain people more privileges for the bot)

## ✅ Getting started

### 1️⃣ Invite the bot to your discord

Use [this link](https://discord.com/oauth2/authorize?client_id=1214206044168003614&permissions=2147494976&scope=bot+applications.commands) to invite SlashKey to your discord server  

### 2️⃣ Configure the bot

Before the bot can be up and running, it will need some specific information from your server.  
Use the `/configure` command to do so (this is restricted to server administrators - **TODO**).

![SlashKey configure command example](/assets/slashkey-configurate-command.png "SlashKey configure command example")

The following modal window will show up in your discord, make sure you have all the needed information at hand to fill it out completely.  
*(all fields are required for the bot to run smoothly)*

![SlashKey configure modal example](/assets/slashkey-configurate-modal.png "SlashKey configure modal example")
 

| Setting      | Description | Used for |
| ----------- | ----------- | - |
| BOT MAINTAINER ROLE      | The role id for admins of the bot  | Using the `🔒` reaction on a posted run can only be done by the author of the key or a user with this role |
| TANK ROLE   | The role id used for the `Tank` role        | Role used to ping tanks, should they be needed for a posted run |
| HEALER ROLE   | The role id used for the `Healer` role        | Role used to ping healers, should they be needed for a posted run |
| DPS ROLE   | The role id used for the `Dps` role        | Role used to ping dps, should they be needed for a posted run |
| LOG CHANNEL   | The channel id the bot can log to        | The logchannel is used for the bot's error messages and debug messages (if debugging is enabled) |
  
### 3️⃣ Validate the configuration

After submitting this form, the bot will first validate the configuration, it will check if the given role id's are actual roles and if the log channel id is an actual text channel in your Discord server.

If everything is validated correctly, the user that executed the `/configure` command will receive a message that the configuration has been saved.

![SlashKey configure validation success example](/assets/slashkey-configurate-validation-success.png "SlashKey configure validation success example")

If there were any validation errors, there will be a message detailing the errors in the configuration.

![SlashKey configure validation erriors example](/assets/slashkey-configurate-validation-failed.png "SlashKey configure validation errors example")

### 4️⃣ Run a key
#### /key command
To create a new mythic+ run, simply use the `/key` command.  
The bot will then reply you with a prompt to get all the necessary information to start organize the run.

> Your server's configuration will again be validated here, to make sure everything is in order to set up the run.  
If that validation fails, the command stops and a message will be shown in the chat to indicate the mistakes with the configuration.

![SlashKey command example](/assets/slashkey-key-command.png "SlashKey command example")

**Prompts:**
- **dungeon** (*required*): gives you a selection of dungeons to choose from
- **level** (*required*): type in a number for the keylevel (for instance 15 to run a +15 key)
- **tank** (*required*): gives you a choice between `Yes` and `No` whether or not your run needs a tank
- **healer** (*required*): gives you a choice between `Yes` and `No` whether or not your run needs a healer
- **dps** (*required*): type in a number (0-3) depending on how many dps your run needs
- **remark** (*optional*): allows you to optionally add a remark to the run (will be shown in the description of the signup template)

#### Signup message

After running the command, a signup message will be posted into the chat, pinging the missing roles for the run.  

![SlashKey signup message example](/assets/slashkey-embed.png "SlashKey signup message example")

#### Signing up for a run
People can sign up for a run by reacting with the appropriate role icon  
*(if someone wants to tank the run, they can react with '🛡️' and they'll be signed up for that role)*  

>Signups are first come first serve, if the role is filled, it's filled.  
If you want to unsign from a run, just click the react button again to remove your reaction.  
If you changed your mind and want to swap role, unsign first by removing your reaction, and then sign for the correct one.  

After signing up for a run, that Discord member will be listed in the signup message.

![SlashKey signed example](/assets/slashkey-embed-signed.png "SlashKey signed example")

#### Locking the run

There's an extra reaction added to each run, the `🔒` reaction, this is used to close the run so it doesn't accept anymore signups.
> This reaction only accepts clicks from the author of the run or anyone in the Discord that has the `BOT MAINTAINER ROLE` configured in the servers configuration.

#### Timeout
By default, any posted run will automatically close after 10 minutes.  
This setting is not configurable for now, but I might add the option in a later version.

### 5️⃣ Hope you have friends that'll join you!
And go slay some demons/dragons/dwarves for purple pixels!

![Mythic Plus](https://media.makeameme.org/created/goes-into-mythic.jpg "Mythic Plus")

## 📃 License

If you want to create your own bot, feel free to use this code however you want.  
Fork it, copy it, paste it, make love to it...

There's a fair few resources on the interwebs on how to create discord bots and slash commands, as well as information on hosting bots on your own or a remote server.  

This bot was made with JavaScript, and one of the better resources on the `discord.js` library can be found [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)  

Another good source of information that I used while making this bot were the videos of [Under Ctrl](https://www.youtube.com/@UnderCtrl).  
Be sure to check him out and support his channel!