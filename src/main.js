const { RichEmbed } = require('discord.js')
//const EventEmitter = require('events')

/**
 * Create instance of AcceptMessage.
 * @param {discord.Client}           client                  Client session instance of the bot
 * @param {string|discord.RichEmbed} options.content         Content to be send in the message.<br>Can be a RichEmbed or a string.
 * @param {discord.Channel}          options.channel         Channel resolvable to send message into
 * @param {discord.User|string}      options.checkUser       Check if this user set here accepted or denied the message
 * @param {boolean}                  options.dontRemoveOther Set this to true so other emotes will only be ignored and not removed
 * @param {boolean}                  options.multiple        Set this to make buttons multiple clickable.<br>So if this is enabled, reactions will not be cleared after acception or deny.
 * @param {boolean}                  options.deleteMessage   Set this to true to delete the whole message after acception or deny.<br><i>Will be ignored if 'options.multiple' is enabled.</i>
 * @param {string}                   options.emotes.accept   Accept emote
 * @param {string}                   options.emotes.deny     Deny emote [OPTIONAL]
 * @param {function}                 options.actions.accept  Action that will be executed on acception
 * @param {function}                 options.actions.deny    Action that will be executed on deny [OPTIONAL]
 * 
 * @example 
 * var msg = new AcceptMessage(client, {
 *     content: new Discord.RichEmbed()
 *         .setDescription('Wan\'t sum fuk? :hearts:')
 *         .setColor(0xf76707),
 *     channel: chan, //some channel resolvable here
 *     emotes: {
 *         accept: '✅',
 *         deny:   '❌'
 *     },
 *     checkUser: '221905671296253953',
 *     actions: {
 *          accept: () => console.log('okay lets go!'),
 *          deny:   () => console.log('aww sad')
 *     }
 * })
 */
class AcceptMessage /*extends EventEmitter*/ {

    constructor(client, options) {
        //super()
        this.options = {}
        this.client = client
        this.options = options
    }

    /**
     * Set messages content.
     * @param {string|discord.RichEmbed} content Content to be send in the message.<br>Can be a RichEmbed or a string.
     */
    setContent(content) {
        this.options.content = content
    }

    /**
     * Set text channel to send message into.
     * @param {discord.Channel} channel Channel resolvable to send message into. 
     */
    setChannel(channel) {
        this.options.channel = channel
    }

    /**
     * Set accept emote.
     * @param {string} emote Accept emote.
     */
    setAcceptEmote(emote) {
        this.emotes.accept = emote
    }

    /**
     * Set deny emote.
     * @param {string} emote Deny emote.
     */
    setDenyEmote(emote) {
        this.emotes.deny = emote
    }


    /**
     * @see {@link AcceptMessage#setAcceptAction} (alias)
     */
    setAction(action) {
        this.options.actions.accept = action
    }

    /**
     * Set accept function which will be executed on acception.
     * @param {function} action Accept function.
     */
    setAcceptAction(action) {
        this.options.actions.accept = action
    }

    /**
     * Set deny function which will be executed on deny.
     * @param {function} action Deny function.
     */
    setDenyAction(action) {
        this.options.actions.deny = action
    }

    /**
     * Send message into the specified channel.
     * @param {discord.Channel} channel If not done in options, you can also set here the channel resolvable.
     */
    send(channel) {
        if (channel)
            this.options.channel = channel

        if (typeof this.options.content == 'string')
            this.message = this.options.channel.send(this.options.content)
        else
            this.message = this.options.channel.send('', this.options.content)

        this.reactionListener = (reaction, user) => {
            if (reaction.message.id != this.message.id)
                return

            var emoji = reaction.emoji.name

            if (emoji != this.options.emotes.accept && emoji != this.options.emotes.deny || !checkUser(this.options.checkUser, user)) {
                if (!this.options.dontRemoveOther) {
                    reaction.remove(user)
                }
                return
            }

            if (emoji == this.options.emotes.accept)
                this.options.actions.accept(reaction, user)
            else
                this.options.actions.deny(reaction, user)

            if (!this.options.multiple) {
                if (this.options.deleteMessage)
                    this.message.delete()
                else
                    reaction.message.clearReactions()
                this.client.removeListener('messageReactionAdd', this.reactionListener)
            }
        }

        this.message.then(m => {
            new Promise(res => {
                m.react(this.options.emotes.accept).then(() => {
                    if (this.options.emotes.deny) {
                        m.react(this.options.emotes.deny)
                            .then(() => res(true))
                    }
                    else
                        res(false)
                })
            }).then((deny) => {
                setTimeout(() => {
                    this.client.on('messageReactionAdd', this.reactionListener)
                }, 500)
            })
            
            this.message = m
        })
    }
}


function checkUser(user, acceptor) {
    if (!user)
        return true
    if (user.id)
        user = user.id
    if (acceptor.id)
        acceptor = acceptor.id
    return (user == acceptor)
}


module.exports = AcceptMessage