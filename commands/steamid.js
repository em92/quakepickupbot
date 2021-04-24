const Player = require('./../Players')

module.exports = 
{
    name: 'steamid',
    description: "Set player steam id",
    execute(message, args)
    {
        Player.findOne({ steamid: args[0] })
        .then(player => {
            if (player)
            {
                message.channel.send(`ID already set: ${player.steamid}`)
                return
            }
            else 
            {
                console.log(args[0])
                if (args[0] === undefined)
                {
                    message.channel.send('!steamid your_steam_id')
                    return
                }
                else if (args[0].length != 17)
                {
                    message.channel.send('steamid is incorrect.')
                    return
                }

                const player = new Player({
                    discordID: message.author.id,
                    steamid: args[0]
                })
                
                player.save()
                .then(() => {
                    message.channel.send('Steam id saved.')
                })
            }
        })
    }
}