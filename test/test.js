const Discord = require('discord.js')
const AcceptMessage = require('../src/main.js')

const client = new Discord.Client()

client.on('ready', () => {
    console.log('ready')
    
    var chan = client
        .guilds.find(g => g.id == '287535046762561536')
        .channels.find(c => c.id == '466603824979640320')

    var msg = new AcceptMessage(client, {
        content: new Discord.RichEmbed()
            .setDescription('Wan\'t sum fuk? :hearts:')
            .setColor(0xf76707),
        channel: chan, //some channel resolvable here
        emotes: {
            accept: '💦',
            deny:   '✋'
        },
        checkUser: '221905671296253953',
        actions: {
            accept: (reaction, user) => {
                reaction.message.channel.send('Uh yeah! :yum: ')
            },
            deny: (reaction, user) => {
                reaction.message.channel.send('Aww said... :cry: ')
            }
        }
    })

    msg.send()
})

client.login(process.argv[2])