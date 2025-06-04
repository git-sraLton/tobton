/*
    Slash commands only need to be registered once, and updated when
    the definition (description, options, etc.) is changed. As there is
    a daily limit on command creations, it's not necessary nor desirable
    to connect a whole client to the gateway or do this on every ready
    event. As such, a standalone script using the lighter REST manager is
    preferred.

    https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands (2025-06-03)
*/

import {REST, Routes} from "discord.js";
import config from '../config.json' with { type: 'json' };
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath, pathToFileURL} from "url";

const {clientId, guildId, token} = config;

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'commands');



const commandFolders = fs.readdirSync(dirname);

for (const folder of commandFolders) {
    const commandsPath = path.join(dirname, folder);
    if (!fs.lstatSync(commandsPath).isDirectory()) {
        continue;
    }
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(pathToFileURL(filePath).href);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
