<script>
    export let archievedPlayers;
</script>

<div class="players">
    {#if archievedPlayers}
    {#each archievedPlayers as player}
    <a class="archieved" href="/{player.playerId}">
        <p class="playerName">{player.playerName}</p>
        <div>
            <p class="playerScore">{new Date(player.lastUpdated).toLocaleDateString('en-GB')}</p>
            <p class="scoreDetail">last played</p>
        </div>
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
    </a>
    {/each}
    {/if}
</div>

<style>
    .archieved {
		display: grid;
		grid-template-columns: repeat(3, auto);
		align-items: center;
		background-color: lightgrey;
		color: black;
		border-radius: var(--radiusLarge);
        text-decoration: none;
		margin-bottom: 0.5rem;
        text-align: center;
	}

    .playerName{
        text-transform: capitalize;
        margin-left: 1rem;
    }

    .playerScore{
        font-style: italic;
        margin-bottom: 0;
    }

    .scoreDetail{
        font-size: var(--extraSmall);
		margin-top: 0.1rem;
    }
</style>