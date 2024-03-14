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

### 1.1.0 - Names over Id's

- Add author information to signup message of the the `/key` command
- Update the `/configure` command so you can add the names of the roles/channels in the modal in stead of the id's
  - id's will be fetched by the bot and stored alongside the names, if you ever change a rolename or channel name, the bot should keep working ... should

### 1.0.0 - Initial commit

- Added Dragonflight Season 3 dungeons
- Added `/configure`, `/key` and `/debug` commands

## 🛑 Requirements

### Make sure your server has the needed Discord roles!

As a prerequisite for using this bot, your Discord server should have the following roles:

- `Tank` (used for pinging tanks)
- `Healer` (used for pinging healers)
- `Dps` (used for pinging dps)
- `SomeAdminRole` (used to grant certain people more privileges for the bot)

> The roles don't have to be named exactly like in this example as the bot uses their id's to work,  
> but you need to have these four roles in order for the bot to work correctly.

## ✅ Getting started

### 1️⃣ Invite the bot to your discord

**Link coming soon!**

Use <a href="https://discord.com/oauth2/authorize?client_id=1214206044168003614&permissions=2147494976&scope=bot+applications.commands" target="_blank">this link</a> to invite SlashKey to your discord server

### 2️⃣ Configure the bot

Before the bot can be up and running, it will need some specific information from your server.  
Use the `/configure` command to do so

> After the first successful usage of the `/configure` command, this command will be restricted to users with the `BOT MAINTAINER ROLE` role.

![SlashKey configure command example](/assets/slashkey-configurate-command.png 'SlashKey configure command example')

The following modal window will show up in your discord, make sure you have all the needed information at hand to fill it out completely.  
_(all fields are required for the bot to run smoothly)_

![SlashKey configure modal example](/assets/slashkey-configurate-modal.png 'SlashKey configure modal example')

| Setting             | Description                             | Used for                                                                                                                                                                               |
| ------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BOT MAINTAINER ROLE | The rolename for admins of the bot      | Using the `🔒` reaction on a posted run can only be done by the author of the key or a user with this role, using the `/configure` or `/debug` command is also restricted to this role |
| TANK ROLE           | The rolename used for the `Tank` role   | Role used to ping tanks, should they be needed for a posted run                                                                                                                        |
| HEALER ROLE         | The rolename used for the `Healer` role | Role used to ping healers, should they be needed for a posted run                                                                                                                      |
| DPS ROLE            | The rolename used for the `Dps` role    | Role used to ping dps, should they be needed for a posted run                                                                                                                          |
| LOG CHANNEL         | The channelname the bot can log to      | The logchannel is used for the bot's error messages and debug messages (if debugging is enabled, it's not by default)                                                                  |

### 3️⃣ Validate the configuration

After submitting this form, the bot will first validate the configuration, it will check if the given role id's are actual roles and if the log channel id is an actual text channel in your Discord server.

If everything is validated correctly, the user that executed the `/configure` command will receive a message that the configuration has been saved.

![SlashKey configure validation success example](/assets/slashkey-configurate-validation-success.png 'SlashKey configure validation success example')

If there were any validation errors, there will be a message detailing the errors in the configuration.

![SlashKey configure validation erriors example](/assets/slashkey-configurate-validation-failed.png 'SlashKey configure validation errors example')

### 4️⃣ Run a key

#### /key command

To create a new mythic+ run, simply use the `/key` command.  
The bot will then reply you with a prompt to get all the necessary information to start organize the run.

> Your server's configuration will again be validated here, to make sure everything is in order to set up the run.  
> If that validation fails, the command stops and a message will be shown in the chat to indicate the mistakes with the configuration.

![SlashKey command example](/assets/slashkey-key-command.png 'SlashKey command example')

**Prompts:**

- **dungeon** (_required_): gives you a selection of dungeons to choose from
- **level** (_required_): type in a number for the keylevel (for instance 15 to run a +15 key)
- **tank** (_required_): gives you a choice between `Yes` and `No` whether or not your run needs a tank
- **healer** (_required_): gives you a choice between `Yes` and `No` whether or not your run needs a healer
- **dps** (_required_): type in a number (0-3) depending on how many dps your run needs
- **remark** (_optional_): allows you to optionally add a remark to the run (will be shown in the description of the signup template)

#### Signup message

After running the command, a signup message will be posted into the chat, pinging the missing roles for the run.

![SlashKey signup message example](/assets/slashkey-embed.png 'SlashKey signup message example')

#### Signing up for a run

People can sign up for a run by reacting with the appropriate role icon  
_(if someone wants to tank the run, they can react with '🛡️' and they'll be signed up for that role)_

> Signups are first come first serve, if the role is filled, it's filled.  
> If you want to unsign from a run, just click the react button again to remove your reaction.  
> If you changed your mind and want to swap role, unsign first by removing your reaction, and then sign for the correct one.

After signing up for a run, that Discord member will be listed in the signup message.

![SlashKey signed example](/assets/slashkey-embed-signed.png 'SlashKey signed example')

#### Locking the run

There's an extra reaction added to each run, the `🔒` reaction, this is used to close the run so it doesn't accept anymore signups.

> This reaction only accepts clicks from the author of the run or anyone in the Discord that has the `BOT MAINTAINER ROLE` configured in the servers configuration.

#### Timeout

By default, any posted run will automatically close after 10 minutes.  
This setting is not configurable for now.

### 5️⃣ Hope you have friends that'll join you!

And go slay some demons/dragons/dwarves for purple pixels!

![Mythic Plus](https://media.makeameme.org/created/goes-into-mythic.jpg 'Mythic Plus')

## 📃 License & Information

If you want to create your own bot, feel free to use this code however you want.  
Fork it, copy it, paste it, make love to it...

There's a fair few resources on the interwebs on how to create discord bots and slash commands, as well as information on hosting bots on your own or a remote server.

This bot was made with JavaScript, and one of the better resources on the `discord.js` library can be found <a href="https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot" target="_blank">here</a>.  
For data storage I opted to use <a href="https://supabase.com/" target="_blank">Supabase</a>, it's the first time I've used it in a project (usually I go for <a href="https://firebase.google.com/" target="_blank">Firebase</a>) and it seems extremely versatile for quick and easy "backends".

Another good source of information that I used while making this bot were the videos of <a href="https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot" target="_blank">Under Ctrl</a>.  
Be sure to check him out and support his channel!
