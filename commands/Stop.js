const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'stop',
    execute: function(message, args, queue) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("¡Necesitas estar en un canal de voz para usar este comando!");

        const connection = getVoiceConnection(voiceChannel.guild.id);
        if (!connection) {
            return message.reply('No estoy reproduciendo música en este momento.');
        }

        connection.destroy();
        queue.length = 0; // Vacía la cola de reproducción
        return message.channel.send('He dejado de reproducir música y me he desconectado del canal de voz.');
    }
};







