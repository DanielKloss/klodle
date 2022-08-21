<script>
	import { selectedLeaderboard } from "$lib/stores/leaderboardState.js";
    import FaMedal from 'svelte-icons/fa/FaMedal.svelte'
    
    let trophyClasses = ["gold", "silver", "bronze"];

    export let leaderboardPlayers;

    $: $selectedLeaderboard, leaderboardPlayers = leaderboardPlayers.sort(sortPlayers);

    function sortPlayers(a, b) { 
        if(!isFinite(a.todaysScore) && isFinite(b.todaysScore)) {
            return 1;
        } else if(!isFinite(b.todaysScore) && isFinite(a.todaysScore)) {
            return -1;
        }else if (a.todaysScore - b.todaysScore != 0){
            return a.todaysScore - b.todaysScore;
        } else if (a.data.dailyGold - b.data.dailyGold != 0){
            return a.data.dailyGold - b.data.dailyGold;
        } else if (a.data.dailySilver - b.data.dailySilver != 0){
            return a.data.dailySilver - b.data.dailySilver;
        } else if (a.data.dailyBronze - b.data.dailyBronze != 0){
            return a.data.dailyBronze - b.data.dailyBronze;
        } else if (a.todaysTime > b.todaysTime){
            return 1;
        } else if (a.todaysTime < b.todaysTime){
            return -1;
        }
	};

    leaderboardPlayers = leaderboardPlayers.sort(sortPlayers);

    let todaysDate = new Date().toLocaleDateString('en-GB', {day:'numeric', month:'short'});
</script>

<div class="players">
    <div class="tableTitle">
        <p class="todaysDate">{todaysDate}</p>
        <p>Pos.</p>
        <p>Name</p>
        <p>Score</p>
        <p>Medals</p>
    </div>
    {#each leaderboardPlayers as player, i}
    <a class="player {trophyClasses[i]}" href="/{player.ref['@ref'].id}">
        {#if i < 3}
        <div class="trophy">
            <FaMedal/>
        </div>
        {:else}
        <div class="trophy"></div>
        {/if}
        <p class="position">{i+1}</p>
        <p class="playerName">{player.data.playerName}</p>
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
        <div class="trophySection">
            <div class="trophyCount gold"><p>{player.data.dailyGold}</p></div>
            <div class="trophyCount silver"><p>{player.data.dailySilver}</p></div>
            <div class="trophyCount bronze"><p>{player.data.dailyBronze}</p></div>
        </div>
    </a>
    {/each}
    <p class="sortedExplanation">Sorted by: <b>1) Score</b> then by <b>2) Fewest Gold Medals 3) Fewest Silver Medals 4) Fewest Bronze Medals</b> then by <b>5) Time Completed</b></p>
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

    .todaysDate {
        margin-left: 1rem;
    }
</style>