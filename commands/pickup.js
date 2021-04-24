const discordJS = require('discord.js')
const fetch = require('node-fetch')
const Game = require('./../Game')
const Player = require('./../Players')
const teams = require('./../teams')

async function get_rating(steamid, mode)
{
    const respose = await fetch(`http://stats.houseofquake.com/elo/${steamid}`)
    const data = await respose.json()

    if (data && mode === 'tdm')
        return (data.playerinfo[steamid].ratings.tdm.elo)
    else if (data && mode === 'ctf')
        return (data.playerinfo[steamid].ratings.ctf.elo)
}

async function connect_steamid(players, mode)
{
    var finalPlayers = []
    players.forEach(player => {
        Player.findOne({ discordID: player.id })
        .then(async (plyr) => {
            const rating = await get_rating(plyr.steamid, mode)
            const playerObj = {
                username: player.username,
                rating: rating
            }
            console.log(playerObj)
            finalPlayers.push(playerObj)
        })
    })
    return finalPlayers
}

module.exports = {
    name: 'pickup',
    description: "pickups",
    execute(message, args)
    {
        const player = {
            id: message.author.id,
            username: message.author.username
        }
        if (args.length === 0)
        {
            Game.findOneAndUpdate({ type: 'tdm' }, {$addToSet:{players: player }}, {new: true} )
            .then(async (doc) => {
                if (doc.players.length === 8)
                {
                    var msg = 'TDM game has started. Players: '
                    doc.players.forEach((player1) => {
                        msg += (`<@${player1.id}>, `)
                    })
                    message.channel.send(msg)
                    
                    connect_steamid(doc.players, 'tdm')
                    .then(teams1 => {
                        var teams = ''
                        setTimeout(() => { 
                            teams1.forEach(player => {
                                teams += player.username  + ":" + "`" + player.rating + "`" + "\n"
                            })


                            const embed = new discordJS.MessageEmbed()
                            .setTitle('TDM Pickup game started')
                            .setDescription(redTeam + blueTeam)
                            message.channel.send(embed)
                         }, 1500);
                    })

                    doc.players = undefined
                    doc.save()
                }
                else 
                {
                    var msg = '**TDM: **'
                    doc.players.forEach((player1) => {
                        msg += "`" + player1.username + "`" + "|"
                    })
                    message.channel.send(msg)
                }
            })

            Game.findOneAndUpdate({ type: 'ctf' }, {$addToSet:{players: player }}, {new: true} )
            .then((doc) => {
                if (doc.players.length === 10)
                {
                    var msg = 'CTF game has started. Players: '
                    doc.players.forEach((player1) => {
                        msg += (`<@${player1.id}>, `)
                    })
                    message.channel.send(msg)
                    
                    connect_steamid(doc.players, 'ctf')
                    .then(teams1 => {
                        setTimeout(() => { 
                            teams(teams1)
                            .then(teams => {
                                console.log(teams)
                                const embed = new discordJS.MessageEmbed()
                                .setTitle('TDM Pickup game started')
                                .setFields(
                                {
                                    name: 'Red team' ,
                                    value: `${teams.redTeam}`,
                                    inline: true,
                                },
                                {
                                    name: 'Blue team' ,
                                    value: `${teams.blueTeam}`,
                                    inline: true,
                                })
                                message.channel.send(embed)
                            })
                         }, 1500);
                    })

                    doc.players = undefined
                    doc.save()
                }
                else 
                {
                    var msg = '**CTF: **'
                    doc.players.forEach((player1) => {
                        msg += "`" + player1.username + "`" + "|"
                    })
                    message.channel.send(msg)
                }
            })

            return 
        }
        else if (args[0] === 'tdm')
        {
            Game.findOneAndUpdate({ type: 'tdm' }, {$addToSet:{players: player }}, {new: true} )
            .then(async (doc) => {
                if (doc.players.length === 4)
                {
                    var msg = 'TDM game has started. Players: '
                    doc.players.forEach((player1) => {
                        msg += (`<@${player1.id}>, `)
                    })
                    message.channel.send(msg)
                    
                    connect_steamid(doc.players, 'tdm')
                    .then(teams1 => {
                        setTimeout(() => { 
                            teams(teams1)
                            .then(teams => {
                                console.log(teams)
                                const embed = new discordJS.MessageEmbed()
                                .setTitle('TDM Pickup game started')
                                .setFields(
                                {
                                    name: 'Red team' ,
                                    value: `${teams.redTeam}`,
                                    inline: true,
                                },
                                {
                                    name: 'Blue team' ,
                                    value: `${teams.blueTeam}`,
                                    inline: true,
                                })
                                message.channel.send(embed)
                            })
                         }, 1500);
                    })

                    doc.players = undefined
                    doc.save()
                }
                else 
                {
                    var msg = ''
                    doc.players.forEach((player1) => {
                        msg += "`" + player1.username + "`" + "|"
                    })
                    message.channel.send(msg)
                }
            })
    
        }
        else if (args[0] === 'ctf')
        {
            Game.findOneAndUpdate({ type: 'ctf' }, {$addToSet:{players: player }}, {new: true} )
            .then((doc) => {
                if (doc.players.length === 10)
                {
                    var msg = 'CTF game has started. Players: '
                    doc.players.forEach((player1) => {
                        msg += (`<@${player1.id}>, `)
                    })
                    message.channel.send(msg)
                    
                    connect_steamid(doc.players, 'ctf')
                    .then(teams1 => {
                        setTimeout(() => { 
                            teams(teams1)
                            .then(teams => {
                                console.log(teams)
                                const embed = new discordJS.MessageEmbed()
                                .setTitle('TDM Pickup game started')
                                .setFields(
                                {
                                    name: 'Red team' ,
                                    value: `${teams.redTeam}`,
                                    inline: true,
                                },
                                {
                                    name: 'Blue team' ,
                                    value: `${teams.blueTeam}`,
                                    inline: true,
                                })
                                message.channel.send(embed)
                            })
                         }, 1500);
                    })

                    doc.players = undefined
                    doc.save()
                }
                else 
                {
                    var msg = ''
                    doc.players.forEach((player1) => {
                        msg += "`" + player1.username + "`" + "|"
                    })
                    message.channel.send(msg)
                }
            })
        }
    }
}