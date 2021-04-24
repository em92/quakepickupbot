const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('PUG Bot')
})

app.listen(5000, () => {
    console.log('Server has started')
})

const mongoose = require('mongoose')
const db = process.env.MONGO_URI

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

const discordJS = require('discord.js')
const client = new discordJS.Client()
const fs = require('fs')
const Command = require('./Command')
const Game = require('./Game')

client.commands = new discordJS.Collection()

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for (const file of commandFiles)
{
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command)
}

const prefix = '!'

client.on('ready', () => {
    console.log('Bot has started')
})

client.on('message', message => {
    if (message.author.bot || !message.content.toLowerCase().startsWith(prefix) || message.guild === null)
        return 

    const args = message.content.slice(prefix.length).split(' ')
    const command = args.shift().toLowerCase()

    if ((command === 'add' || command === 'a'))
    {
        client.commands.get('pickup').execute(message, args)
    }
    else if (command === 'who' || command === 'w')
    {
        client.commands.get('who').execute(message, args)
    }
    else if (command === 'remove' || command === 'r')
    {
        client.commands.get('remove').execute(message, args)
    }
    else if (command === 'steamid')
    {
        client.commands.get('steamid').execute(message, args)
    }
    else if (command === 'rating')
    {
        client.commands.get('rating').execute(message, args)
    }
    else if (command === 'pull' && message.member.roles.cache.some( r=> ["Admins: Philosophers in Limbo"].includes(r.name)))
    {
        client.commands.get('pull').execute(message, args)
    }
    else if ((command === 'set' || command === 'delete' || command === 'update') && message.member.roles.cache.some( r=> ["Admins: Philosophers in Limbo"].includes(r.name)))
    {
        if (args === null)
            message.channel.send('No params entered.')
        else 
            client.commands.get('customcommand').execute(command, message, args)
    }

    Command.findOne({ Command: command.toLowerCase() })
    .then(user => {
            if (user)
            {
                if (user.Response.includes("<name>"))
                {
                    if (message.author.id === '266266272780648458')
                        message.channel.send(')))')
                    else 
                        message.channel.send(user.Response.replace('<name>', `<@${message.author.id}>`))
                } else 
                    message.channel.send(user.Response)
            }
    })
})

/*client.on('presenceUpdate', (oldPresence, newPresence) => {
    const member = newPresence.member
    console.log(member)
    if (newPresence.status === 'offline')
    {
        Game.findOneAndUpdate({ type: "tdm" }, {$pull:{ players: { id: member.id} }})
        .then(() => {
                client.channels.fetch('807196102067617844')
                .then(channel => {
                    channel.send("removed" + "`" + member.username + "`" + "from **TDM** as they went offline.")
                })
        })

        Game.findOneAndUpdate({ type: "ctf" }, {$pull:{ players: { id: member.id} }}, {new: true})
        .then((doc) => {
                client.channels.fetch('807196102067617844')
                .then(channel => {
                    channel.send("removed" + "`" + member.username + "`" + "from **CTF** as they went offline.")
                })
        })
    }
})*/

client.login(process.env.DISCORD_TOKEN)