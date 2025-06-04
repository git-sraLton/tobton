import {Collection} from "discord.js";
import * as path from "node:path";
import * as fs from "node:fs";
import {fileURLToPath, pathToFileURL} from 'url'

export const registerCommands = async (client) => {
    client.commands = new Collection();

    const dirname = path.dirname(fileURLToPath(import.meta.url));

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
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}