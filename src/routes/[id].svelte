<script context="module">
	export async function load({ stuff, params }){
        let player = stuff.leaderboardPlayers.find(p => p.playerId == params.id) != undefined ? stuff.leaderboardPlayers.find(p => p.playerId == params.id) : stuff.archievedPlayers.find(p => p.playerId == params.id);

		return {
			props: {
				player,
                todaysDate: stuff.todaysDate
			}
		};
	}
</script>

<script>
    import IoMdCreate from 'svelte-icons/io/IoMdCreate.svelte'
    import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte'
    import FaMedal from 'svelte-icons/fa/FaMedal.svelte'
    import IoMdTrophy from 'svelte-icons/io/IoMdTrophy.svelte'
    import AddPlayer from '$lib/components/addPlayer.svelte';
	import GiOwl from 'svelte-icons/gi/GiOwl.svelte';
    import GiEarthWorm from 'svelte-icons/gi/GiEarthWorm.svelte'
    import GiSunglasses from 'svelte-icons/gi/GiSunglasses.svelte';

    export let player;
    export let todaysDate;

    let scores = [1,2,3,4,5,6,7]
    let forceChangeScore = false;
    let editPlayerName = false;

    async function addScore(score) {
        let playerGame = { player, score }

		const resultGame = await fetch('/api/games', {method: 'POST', body: JSON.stringify(playerGame), headers: {'Content-Type': 'application/json'}});

        console.log(resultGame);

        if (resultGame.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

        location.reload();
	};
</script>

<svelte:head>
	<title>Klodle - {player.playerName}</title>
</svelte:head>

<a class="backButton" href="/"><IoMdArrowRoundBack/></a>
<div class="section spaceBetween">
    {#if editPlayerName}
        <AddPlayer currentPlayerName={player.playerName} buttonText="change" placeholder={"Change Player's Name"}/>
    {:else}
        <p class="playerName">{player.playerName}</p>
        <div class="editButton" on:click="{() => editPlayerName = true}"><IoMdCreate/></div>
    {/if}
</div>

<div class="section">
    {#if player.lastUpdated != todaysDate || forceChangeScore}
    <p class="subHeader">Enter a score:</p>
    <div class="scoreButtons">
        {#each scores as score}
        {#if score==7}
        <button class="scoreButton" on:click="{() => addScore(7)}">X</button>
        {:else}
        <button class="scoreButton" on:click="{() => addScore(score)}">{score}</button>
        {/if}
        {/each}
    </div>
    {:else}
    <div class="spaceBetween">
        <p class="score">Today's Score: {player.todaysScore}</p>
        <div class="editButton" on:click="{() => forceChangeScore = true}"><IoMdCreate/></div>
    </div>
    {/if}
</div>
<div class="section">
    <p class="score">Average Score: {player.averageScore.toFixed(2)}</p>
</div>
<div class="section">
    <p class="subHeader">Daily Medals:</p>
    <div class="row-evenly">
        <div class="trophySection gold">
            <div class="trophy">
                <FaMedal />
            </div>
            <p class="medalCount">{player.dailyGold}</p>
        </div>
        <div class="trophySection silver">
            <div class="trophy">
                <FaMedal />
            </div>
            <p class="medalCount">{player.dailySilver}</p>
        </div>
        <div class="trophySection bronze">
            <div class="trophy">
                <FaMedal />
            </div>
            <p class="medalCount">{player.dailyBronze}</p>
        </div>
    </div>
</div>
<div class="section">
    <p class="subHeader">Achievements:</p>
    <div class="trophySection">
        {#if Math.max(player.earlyBird, player.afternoonChiller, player.nightOwl) == player.earlyBird}
        <div class="trophyContainer">
            <div class="trophyCount morning"><GiEarthWorm/></div>
            <p>Early Bird</p>
        </div>
        {:else if Math.max(player.earlyBird, player.afternoonChiller, player.nightOwl) == player.afternoonChiller}
        <div class="trophyContainer">
            <div class="trophyCount afternoon"><GiSunglasses/></div>
            <p>Afternoon Chiller</p>
        </div>
        {:else if Math.max(player.earlyBird, player.afternoonChiller, player.nightOwl) == player.nightOwl}
        <div class="trophyContainer">
            <div class="trophyCount night"><GiOwl/></div>
            <p>Night Owl</p>
        </div>
        {/if}
        {#if player.biggestStreak >= 49}
        <div class="trophyContainer">
            <div class="cannonContainer red"><img src="/images/cannon.svg" alt="49 49 undefeated" class="cannon"/></div>
            <p>49 Unbeaten</p>
        </div>
        {/if}
        {#each player.games as game, index}
            {#if (index+1) % 50 == 0 && index != 0}
            <div class="trophyContainer">
                <div class="trophyCount gold"><IoMdTrophy/></div>
                <p>{index+1} Games</p>
            </div>
            {/if}
        {/each}
    </div>
</div>
<div class="section">
    <p class="subHeader">Stats:</p>
    <div class="row-between">
        <p><b>Games:</b> {player.numberOfGames}</p>
        <p><b>Lost:</b> {player.numberOfFails}</p>
        <p><b>Win %:</b> {parseInt(((player.numberOfGames - player.numberOfFails) / player.numberOfGames) * 100)}</p>
        <p><b>Current Streak:</b> {player.currentStreak}</p>
        <p><b>Biggest Streak:</b> {player.biggestStreak}</p>
    </div>
</div>
<div class="section">
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
</div>

<style>
    p {
        margin: 0;
    }

    .backButton {
		position:absolute;
		top: 7px;
		left: 7px;
		color: white;
        width: 32px;
        height: 32px;
	}

    .trophySection {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 0.5rem;
        border-radius: var(--radiusLarge);
        padding: 0.25rem 1rem;
    }

    .trophyContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: var(--small);
        gap: 0.25rem;
    }

    .trophy {
		width: 32px;
		height: 32px;
	}

    .medalCount {
        font-size: var(--large);
    }

    .trophyCount {
        width: 60px;
		height: 60px;
		border-radius: 50%;
		padding: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: var(--small);
    }

    .section {
        margin-top: 1rem;
        padding: 0.5rem;
        background-color: hsl(var(--accent2));
        border-radius: var(--radiusLarge);
    }

    .spaceBetween {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .playerName {
        font-size: var(--extraLarge);
        text-transform: capitalize;
        color: black;
        text-align: center;
        background-color: hsl(var(--accent2));
        border-radius: var(--radiusSmall);
        padding: 0.25rem 1rem;
    }

    .editButton {
        color: lightslategray;
        width: 24px;
        height: 24px;
    }

    .score {
        font-weight: bold;
        font-size: var(--large);
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
        background-color: hsl(var(--accent1));
        color: white;
    }

    .subHeader {
        font-weight: bold;
        font-size: var(--large);
        margin-bottom: 0.5rem;
    }

    .row-between {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: space-between;
    }

    .row-evenly {
        display: flex;
        justify-content: space-evenly;
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
        grid-template-rows: auto repeat(auto);
		gap:0.25rem;
	}

    .gold {
  		background-color: #FFE764;
	}
	
	.silver {
  		background-color: #EEEEEE;
	}
	
	.bronze {
  		background-color: #FFC48B;
	}

    .morning { 
        background-color: #FFEBB3;
    }

    .afternoon {
        background-color: #FFB37B;
    }

    .night {
        background-color: #2B588C;
    }

    .cannonContainer {
        width: 60px;
		height: 60px;
		border-radius: 50%;
		padding: 0.5rem;
		display:flex;
        justify-content: center;
    }

    .red {
		background-color: #f00000;
	}

    .cannon {
		margin: 0 auto;
  		display: block;
	}
</style>
