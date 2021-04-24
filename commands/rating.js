const Player = require('./../Players')
const fetch = require('node-fetch')

async function get_id(steamid, message, mode)
{
    const respose = await fetch(`http://stats.houseofquake.com/elo/${steamid}`)
    const data = await respose.json()

    if (data && mode === 'tdm')
    {
        message.channel.send("**TDM Rating:** " + "`" + data.playerinfo[steamid].ratings.tdm.elo + "`")
    }
    else if (data && mode === 'ctf')
        message.channel.send("**CTF Rating:** " + "`" + data.playerinfo[steamid].ratings.ctf.elo + "`")
}

module.exports = {
    name: 'rating',
    description: "list ratings",
    execute(message, args)
    {
        if (args.length === 0)
        {
            Player.findOne({ discordID: message.author.id})
            .then(user => {
                if (user)
                {
                    get_id(user.steamid, message, 'tdm')
                    get_id(user.steamid, message, 'ctf')
                } 
                else
                    message.channel.send('SteamID is not set.')
            })
        }
        else 
        {
            Player.findOne({ discordID: message.author.id})
            .then(user => {
                if (user)
                {
                    if (args[0] === 'tdm')
                        get_id(user.steamid, message, 'tdm')
                    else if (args[0] === 'ctf')
                        get_id(user.steamid, message, 'ctf')
                } 
                else
                    message.channel.send('SteamID is not set.')
            })
        }
    }
}