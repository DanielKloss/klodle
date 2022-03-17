<script context="module">
	export async function load ({ fetch }){
		try {
			let archievedPlayers = [];
			let leaderboardPlayers = [];
        	let todaysDate = new Date().toJSON().slice(0, 10).toString();
        	let yesterdaysDate = new Date(new Date().setDate(new Date().getDate()-1));

			const playersResult = await fetch('/api/players');
			const playersBody = await playersResult.json();
			const players = playersBody.players;

			for (const player of players) {
				const gamesResult = await fetch(`/api/games?id=${player.playerId}`);
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

				player.scores = [{score: 1, count:0}, {score: 2, count:0}, {score: 3, count:0}, {score: 4, count:0}, {score: 5, count:0}, {score: 6, count:0}, {score: 7, count: 0}]

				let streakCount = 0;

				for (const game of player.games){
					player.scores.find(s => s.score == game.score).count++;

					player.numberOfGames++;
					player.overallScore += game.score;

					if (game.score > 6){
						player.numberOfFails++;
						if (streakCount > player.biggestStreak){
							player.biggestStreak = streakCount;
						}
						streakCount = 0;
					} else {
						streakCount++;
					}

					if (new Date(game.gameDate).toJSON().slice(0, 10).toString() == todaysDate){
                		player.todaysScore = game.score;
						player.todaysTime = new Date(game.gameDate).toJSON().slice(11, 16).toString();
            		} else if (new Date(game.gameDate).toJSON().slice(0, 10).toString() == yesterdaysDate){
						player.yesterdaysScore = game.score;
						player.yesterdaysTime = newDate(game.gameDate).toJSON().slice(11, 16).toString();
					}

					let gameHour = new Date(game.gameDate).getHours();

					if (gameHour < 10){
						player.earlyBird++;
					} else if (gameHour >= 10 && gameHour < 17){
						player.afternoonChiller++;
					} else {
						player.nightOwl++;
					}
				}

				if (player.numberOfFails == 0 || streakCount > player.biggestStreak){
					player.biggestStreak = streakCount;
				}
				player.currentStreak = streakCount;

				player.averageScore = player.overallScore / player.numberOfGames;

				player.games.sort(function(a,b){
					return new Date(b.gameDate) - new Date(a.gameDate);
				});

				const week = 1000 * 60 * 60 * 24 * 7;
    			const weekAgo = Date.now() - week;

				if (player.games.length > 0){
					player.lastUpdated = new Date(player.games[0].gameDate).toJSON().slice(0, 10).toString();
					if (new Date(player.games[0].gameDate) < weekAgo) {
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
	<p>Version 2.0</p>
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