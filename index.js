//require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

let queue = []; // Inicializar la cola

client.commands = new Collection();

// Leer y cargar todos los comandos
const commandFiles = fs
    .readdirSync(path.join(__dirname, "commands"))
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log(`Conectado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.content.startsWith("-")) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args, queue);
    } catch (error) {
        console.error(`Error al ejecutar el comando ${commandName}:`, error);
        message.reply("Ocurrió un error al ejecutar el comando.");
    }
});

//client.login(process.env.BOT_TOKEN);
const mySecret = process.env["DBT"];
client.login(mySecret);
