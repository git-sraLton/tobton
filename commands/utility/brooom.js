import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} from "discord.js";


export const data = new SlashCommandBuilder()
    .setName('brooom')
    .setDescription('Delete messages marked with :broom:!');

export async function execute(interaction) {

    const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirm Deletion')
        .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
        .addComponents(cancel, confirm);
    const response = await interaction.reply({
        content: "Are you sure?",
        components: [row]
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'confirm') {
            console.log('i should be broooming')
        } else if (confirmation.customId === 'cancel') {
            console.log('broooming canceled')
        }
    } catch {
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    }
}
