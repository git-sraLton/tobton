// Require the necessary discord.js classes
import {Client, Events, GatewayIntentBits} from "discord.js";
import config from './config.json' with { type: 'json' };
const { token } = config;
import {registerCommands} from "./commands/commandHandler.js";


// Create a new client instance
const client = new Client({intents: [GatewayIntentBits.Guilds]});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
    registerCommands(client);
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    console.log(typeof interaction)
});

// Log in to Discord with your client's token
client.login(token);