const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'p',
    execute: async function(message, args, queue) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("¡Necesitas estar en un canal de voz para usar este comando!");

        const videoFinder = async (query) => {
            if (!query) return null;
            const videoResult = await ytSearch(query);
            return videoResult.videos.length > 0 ? videoResult.videos[0] : null;
        };

        const video = await videoFinder(args.join(' '));
        if (video) {
            queue.push({ url: video.url, title: video.title, user: message.author.tag });
            message.channel.send(`La canción **${video.title}** ha sido añadida a la cola por **${message.author.tag}**.`);
            if (queue.length === 1) {
                playSong(voiceChannel, message, queue);
            }
        } else {
            message.channel.send("No se encontraron resultados para la canción proporcionada.");
        }
    },
    playSong
};

async function playSong(voiceChannel, message, queue) {
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(ytdl(queue[0].url, { quality: 'highestaudio', highWaterMark: 1 << 25 }), { inlineVolume: true });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
        queue.shift();
        if (queue.length > 0) {
            playSong(voiceChannel, message, queue);
        }
    });

    player.on('error', error => {
        console.error(`Error al reproducir la canción: ${error}`);
        message.channel.send(`Ocurrió un error al reproducir la canción: ${error.message}`);
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
    return message.channel.send(`Reproduciendo: **${queue[0].title}** añadida por **${queue[0].user}**`);
}










