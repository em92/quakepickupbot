module.exports = (players) => { 
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

    const teams = {
        redTeam: redTeam,
        blueTeam: blueTeam
    }

    return teams
}
