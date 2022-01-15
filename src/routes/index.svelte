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
				player.numberFails = 0;
				player.scores = [{score: 1, count:0}, {score: 2, count:0}, {score: 3, count:0}, {score: 4, count:0}, {score: 5, count:0}, {score: 6, count:0}]

				for (const game of player.games){
					player.scores.find(s => s.score == game.score).count++;

					if (game.score > 6) {
						player.numberFails++;
					} else {
						player.overallScore += game.score;
					}
				}
					
				let biggestScore = Math.max(...player.scores.map(g => g.count), 0);

				for (const score of player.scores) {
					score.percentage = (Math.round(score.count / biggestScore * 100));
				}

				player.games.sort(function(a,b){
					return new Date(b.gameDate) - new Date(a.gameDate);
				});

				player.lastUpdated = new Date(player.games[0]?.gameDate)?.toJSON()?.slice(0, 10)?.toString();
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

<main>
	{#each players as player, i}
		<div class="contianer">
			<div class="playerTitle" on:click="{() => player.showStats = !player.showStats}">
				<p style="font-weight: bold;">{i+1}</p>
				<p>{player.playerName}</p>
				<p style="font-style: italic;">{player.overallScore}</p>
				{#if date != player.lastUpdated}
					<div class="inputs">
						<input type="text" bind:value={player.scoreToAdd}/>
						<button class="addButton" on:click="{() => addScore(player)}">+</button>
						<button class="failButton" on:click="{() => failed(player)}">x</button>
					</div>
				{/if}
			</div>
			{#if player.showStats}
				<div class="barChart">
					{#each player.scores as score, i}
						{#if i == 6}
							<div class="barLabel">X</div>
							<div class="bar" style="width:{score.percentage}%;">{score.score}</div>
						{:else}
							<div class="barLabel">{i+1}</div>
							<div class="bar" style="width:{score.percentage}%;">{score.score}</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</main>

<style>
	main {
		width:80%;
		margin: 0 auto
	}

	.contianer {
		margin-bottom: 1rem;
	}

	.playerTitle {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		justify-items: center;
		align-items: stretch;
	}

	.inputs{
		display: flex;
	}

	input[type="text"]{
		width: 2rem;
		text-align: center;
		border-left: 2px solid;
		border-top: 2px solid;
		border-bottom: 2px solid;
		margin-top: 0.3rem;
		margin-bottom: 0.3rem;
		border-radius: 20px 0px 0px 20px;
	}

	button{
		border: 0.15rem solid black;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
		margin-top: 0.3rem;
		margin-bottom: 0.3rem;
		margin-right: 0.3rem;
	}

	.addButton{
		border-radius: 0px 20px 20px 0px;
		width: 2rem;
	}

	.failButton{
		border-color: #cc0000;
		background-color: white;
		color: #cc0000;
	}
	
	.barLabel{
		padding:0.25rem;
	}
	
	.bar{
		background-color: red;
		padding:0.25rem;
	}
	
	.barChart{
		display: grid;
		grid-template-columns: auto 1fr;
		gap:0.25rem;
	}
	
	main > :global(:nth-child(1)) {
  		background-color: #FFE764;
		border: solid #C6A700 0.25rem;
	}
	
	main > :global(:nth-child(2)) {
  		background-color: #EEEEEE;
		border: solid #959595 0.25rem;
	}
	
	main > :global(:nth-child(3)) {
  		background-color: #FFC48B;
		border: solid #A86018 0.25rem;
	}

	main > :global(:nth-child(n+4)) {
		border: solid transparent 0.25rem;
	}
</style>
