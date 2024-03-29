<script context="module">
	export async function load ({ fetch }){
		try {
			let archievedPlayers = [];
			let leaderboardPlayers = [];
        	let todaysDate = new Date().toLocaleString().slice(0, 10);

			const playersResult = await fetch('/api/players');
	 		const playersBody = await playersResult.json();
	 		const players = playersBody.players.data;

			for (const player of players) {
				const gamesResult = await fetch(`/api/games?id=${player.ref['@ref'].id}`);
				const gamesBody = await gamesResult.json();
				
				player.games = gamesBody.games;

				player.overallScore = 0;
				player.numberOfGames = 0;
				player.numberOfFails = 0;
				player.biggestStreak = 0;
				player.currentStreak = 0;

				player.earlyBird = 0;
				player.afternoonChiller = 0;
				player.nightOwl = 0;
				player.eveningRelaxer = 0;
				player.christmas = false;
				player.newYear = false;
				player.easter = false;
				player.longestDay = false;
				player.shortestDay = false;
				player.valentinesDay = false;

				player.scores = [{score: 1, count:0}, {score: 2, count:0}, {score: 3, count:0}, {score: 4, count:0}, {score: 5, count:0}, {score: 6, count:0}, {score: 7, count: 0}]

				let streakCount = 0;

				for (const game of player.games){
					player.scores.find(s => s.score == game.data.score).count++;

					player.numberOfGames++;
					player.overallScore += game.data.score;

					if (game.data.score > 6){
						player.numberOfFails++;
						if (streakCount > player.biggestStreak){
							player.biggestStreak = streakCount;
						}
						streakCount = 0;
					} else {
						streakCount++;
					}

					if (new Date(game.data.gameDate).toLocaleString().slice(0, 10) == todaysDate){
                		player.todaysScore = game.data.score;
						player.todaysTime = new Date(game.data.gameDate).toLocaleString().slice(12, 17);
            		}

					let gameHour = new Date(game.data.gameDate).getHours().toLocaleString();

					if (gameHour < 6){
						player.nightOwl++;
					} else if (gameHour >=6 && gameHour < 12) {
						player.earlyBird++;
					} else if (gameHour >= 12 && gameHour < 18){
						player.afternoonChiller++;
					} else if (gameHour >= 18){
						player.eveningRelaxer++;
					}

					if (new Date(game.data.gameDate).getMonth().toLocaleString() == "11" && new Date(game.data.gameDate).getDate().toLocaleString() == "25"){
						player.christmas = true;
					}

					if (new Date(game.data.gameDate).getMonth().toLocaleString() == "0" && new Date(game.data.gameDate).getDate().toLocaleString() == "1"){
						player.newYear = true;
					}

					if (new Date(game.data.gameDate).getMonth().toLocaleString() == "3" && new Date(game.data.gameDate).getDate().toLocaleString() == "17"){
						player.easter = true;
					}

					if (new Date(game.data.gameDate).getMonth().toLocaleString() == "5" && new Date(game.data.gameDate).getDate().toLocaleString() == "21"){
						player.longestDay = true;
					}

					if (new Date(game.data.gameDate).getMonth().toLocaleString() == "11" && new Date(game.data.gameDate).getDate().toLocaleString() == "21"){
						player.shortestDay = true;
					}

					if (new Date(game.data.gameDate).getMonth().toLocaleString() == "1" && new Date(game.data.gameDate).getDate().toLocaleString() == "14"){
						player.valentinesDay = true;
					}
				}

				let mostPlays = (Math.max(player.earlyBird, player.afternoonChiller, player.nightOwl, player.eveningRelaxer));

				if (mostPlays == player.earlyBird){
					player.playerType = "early bird";
				} else if (mostPlays == player.afternoonChiller){
					player.playerType = "afternoon chiller";
				} else if (mostPlays == player.nightOwl){
					player.playerType = "night owl";
				} else if (mostPlays == player.eveningRelaxer){
					player.playerType = "evening relaxer";
				}

				if (player.numberOfFails == 0 || streakCount > player.biggestStreak){
					player.biggestStreak = streakCount;
				}
				player.currentStreak = streakCount;

				player.averageScore = player.overallScore / player.numberOfGames;

				player.games.sort(function(a,b){
					return new Date(b.data.gameDate) - new Date(a.data.gameDate);
				});

				const week = 1000 * 60 * 60 * 24 * 7;
    			const weekAgo = Date.now() - week;

				if (player.games.length > 0){
					player.lastUpdated = new Date(player.games[0].data.gameDate).toLocaleString().slice(0, 10);
					if (new Date(player.games[0].data.gameDate) < weekAgo) {
						archievedPlayers.push(player);
					} else {
						leaderboardPlayers.push(player);
					}
				} else {
					leaderboardPlayers.push(player);
					player.lastUpdated = null;
				}

				player.biggestScore = Math.max(...player.scores.map(g => g.count), 0);

        		for (const score of player.scores) {
            		score.percentage = (Math.round(score.count / player.biggestScore * 100));
        		}
			};

			return {
				stuff: { leaderboardPlayers, archievedPlayers, todaysDate }
			};
		} catch (error) {
			console.log(error);
			return error;
		}
	};
</script>

<header>Klodle</header>

<div class="details">
	<p>Dan Kloss</p>
	<p>{new Date().getFullYear()}</p>
	<p>Version 2.2</p>
</div>

<main>
    <slot></slot>
</main>

<style>
    .message {
        font-size: var(--medium);
        text-align: center;
        margin: 0.5rem;
        padding: 0.25rem;
        background-color: hsl(var(--accent1));
        color: white;
        border-radius: var(--radiusSmall);
    }

    main{
		width: 80%;
		margin: 0 auto;
		margin-top: 1rem;
	}

	header {
		text-transform: uppercase;
		text-align: center;
		font-size: var(--extraLarge);
		font-weight: bold;
		background-color: hsl(var(--accent1));
		padding: 0.5rem 0;
	}

	.details {
		position:absolute;
		top: 0px;
		right: 0px;
		font-size: var(--extraSmall);
		color: white;
		line-height: 0;
		text-align: right;
		border-left: white 0.1rem solid;
		padding: 0.4rem;
	}
</style>