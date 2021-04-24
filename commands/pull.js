const discordJS = require('discord.js')
const Game = require('./../Game')

module.exports = 
{
    name: 'pull',
    description: "Remove player from game",
    execute(message, args)
    {
        const discordID = message.mentions.members.first().id.toString()
        if (message.channel.id === '807196102067617844' && args.length === 1)
        {
            Game.findOneAndUpdate({ type: "tdm" }, {$pull:{ players: { id: discordID} }})
            .then(() => {
                message.channel.send(`removed from **TDM**`)
            })

            Game.findOneAndUpdate({ type: "CTF" }, {$pull:{ players: { id: discordID} }})
            .then(() => {
                message.channel.send(`removed from **CTF**`)
            })
        }
        else if (message.channel.id === '807196102067617844' && message.mentions.members.first())
        {
            Game.findOneAndUpdate({ type: args[0] }, {$pull:{ players: { id: discordID} }})
            .then(() => {
                message.channel.send(`removed from ${[args[0]]}`)
            })
        } 
        else if (message.channel.id === '807196102067617844' && message.mentions.members.first())
        {
            Game.findOneAndUpdate({ type: args[0] }, {$pull:{ players: { id: discordID} }})
            .then(() => {
                message.channel.send(`removed from ${[args[0]]}`)
            })
        }
    }
}