const { getVoiceConnection } = require('@discordjs/voice');
const { playSong } = require('./Play'); // Asegúrate de que este módulo esté correctamente exportado e importado

module.exports = {
    name: 'next',
    execute: function(message, args, queue) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("¡Necesitas estar en un canal de voz para usar este comando!");

        if (!queue || queue.length === 0) {
            return message.channel.send('No hay ninguna canción que pueda saltar.');
        }
        queue.shift();
        if (queue.length > 0) {
            playSong(voiceChannel, message, queue); // Reproduce la siguiente canción en la cola
        } else {
            const connection = getVoiceConnection(voiceChannel.guild.id);
            if (connection) {
                connection.destroy(); // Destruye la conexión si no hay más canciones en la cola
            }
            return message.channel.send('No hay más canciones en la cola.');
        }
        return message.channel.send('He saltado a la siguiente canción.');
    },
};








