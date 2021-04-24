const Game = require('./../Game')

module.exports = {
    name: 'remove',
    description: "remove",
    execute(message, args)
    {
        const user_id = message.author.id
        var game_type 
        if (args.length === 0)
        {
            Game.findOneAndUpdate({ type: "tdm" }, {$pull:{ players: { id: user_id} }})
            .then(() => {
                message.channel.send(`removed from ${"TDM"}`)
            })

            Game.findOneAndUpdate({ type: "ctf" }, {$pull:{ players: { id: user_id} }})
            .then(() => {
                message.channel.send(`removed from ${"CTF"}`)
            })

            return 
        }
        else if (args[0] === 'ctf')
            game_type = 'ctf'
        else if (args[0] === 'tdm')
            game_type = 'tdm'
        else 
            return

        Game.findOneAndUpdate({ type: game_type }, {$pull:{ players: { id: user_id} }})
        .then(() => {
            message.channel.send(`removed from ${game_type}`)
        })
    }
}