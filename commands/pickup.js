const discordJS = require('discord.js')
const fetch = require('node-fetch')
const Game = require('./../Game')
const Player = require('./../Players')

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

                            var targetTeamRating = 0;
                            teams.forEach(player => targetTeamRating += player.rating);
                            targetTeamRating = targetTeamRating/2;

                            var allPossibleTeams = combination(teams, 5);

                            allPossibleTeamRatings = allPossibleTeams.map(team => ({rating: Math.abs(targetTeamRating-team.reduce((teamRating, player) => teamRating + player.rating, 0)), teams: team}));
                            allPossibleTeamRatings.sort((a, b) => a.rating-b.rating)

                            candidateTeams = allPossibleTeamRatings.filter(team => Math.round((team.rating-allPossibleTeamRatings[0].rating + Number.EPSILON) * 100) / 100 <= 0.01)

                            var redTeam = candidateTeams[Math.floor(Math.random()*candidateTeams.length)].teams;
                            redTeam.sort((a, b) => b.rating-a.rating)
                            var blueTeam = [...teams].filter(p1 => redTeam.findIndex(p2 => p1.username === p2.username) == -1)
                            blueTeam.sort((a, b) => b.rating-a.rating)

                            console.log(redTeam)
                            console.log(redTeam.reduce((a,x) => a+x.rating,0))
                            console.log(blueTeam)
                            console.log(blueTeam.reduce((a,x) => a+x.rating,0))
                            console.log(targetTeamRating)

                            function combination(list, r) {
                            function * combinationRepeat(prefix, list, size) {
                                if (size)
                                    for (var i = 0; i < list.length; i++)
                                            yield * combinationRepeat(prefix.concat(list[i]), deepClone(list.slice(i)), size-1);
                                else yield prefix;
                            }
                            return [...combinationRepeat([], deepClone(list), r)];
                            }

                            function deepClone(obj) {
                                return JSON.parse(JSON.stringify(obj))
                            }
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
                        var teams = ''
                        setTimeout(() => { 
                            teams1.forEach(player => {
                                teams += player.username  + ":" + "`" + player.rating + "`" + "\n"
                            })
                            const embed = new discordJS.MessageEmbed()
                            .setTitle('CTF Pickup game started')
                            .setDescription(teams)
                            message.channel.send(embed)
                         }, 1000);
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
                            .setDescription(teams)
                            message.channel.send(embed)
                         }, 1000);
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
                        var teams = ''
                        setTimeout(() => { 
                            teams1.forEach(player => {
                                teams += player.username  + ":" + "`" + player.rating + "`" + "\n"
                            })
                            const embed = new discordJS.MessageEmbed()
                            .setTitle('CTF Pickup game started')
                            .setDescription(teams)
                            message.channel.send(embed)
                         }, 1000);
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