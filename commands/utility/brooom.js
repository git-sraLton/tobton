import {
    ActionRowBuilder, bold,
    ButtonBuilder,
    ButtonStyle, Collection,
    ContainerBuilder, italic, quote,
    SectionBuilder,
    SlashCommandBuilder, TextDisplayBuilder
} from "discord.js";


export const data = new SlashCommandBuilder()
    .setName('brooom')
    .setDescription('Delete messages marked with :broom:!');

export async function execute(interaction) {

    const channel = interaction.channel;
    channel.messages.fetch()
        .then(async msgs => {
            msgs = msgs.filter(msg => {
                return msg.reactions.cache.some(reaction => reaction.emoji.name === '🧹');
            })
            const msgCount = msgs.size;
            if (!msgCount) {
                await interaction.reply({
                    content: "No messages marked for brooming found.",
                });
                return;
            }

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

            let messageString = msgs.map((m) => '. ' +bold(m.author.username) + ': ' + italic(m.content) + '\n').join('\n');
            if (messageString.length > 1800) {
                messageString = messageString.substring(0, 1800) + '...';
            }
            const response = await interaction.reply({
                content: "Are you sure you want to delete the following "+ msgCount +" messages?\n\n" + quote(messageString),
                components: [row],
                withResponse: true
            });


            const collectorFilter = i => i.user.id === interaction.user.id;
            try {
                const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
                if (confirmation.customId === 'confirm') {
                    msgs.forEach(m => m.delete());
                    confirmation.update({ content: 'Brooomed '+ msgCount +' messages', components: [] });
                } else if (confirmation.customId === 'cancel') {
                    confirmation.update({ content: 'Canceled broooming', components: [] });
                }
            } catch {
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            }

        });


}
