const Game = require('./../Game')


module.exports = {
    name: 'who',
    description: "lists players",
    execute(message, args)
    {
        var game_type
        if (args.length === 0)
        {
            Game.findOne({ type: "tdm" })
                .then((doc) => {
                msg = `**Players ${"TDM"}:** |`
                doc.players.forEach((player1) => {
                    msg += "`" + player1.username + "`" + "|"
                })
                message.channel.send(msg)
            })

            Game.findOne({ type: "ctf" })
                .then((doc) => {
                msg = `**Players ${"CTF"}:** |`
                doc.players.forEach((player1) => {
                    msg += "`" + player1.username + "`" + "|"
                })
                message.channel.send(msg)
            })

            return 
        }
        else if (args[0] === 'tdm')
            game_type = 'tdm'
        else if (args[0] === 'ctf')
            game_type = 'ctf'
        else 
            return

        Game.findOne({ type: game_type })
        .then((doc) => {
            msg = `**Players ${game_type.toUpperCase()}:** |`
            doc.players.forEach((player1) => {
                msg += "`" + player1.username + "`" + "|"
            })
            message.channel.send(msg)
        })
    }
}