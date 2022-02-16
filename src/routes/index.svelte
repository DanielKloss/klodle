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
	import IoMdRefresh from 'svelte-icons/io/IoMdRefresh.svelte'
	import AddPlayer from "$lib/components/addPlayer.svelte";
	import Archieve from "$lib/components/archieve.svelte";
	import Leaderboard from "$lib/components/leaderboard.svelte";
	import MedalLeaderboard from '$lib/components/medalLeaderboard.svelte';
	import { selectedLeaderboard } from "$lib/stores/leaderboardState.js";
import AverageLeaderboard from '$lib/components/averageLeaderboard.svelte';

	export let leaderboardPlayers;
	export let archievedPlayers;
</script>

<svelte:head>
	<title>Klodle</title>
</svelte:head>

<button class="refreshButton" on:click="{() => location.reload()}"><IoMdRefresh/></button>

<div class="leaderboardButtons">
	<button on:click="{() => selectedLeaderboard.set("today")}" class="leaderboardButton" class:selectedLeaderboardButton="{$selectedLeaderboard == "today"}">Today</button>
	<button on:click="{() => selectedLeaderboard.set("average")}" class="leaderboardButton" class:selectedLeaderboardButton="{$selectedLeaderboard == "average"}">Average</button>
	<button on:click="{() => selectedLeaderboard.set("medals")}" class="leaderboardButton" class:selectedLeaderboardButton="{$selectedLeaderboard == "medals"}">Medals</button>
	<button on:click="{() => selectedLeaderboard.set("archieve")}" class="leaderboardButton" class:selectedLeaderboardButton="{$selectedLeaderboard == "archieve"}">Archive</button>
</div>

{#if $selectedLeaderboard == "today"}
<Leaderboard {leaderboardPlayers}/>
{:else if $selectedLeaderboard == "average"}
<AverageLeaderboard {leaderboardPlayers}/>
{:else if $selectedLeaderboard == "medals"}
<MedalLeaderboard {leaderboardPlayers}/>
{:else if $selectedLeaderboard == "archieve"}
<Archieve {archievedPlayers}/>
{/if}
<AddPlayer buttonText="add" placeholder="New Player's Name"/>

<style>
    .refreshButton {
		position:absolute;
		top: 7px;
		left: 7px;
		color: white;
		background-color: transparent;
		border: none;
        width: 32px;
        height: 32px;
	}

	.leaderboardButtons {
		display: flex;
		justify-content: space-around;
		margin-bottom: 1rem;
		gap: 0.5rem;
	}

	.leaderboardButton {
		padding: 0.5rem;
		border: none;
		border-radius: var(--radiusLarge);
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		font-size: var(--small);
		font-weight: bold;
		text-transform: uppercase;
	}

	.selectedLeaderboardButton {
		background-color: hsl(var(--accent1));
		box-shadow: none;
	}
</style>
