<script context="module">
	export async function load ({ fetch, params }){
        let date = new Date().toJSON().slice(0, 10).toString();

        const playerResult = await fetch(`/api/players?id=${params.id}`);
        const player = await playerResult.json();

        const gamesResult = await fetch(`/api/games?id=${params.id}`);
		const games = await gamesResult.json();

        player.games = games.games;

        player.games.sort(function(a,b){
            return new Date(b.gameDate) - new Date(a.gameDate);
        });

        if (player.games.length > 0){
            player.lastUpdated = new Date(player.games[0].gameDate).toJSON().slice(0, 10).toString();
        } else {
            player.lastUpdated = null;
        }

        player.numberFails = 0;
        player.numberOfGames = 0;
        player.overallScore = 0;
		player.scores = [{score: 1, count:0}, {score: 2, count:0}, {score: 3, count:0}, {score: 4, count:0}, {score: 5, count:0}, {score: 6, count:0}, {score: 7, count: 0}]

        for (const game of player.games){
            player.scores.find(s => s.score == game.score).count++;

            if (game.score > 6) {
                player.numberFails++;
            }

            player.numberOfGames++;
            player.overallScore += game.score;

            if (game.gameDate = date){
                player.todaysScore = game.score;
            }
        }
            
        let biggestScore = Math.max(...player.scores.map(g => g.count), 0);

        for (const score of player.scores) {
            score.percentage = (Math.round(score.count / biggestScore * 100));
        }

        return {
            props:{
                player
            }
        };
    }
</script>

<script>
    import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte'
    export let player;
    let scores = [1,2,3,4,5,6,7]
	let date = new Date().toJSON().slice(0, 10).toString();

    async function addScore(score) {
		let game = { playerId: player.player.playerId, score: score, date: new Date().toJSON().slice(0, 10).toString() }
		const resultGame = await fetch(`/api/games`, {method: 'POST', body: JSON.stringify(game), headers: {'Content-Type': 'application/json'}});

        if (resultGame.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

		location.reload();
	};

    const addFailed = async () => {
		let game = { playerId: player.playerId, score: 7, date: new Date().toJSON().slice(0, 10).toString() }
		const resultGame = await fetch(`/api/games`, {method: 'POST', body: JSON.stringify(game), headers: {'Content-Type': 'application/json'}});

        if (resultGame.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

		location.reload();
	};
</script>

<svelte:head>
	<title>Klodle - {player.player.playerName}</title>
</svelte:head>

<header>{player.player.playerName}</header>
<a class="backButton" href="/"><IoMdArrowRoundBack/></a>
<main>
    {#if player.lastUpdated != date}
    <p class="subHeader">Enter a score:</p>
    <div class="scoreButtons">
        {#each scores as score}
        {#if score==7}
        <button class="scoreButton" on:click="{() => addFailed()}">X</button>
        {:else}
        <button class="scoreButton" on:click="{() => addScore(score)}">{score}</button>
        {/if}
        {/each}
    </div>
    {:else}
    <p class="subHeader">Today's Score: {player.todaysScore}</p>
    {/if}
    <p class="subHeader">Stats:</p>
    <div class="overallStats">
        <p>Games: {player.numberOfGames}</p>
        <p>Lost: {player.numberFails}</p>
        <p>Win %: {((player.numberOfGames - player.numberFails) / player.numberOfGames) * 100}</p>
    </div>
    <p class="subHeader">Guess Distribution:</p>
    <div class="barChart">
        {#each player.scores as score, i}
        {#if i == 6}
        <div class="barLabel">X</div>
        <div class="bar" style="width:{score.percentage}%;">{score.count}</div>
        {:else}
        <div class="barLabel">{i+1}</div>
        <div class="bar" style="width:{score.percentage}%;">{score.count}</div>
        {/if}
        {/each}
    </div>
</main>

<style>
    p {
        margin: 0.5rem;
    }

    header {
		text-transform: uppercase;
		text-align: center;
		font-size: var(--extraLarge);
		font-weight: bold;
		margin-bottom: 1rem;
		background-color: hsl(var(--accent1));
		padding: 0.5rem 0;
	}

    .backButton {
		position:absolute;
		top: 7px;
		left: 7px;
		color: white;
        width: 32px;
        height: 32px;
	}

    main{
		width: 80%;
		margin: 0 auto;
	}

    .scoreButtons {
        display: flex;
        justify-content: space-between;
    }

    .scoreButton {
        border-radius: var(--radiusSmall);
		border: 0px;
        font-size: 1.25rem;
        padding: 0.5rem 0.75rem;
        background-color: hsl(var(--accent2));
    }

    .subHeader {
        font-weight: bold;
        font-size: 1.25rem;
    }

    .overallStats {
        display: flex;
        justify-content: space-between;
    }

    .barLabel{
		padding:0.25rem;
	}
	
	.bar{
		background-color: hsl(var(--accent1));
		padding: 0.25rem 0.75rem;
        border-radius: var(--radiusSmall);
        color: white;
	}
	
	.barChart{
		display: grid;
		grid-template-columns: auto 1fr;
		gap:0.25rem;
        margin-top: 1rem;
        padding: 0.5rem;
        background-color: hsl(var(--accent2));
        border-radius: var(--radiusLarge);
	}
</style>