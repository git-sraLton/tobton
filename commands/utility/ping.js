import {SlashCommandBuilder} from "discord.js";


export const data =  new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!');

export async function execute(interaction) {
        console.log('i got pinged');
        await interaction.reply('Pong!');
}
