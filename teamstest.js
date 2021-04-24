function teamstest() {
    var players = [{username:"player1",rating:30.1},{username:"player2",rating:25.0},{username:"player3",rating:32.8},{username:"player4",rating:10.5},{username:"player5",rating:16.8},{username:"player6",rating:22.4},{username:"player7",rating:26.7},{username:"player8",rating:7.8},{username:"player9",rating:36.2},{username:"player10",rating:23.5}]
    // Calculate target team rating
    var targetTeamRating = 0;
    players.forEach(player => targetTeamRating += player.rating);
    targetTeamRating = targetTeamRating/2;

    //all possible teams
    var allPossibleTeams = combination(players, 5);

    //find difference between target rating and each team rating
    allPossibleTeamRatings = allPossibleTeams.map(team => ({rating: Math.abs(targetTeamRating-team.reduce((teamRating, player) => teamRating + player.rating, 0)), players: team}));
    allPossibleTeamRatings.sort((a, b) => a.rating-b.rating)

    //only keep the teams that are best matched
    candidateTeams = allPossibleTeamRatings.filter(team => Math.round((team.rating-allPossibleTeamRatings[0].rating + Number.EPSILON) * 100) / 100 <= 0.01)

    //pick a random team from the list to be red
    var redTeam = candidateTeams[Math.floor(Math.random()*candidateTeams.length)].players;
    redTeam.sort((a, b) => b.rating-a.rating)

    //work out blue team based on red team
    var blueTeam = [...players].filter(p1 => redTeam.findIndex(p2 => p1.username === p2.username) == -1)
    blueTeam.sort((a, b) => b.rating-a.rating)

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

    var rT = ''
    redTeam.forEach(plyr => {
        rT += "`" + plyr.username + "`" + "(" + plyr.rating + ")" + "\n"
    })
    var bT = ''
    blueTeam.forEach(plyr => {
        bT += "`" + plyr.username + "`" + "(" + plyr.rating + ")" + "\n"
    })
    const teams = {
        redTeam: rT,
        redAvg: Math.round((redTeam.reduce((a,x) => a+x.rating,0)/5+ Number.EPSILON)*100)/100,
        blueTeam: bT,
        blueAvg: Math.round((blueTeam.reduce((a,x) => a+x.rating,0)/5+ Number.EPSILON)*100)/100
    }

    return teams
}

module.exports = teamstest

