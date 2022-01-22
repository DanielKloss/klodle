<script context="module">
	export async function load ({ fetch }){
		try {
        	let date = new Date().toJSON().slice(0, 10).toString();

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

					if (new Date(game.gameDate).toJSON().slice(0, 10).toString() == date){
                		player.todaysScore = game.score;
            		}
				}

				player.averageScore = player.overallScore / player.numberOfGames;
				console.log(player.averageScore);
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
	import IoMdTrophy from 'svelte-icons/io/IoMdTrophy.svelte';
	export let players;
	let newPlayerName;
	let error;
	let todaySelected = true;
	
	function sortPlayers(a, b) { 
		let primarySort;

		if (todaySelected) {
			if(!isFinite(a.todaysScore)) {
        		return 1;
    		}
		
    		if(!isFinite(b.todaysScore)) {
        		return -1;
    		}

			primarySort = a.todaysScore - b.todaysScore;
		} else {
			if(!isFinite(a.averageScore)) {
        		return 1;
    		}
		
    		if(!isFinite(b.averageScore)) {
        		return -1;
    		}
			
			primarySort = a.averageScore - b.averageScore;
		}

		if (primarySort != 0){
			return primarySort;
		}

		let secondarySort = b.numberOfGames - a.numberOfGames;

		if (secondarySort != 0){
			return secondarySort;
		}

		return a.numberOfFails - b.numberOfFails;
	};

	const changeLeaderboard = (today) => {
		todaySelected = today;
		players = [...players.sort(sortPlayers)];
	};

	const addNewPlayer = async () => {
		let cleanName = newPlayerName.trim().toLowerCase();

		if (cleanName == "" || cleanName == undefined){
			error = "Please enter your name";
			return;
		} else if (players.filter(p => p.playerName == cleanName).length > 0){
			error = "Name already taken, please choose another";
			return;
		}

		const resultPlayer = await fetch(`/api/players`, {method: 'POST', body: JSON.stringify(cleanName), headers: {'Content-Type': 'application/json'}});

        if (resultPlayer.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

		location.reload();
	};

	players = [...players.sort(sortPlayers)];
</script>

<svelte:head>
	<title>Klodle</title>
</svelte:head>

<header>Klodle</header>
<div class="details">
	<p>Dan Kloss</p>
	<p>{new Date().getFullYear()}</p>
	<p>Version 1.1</p>
</div>
<main>
	<div class="leaderboardButtons">
		<button on:click="{() => changeLeaderboard(true)}" class="leaderboardButton" class:selectedLeaderboardButton="{todaySelected}">Today's Scores</button>
		<button on:click="{() => changeLeaderboard(false)}" class="leaderboardButton" class:selectedLeaderboardButton="{!todaySelected}">Overall Scores</button>
	</div>
	<div class="players">
		<div class="tableTitle">
			<div class="trophy"></div>
			<p>Pos.</p>
			<p>Name</p>
			<p>Score</p>
		</div>
		{#each players as player, i}
		<div class="container">
			<a class="playerTitle" href="/{player.playerId}">
				{#if i < 3}
			<div class="trophy">
				<IoMdTrophy/>
			</div>
			{:else}
			<div class="trophy">

			</div>
			{/if}
				<p style="font-weight: bold;">{i+1}</p>
				<p style="text-transform: capitalize;">{player.playerName}</p>
				{#if todaySelected}
					{#if player.todaysScore == 7}
					<p style="font-style: italic;">X</p>
					{:else if player.todaysScore == undefined}
					<p style="font-style: italic;">-</p>
					{:else}
					<p style="font-style: italic;">{player.todaysScore}</p>
					{/if}
				{:else}
					{#if !isFinite(player.averageScore)}
					<p style="font-style: italic;">-</p>
					{:else}
					<p style="font-style: italic;">{player.averageScore.toFixed(1)}</p>
					{/if}
				{/if}
			</a>
		</div>
		{/each}
		<div class="addPlayer">
			<input placeholder="New Player's Username" class="addPlayerText" bind:value={newPlayerName}/>
			<button class="addPlayerButton" on:click="{() => addNewPlayer()}">Add</button>
		</div>
		{#if error != undefined}
		<p class="container error">
			{error}
		</p>
		{/if}
	</div>
</main>

<style>
	a { 
		text-decoration: none;
		color: black;
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

	.leaderboardButtons {
		display: flex;
		justify-content: space-around;
		margin-bottom: 1rem;
	}

	.leaderboardButton {
		text-transform: uppercase;
		font-size: var(--medium);
		font-weight: bold;
		border: 0px;
		background-color: transparent;
		width: 30%;
	}

	.selectedLeaderboardButton {
		border-bottom: 0.2rem solid hsl(var(--accent1));
	}

	.container {
		display: flex;
		margin-bottom: 0.5rem;
		align-items: center;
		gap: 0.5rem;
	}

	.addPlayer {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.error {
		text-align: center;
		justify-content: center;
		color: hsl(var(--accent1));
	}

	.tableTitle {
		display: grid;
		grid-template-columns: auto repeat(3, 1fr);
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
		grid-template-columns: auto repeat(3, 1fr);
		grid-template-rows: 1fr;
		justify-items: center;
		align-items: center;
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

	.trophy {
		width: 20px;
		height: 20px;
		margin-left: 1rem;
	}

	.addPlayerButton {
		border-radius: var(--radiusSmall);
		border: 0px;
		text-transform: uppercase;
        font-size: var(--large);
        padding: 0.5rem 0.75rem;
        background-color: hsl(var(--accent1));
		color: white;
	}

	.addPlayerText {
		border-radius: var(--radiusLarge);
		padding-left: 1rem;
	}
</style>
