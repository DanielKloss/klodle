<script context="module">
	export async function load ({ fetch }){
		try {
			const playersResult = await fetch('/api/players');
			const playersBody = await playersResult.json();
			const players = playersBody.players;

			for (const player of players) {
				const gamesResult = await fetch(`/api/games?id=${player.playerId}`);
				const gamesBody = await gamesResult.json();

				
				player.games = gamesBody.games;

				player.overallScore = 0;
				player.numberOfGames = 0;
				player.numberFails = 0;
				player.scores = [{score: 1, count:0}, {score: 2, count:0}, {score: 3, count:0}, {score: 4, count:0}, {score: 5, count:0}, {score: 6, count:0}, {score: 7, count: 0}]

				for (const game of player.games){
					player.scores.find(s => s.score == game.score).count++;

					if (game.score > 6) {
						player.numberFails++;
					}

					player.numberOfGames++;
					player.overallScore += game.score;
				}
					
				let biggestScore = Math.max(...player.scores.map(g => g.count), 0);

				for (const score of player.scores) {
					score.percentage = (Math.round(score.count / biggestScore * 100));
				}

				player.games.sort(function(a,b){
					return new Date(b.gameDate) - new Date(a.gameDate);
				});

				if (player.games.length > 0){
					player.lastUpdated = new Date(player.games[0].gameDate).toJSON().slice(0, 10).toString();
				} else {
					player.lastUpdated = null;
				}
				player.showStats = false;
			};

			return {
				props: { players }
			};
		} catch (error) {
			console.log(error);
			return error;
		}
	};
</script>

<script>	
	let date = new Date().toJSON().slice(0, 10).toString();

	export let players;
	
	players.sort(function(a, b) { 
		return a.overallScore - b.overallScore;
	});
	
	const addScore = async (player) => {
		if (player.scoreToAdd > 6 || player.scoreToAdd < 1){
			console.log("Error - must be between 1 and 6");
			return;
		}
		
		let game = { playerId: player.playerId, score: player.scoreToAdd, date: new Date().toJSON().slice(0, 10).toString(), }
		const resultGame = await fetch(`/api/games`, {method: 'POST', body: JSON.stringify(game), headers: {'Content-Type': 'application/json'}});

        if (resultGame.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

		location.reload();
	};

	const failed = async (player) => {
		let game = { playerId: player.playerId, score: 7, date: new Date().toJSON().slice(0, 10).toString(), }
		const resultGame = await fetch(`/api/games`, {method: 'POST', body: JSON.stringify(game), headers: {'Content-Type': 'application/json'}});

        if (resultGame.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

		location.reload();
	};
</script>

<header>Klodle</header>
<main>
	<div class="players">
		<div class="tableTitle">
			<p>Pos.</p>
			<p>Name</p>
			<p>Score</p>
			<p>Enter</p>
		</div>
		{#each players as player, i}
			<div class="container">
				<div class="playerTitle" on:click="{() => player.showStats = !player.showStats}">
					<p style="font-weight: bold;">{i+1}</p>
					<p>{player.playerName}</p>
					<p style="font-style: italic;">{player.overallScore / player.numberOfGames}</p>
				</div>
				<div class="inputs" class:disabled="{date == player.lastUpdated}">
					<input type="text" bind:value={player.scoreToAdd}/>
					<button class="addButton" on:click="{() => addScore(player)}">+</button>
					<button class="failButton" on:click="{() => failed(player)}">x</button>
				</div>
			</div>
		{/each}
	</div>
</main>
<footer>
	<p>Dan Kloss</p>
	<p>{new Date().getFullYear()}</p>
	<p>Version 0.2</p>
</footer>

<style>
	main{
		width: 80%;
		margin: 0 auto;
		text-transform: uppercase;
	}

	header {
		text-transform: uppercase;
		text-align: center;
		font-size: var(--large);
		font-weight: bold;
		margin-bottom: 1rem;
		background-color: hsl(var(--accent1));
		padding: 0.5rem 0;
	}

	footer {
		position: fixed;
		left: 0;
  		bottom: 0;
  		width: 100%;
		display: flex;
		justify-content: center;
		gap: 1rem;
		text-transform: uppercase;
		text-align: center;
		font-size: 0.5rem;
		background-color: hsl(var(--accent2));
	}

	.container {
		display: flex;
		margin-bottom: 0.5rem;
		gap: 0.5rem;
	}

	.tableTitle {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		justify-items: center;
		align-items: stretch;
		font-size: 0.7rem;
		border-radius: var(--radiusLarge);
		background-color: hsl(var(--accent2));
		margin-bottom: 0.5rem;
	}

	.playerTitle {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 1fr;
		justify-items: center;
		align-items: stretch;
	}

	.inputs{
		display: flex;
		align-items: stretch;
	}

	input, button{
		margin: 0.1rem;
	}

	input[type="text"]{
		width: 1.5rem;
		text-align: center;
		border-radius: var(--radiusSmall);
	}

	.failButton{
		border-radius: var(--radiusSmall);
		border: 0px;
		background-color: hsl(var(--accent3));
	}

	.addButton{
		border-radius: var(--radiusSmall);
		border: 0px;
		background-color: hsl(var(--accent4));
	}

	.players > :global(:nth-child(2) > .playerTitle) {
  		background-color: #FFE764;
		border-radius: var(--radiusLarge);
	}
	
	.players > :global(:nth-child(3) > .playerTitle) {
  		background-color: #EEEEEE;
		border-radius: var(--radiusLarge);
	}
	
	.players > :global(:nth-child(4) > .playerTitle) {
  		background-color: #FFC48B;
		border-radius: var(--radiusLarge);
	}

	.disabled {
		pointer-events: none;
	}

	.disabled * {
		background-color: #bbb;
	}
</style>
