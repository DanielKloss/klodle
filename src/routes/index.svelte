<script context="module">
	export async function load({ stuff }){
		return {
			props: {
				leaderboardPlayers: stuff.leaderboardPlayers,
				archievedPlayers: stuff.archievedPlayers
			}
		};
	}
</script>

<script>
	import AddPlayer from "$lib/components/addPlayer.svelte";
	import Archieve from "$lib/components/archieve.svelte";
	import Leaderboard from "$lib/components/leaderboard.svelte";
	import { todaySelected } from "$lib/stores/leaderboardState.js";

	export let leaderboardPlayers;
	export let archievedPlayers;
</script>

<svelte:head>
	<title>Klodle</title>
</svelte:head>

<div class="leaderboardButtons">
	<button on:click="{() => todaySelected.set(true)}" class="leaderboardButton" class:selectedLeaderboardButton="{$todaySelected}">Today's Scores</button>
	<button on:click="{() => todaySelected.set(false)}" class="leaderboardButton" class:selectedLeaderboardButton="{!$todaySelected}">Overall Scores</button>
</div>

<Leaderboard {leaderboardPlayers}/>
<AddPlayer buttonText="add" placeholder="New Player's Name"/>
<Archieve {archievedPlayers}/>

<style>
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
</style>
