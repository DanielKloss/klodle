<script>
	import IoMdTrophy from 'svelte-icons/io/IoMdTrophy.svelte';
	import { todaySelected } from "$lib/stores/leaderboardState.js";
    
    let trophyClasses = ["gold", "silver", "bronze"];

    export let leaderboardPlayers;

    $: $todaySelected, leaderboardPlayers = leaderboardPlayers.sort(sortPlayers);

    function sortPlayers(a, b) { 
		let firstSort;

		if ($todaySelected) {
			if(!isFinite(a.todaysScore)) {
        		return 1;
    		}
		
    		if(!isFinite(b.todaysScore)) {
        		return -1;
    		}

			firstSort = a.todaysScore - b.todaysScore;
		} else {
			if(!isFinite(a.averageScore.toFixed(1))) {
        		return 1;
    		}
		
    		if(!isFinite(b.averageScore.toFixed(1))) {
        		return -1;
    		}
			
			firstSort = a.averageScore.toFixed(1) - b.averageScore.toFixed(1);
		}

		if (firstSort != 0){
			return firstSort;
		}

		let secondSort = b.numberOfGames - a.numberOfGames;

		if (secondSort != 0){
			return secondSort;
		}

		let thirdSort = a.numberOfFails - b.numberOfFails;

		if (thirdSort != 0){
			return thirdSort;
		}

		if (a.todaysTime > b.todaysTime){
			return 1;
		} else if (b.todaysTime > a.todaysTime) {
			return -1;
		}

		return 0;
	};

    leaderboardPlayers = leaderboardPlayers.sort(sortPlayers);
</script>

<div class="players">
    <div class="tableTitle">
        <div class="trophy"></div>
        <p>Pos.</p>
        <p>Name</p>
        <p>Score</p>
    </div>
    {#each leaderboardPlayers as player, i}
    <a class="player {trophyClasses[i]}" href="/{player.playerId}">
        {#if i < 3}
        <div class="trophy">
            <IoMdTrophy/>
        </div>
        {:else}
        <div class="trophy"></div>
        {/if}
        <p class="position">{i+1}</p>
        <p class="playerName">{player.playerName}</p>
        {#if $todaySelected}
            {#if player.todaysScore == 7}
            <div>
                <p class="playerScore">X</p>
                <p class="scoreDetail">at {player.todaysTime}</p>
            </div>
            {:else if player.todaysScore == undefined}
            <p>-</p>
            {:else}
            <div>
                <p class="playerScore">{player.todaysScore}</p>
                <p class="scoreDetail">at {player.todaysTime}</p>
            </div>
            {/if}
        {:else}
            {#if !isFinite(player.averageScore)}
            <p class="playerScore">-</p>
            {:else}
            <div>
                <p class="playerScore">{player.averageScore.toFixed(1)}</p>
                {#if player.numberOfGames > 1}
                <p class="scoreDetail">from {player.numberOfGames} games</p>
                {:else}
                <p class="scoreDetail">from {player.numberOfGames} game</p>
                {/if}
            </div>
            {/if}
        {/if}
    </a>
    {/each}
    {#if $todaySelected}
    <p class="sortedExplanation"><b>Sorted by: 1)</b> Score <b>2)</b> Time Completed <b>3)</b> Number of Fails</p>
    {:else}
    <p class="sortedExplanation"><b>Sorted by: 1)</b> Score <b>2)</b> Games Completed <b>3)</b> Number of Fails</p>
    {/if}
</div>

<style>
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

    .player{
        text-decoration: none;
		color: black;
		margin-bottom: 0.5rem;
		display: grid;
		grid-template-columns: auto repeat(3, 1fr);
		align-items: center;
		text-align: center;
    }

    .position {
        font-weight: bold;
    }

    .playerName{
        text-transform: capitalize;
    }

    .playerScore{
        font-style: italic;
        margin-bottom: 0;
    }

    .scoreDetail{
        font-size: var(--extraSmall);
		margin-top: 0.1rem;
    }

    .trophy {
		width: 20px;
		height: 20px;
		margin-left: 1rem;
	}

    .gold {
  		background-color: #FFE764;
		border-radius: var(--radiusLarge);
	}
	
	.silver {
  		background-color: #EEEEEE;
		border-radius: var(--radiusLarge);
	}
	
	.bronze {
  		background-color: #FFC48B;
		border-radius: var(--radiusLarge);
	}

    .sortedExplanation {
        font-size: var(--extraSmall);
        text-align: center;
    }
</style>