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
				
				player.scores = [{score: 1, count:0}, {score: 2, count:0}, {score: 3, count:0}, {score: 4, count:0}, {score: 5, count:0}, {score: 6, count:0}, {score: 7, count: 0}]

				for (const game of player.games){
					player.scores.find(s => s.score == game.score).count++;

					player.numberOfGames++;
					player.overallScore += game.score;
				}
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
	export let players;
	
	players.sort(function(a, b) { 
		return a.overallScore - b.overallScore;
	});
</script>

<svelte:head>
	<title>Klodle</title>
</svelte:head>

<header>Klodle</header>
<main>
	<div class="players">
		<div class="tableTitle">
			<p>Pos.</p>
			<p>Name</p>
			<p>Score</p>
		</div>
		{#each players as player, i}
		<div class="container">
			<a class="playerTitle" href="/{player.playerId}">
				<p style="font-weight: bold;">{i+1}</p>
				<p>{player.playerName}</p>
				<p style="font-style: italic;">{player.overallScore / player.numberOfGames}</p>
			</a>
		</div>
		{/each}
	</div>
</main>
<footer>
	<p>Dan Kloss</p>
	<p>{new Date().getFullYear()}</p>
	<p>Version 0.5</p>
</footer>

<style>
	a { 
		text-decoration: none;
		color: black;
	}

	main{
		width: 80%;
		margin: 0 auto;
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
		grid-template-columns: repeat(3, 1fr);
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
</style>
