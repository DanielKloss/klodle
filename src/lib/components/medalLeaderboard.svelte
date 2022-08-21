<script>
	import { selectedLeaderboard } from "$lib/stores/leaderboardState.js";
    
    let trophyClasses = ["gold", "silver", "bronze"];

    export let leaderboardPlayers;

    $: $selectedLeaderboard, leaderboardPlayers = leaderboardPlayers.sort(sortPlayers);

    function sortPlayers(a, b) { 
        if (b.dailyGold - a.dailyGold != 0){
            return b.data.dailyGold - a.data.dailyGold;
        } else if (b.data.dailySilver - a.data.dailySilver != 0){
            return b.data.dailySilver - a.data.dailySilver;
        } else if (b.data.dailyBronze - a.data.dailyBronze != 0){
            return b.data.dailyBronze - a.data.dailyBronze
        } else {
            return b.numberOfGames - a.numberOfGames;
        }
	};

    leaderboardPlayers = leaderboardPlayers.sort(sortPlayers);
</script>

<div class="players">
    <div class="tableTitle">
        <p>Pos.</p>
        <p>Name</p>
        <p>Medals</p>
    </div>
    {#each leaderboardPlayers as player, i}
    <a class="player {trophyClasses[i]}" href="/{player.ref['@ref'].id}">
        <p class="position">{i+1}</p>
        <p class="playerName">{player.data.playerName}</p>
        <div class="trophySection">
            <div class="trophyCount gold"><p>{player.data.dailyGold}</p></div>
            <div class="trophyCount silver"><p>{player.data.dailySilver}</p></div>
            <div class="trophyCount bronze"><p>{player.data.dailyBronze}</p></div>
        </div>
    </a>
    {/each}
    <p class="sortedExplanation">Sorted by: <b>1) Gold Medals 2) Silver Medals 3) Bronze Medals</b> then by <b>4) Games Completed</b></p>
</div>

<style>
	.tableTitle {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
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
		grid-template-columns: 1fr 2fr 1fr;
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