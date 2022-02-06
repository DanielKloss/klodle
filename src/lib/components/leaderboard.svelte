<script>
	import { todaySelected } from "$lib/stores/leaderboardState.js";
    import FaMedal from 'svelte-icons/fa/FaMedal.svelte'
    
    let trophyClasses = ["gold", "silver", "bronze"];

    export let leaderboardPlayers;

    $: $todaySelected, leaderboardPlayers = leaderboardPlayers.sort(sortPlayers);

    function sortPlayers(a, b) { 
		if ($todaySelected) {
			if(!isFinite(a.todaysScore) && isFinite(b.todaysScore)) {
        		return 1;
    		} else if(!isFinite(b.todaysScore) && isFinite(a.todaysScore)) {
        		return -1;
    		}else if (a.todaysScore - b.todaysScore != 0){
                return a.todaysScore - b.todaysScore;
            } else if (a.dailyGold - b.dailyGold != 0){
                return a.dailyGold - b.dailyGold;
            } else if (a.dailySilver - b.dailySilver != 0){
                return a.dailySilver - b.dailySilver;
            } else if (a.dailyBronze - b.dailyBronze){
                return a.dailyBronze - b.dailyBronze;
            } else {
                return a.todaysTime - b.todaysTime;
            }
		} else {
			if(!isFinite(a.averageScore.toFixed(2)) && isFinite(b.averageScore.toFixed(2))) {
        		return 1;
    		} else if(!isFinite(b.averageScore.toFixed(2)) && isFinite(a.averageScore.toFixed(2))) {
        		return -1;
    		} else if (a.averageScore.toFixed(2) - b.averageScore.toFixed(2) != 0){
                return a.averageScore.toFixed(2) - b.averageScore.toFixed(2);
            } else if (b.numberOfGames - a.numberOfGames != 0){
                return b.numberOfGames - a.numberOfGames;
            } else if (b.dailyGold - a.dailyGold != 0){
                return b.dailyGold - a.dailyGold;
            } else if (b.dailySilver - a.dailySilver != 0){
                return b.dailySilver - a.dailySilver;
            } else {
                return b.dailyBronze - a.dailyBronze
            }
		}
	};

    leaderboardPlayers = leaderboardPlayers.sort(sortPlayers);
</script>

<div class="players">
    <div class="tableTitle">
        <div class="trophy"></div>
        <p>Pos.</p>
        <p>Name</p>
        <p>Score</p>
        <p>Medals</p>
    </div>
    {#each leaderboardPlayers as player, i}
    <a class="player {trophyClasses[i]}" href="/{player.playerId}">
        {#if i < 3}
        <div class="trophy">
            <FaMedal/>
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
                <p class="playerScore">{player.averageScore.toFixed(2)}</p>
                {#if player.numberOfGames > 1}
                <p class="scoreDetail">from {player.numberOfGames} games</p>
                {:else}
                <p class="scoreDetail">from {player.numberOfGames} game</p>
                {/if}
            </div>
            {/if}
        {/if}
        <div class="trophySection">
            <div class="trophyCount gold"><p>{player.dailyGold}</p></div>
            <div class="trophyCount silver"><p>{player.dailySilver}</p></div>
            <div class="trophyCount bronze"><p>{player.dailyBronze}</p></div>
        </div>
    </a>
    {/each}
    {#if $todaySelected}
    <p class="sortedExplanation">Sorted by: <b>1) Score</b> then by <b>2) Fewest Gold Medals 3) Fewest Silver Medals 4) Fewest Bronze Medals</b> then by <b>5) Time Completed</b></p>
    {:else}
    <p class="sortedExplanation">Sorted by: <b>1) Score</b> then by <b>2) Games Completed</b> then by <b>3) Most Gold Medals 4) Most Silver Medals 5) Most Bronze Medals</b></p>
    {/if}
</div>

<style>
	.tableTitle {
		display: grid;
		grid-template-columns: auto repeat(4, 1fr);
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
		grid-template-columns: auto repeat(4, 1fr);
		align-items: center;
		text-align: center;
		border-radius: var(--radiusLarge);
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
	}
	
	.silver {
  		background-color: #EEEEEE;
	}
	
	.bronze {
  		background-color: #FFC48B;
	}

    .sortedExplanation {
        font-size: var(--extraSmall);
        text-align: center;
    }

    .trophySection {
        display: flex;
        justify-content: center;
        background-color: hsl(var(--accent1));
        padding: 0.25rem;
        border-radius: var(--radiusLarge);
        margin-right: 0.25rem;
        gap: 0.25rem;
    }

    .trophyCount {
        font-size: var(--small);
        height: 20px;
        width: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>