<div align="center">
     <h1>~ AcceptMessage ~</h1>
     <strong>discord.js addon to create acceptable messages</strong><br><br>
     <a href="https://zekro.de/docs/acceptmessage"><img src="https://img.shields.io/badge/docs-jsdocs-c918cc.svg" /></a>
    <br>
    <br>
    <a href="https://nodei.co/npm/acceptmessage/"><img src="https://nodei.co/npm/acceptmessage.png?downloads=true"></a>
 </div>

---

## [👉 JSDOCS](https://zekro.de/docs/acceptmessage)

---

# Screenshots

![](http://zekro.de/ss/2018-07-11_19-16-57.gif)

---

# Usage

```js
const Discord = require('discord.js')

// Import AcceptMessage
const AcceptMessage = require('../src/main.js')

// Create discord.js bot instance
const client = new Discord.Client()

// When a new member joins the guild, the bot will send an accept message to them via PN
client.on('guildMemberAdd', (member) => {

    // Build the AcceptMessage
    var msg = new AcceptMessage(client, {
        content: new Discord.RichEmbed()
            .setDescription('Please accept the [rules](https://some.rules.or.so) of the guild by clicking the ✅ reaction below.')
            .setColor(0xf76707),
        emotes: {
            accept: '✅',
            deny:   '❌'
        },
        checkUser: member,
        actions: {
            accept: (reaction, user) => {
                // do some stuff after acception
            },
            deny: (reaction, user) => {
                // do some stuff after deny
            }
        }
    })

    // Send the message to the member. If you want to send it in a public channel, just
    // use any other text channel resolvable by discord.js here.
    msg.send(member)

})

// Logging in the client
client.login(process.argv[2])
```

---

© 2018 Ringo Hoffmann (zekro Development)  
contact[at]zekro.de | [zekro.de](https://zekro.de)
