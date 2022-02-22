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
	import { swipe } from 'svelte-gestures';
	import { fly } from 'svelte/transition';
	import AddPlayer from "$lib/components/addPlayer.svelte";
	import Archieve from "$lib/components/archieve.svelte";
	import Leaderboard from "$lib/components/leaderboard.svelte";
	import MedalLeaderboard from '$lib/components/medalLeaderboard.svelte';
	import AverageLeaderboard from '$lib/components/averageLeaderboard.svelte';
	import { selectedLeaderboard } from "$lib/stores/leaderboardState.js";

	export let leaderboardPlayers;
	export let archievedPlayers;

	let leaderboards = ["today", "average", "medals", "archieve"];
	let direction;

	function userSwiped(event) {
		direction =event.detail.direction
		let index = leaderboards.indexOf($selectedLeaderboard);
		if(direction == "left" && index < 3){
			selectedLeaderboard.set(leaderboards[index+1]);
		} else if (direction == "right" && index > 0){
			selectedLeaderboard.set(leaderboards[index-1]);
		}
	}

	const flyOut=(node)=>{
		if (direction == "right"){
			return fly(node,{x:200, duration:200})
		} else if (direction == "left"){
			return fly(node,{x:-200, duration:200})
		}
	}

	const flyIn=(node)=>{
		if (direction == "right"){
			return fly(node,{x:-200, duration:200, delay:200})
		} else if (direction == "left"){
			return fly(node,{x: 200, duration: 300, delay:200})
		}
	}
</script>

<svelte:head>
	<title>Klodle</title>
</svelte:head>

<button class="refreshButton" on:click="{() => location.reload()}"><IoMdRefresh/></button>

<div use:swipe={{ timeframe: 400, minSwipeDistance: 50, touchAction: 'pan-y' }} on:swipe={userSwiped}>
	<div class="leaderboardButtons">
		<button on:click="{() => selectedLeaderboard.set("today")}" class="leaderboardButton" class:selectedLeaderboardButton="{$selectedLeaderboard == "today"}">Today</button>
		<button on:click="{() => selectedLeaderboard.set("average")}" class="leaderboardButton" class:selectedLeaderboardButton="{$selectedLeaderboard == "average"}">Average</button>
		<button on:click="{() => selectedLeaderboard.set("medals")}" class="leaderboardButton" class:selectedLeaderboardButton="{$selectedLeaderboard == "medals"}">Medals</button>
		<button on:click="{() => selectedLeaderboard.set("archieve")}" class="leaderboardButton" class:selectedLeaderboardButton="{$selectedLeaderboard == "archieve"}">Archive</button>
	</div>


	{#if $selectedLeaderboard == "today"}
	<div in:flyIn out:flyOut>
		<Leaderboard {leaderboardPlayers}/>
	</div>
	{:else if $selectedLeaderboard == "average"}
	<div in:flyIn out:flyOut>
		<AverageLeaderboard {leaderboardPlayers}/>
	</div>
	{:else if $selectedLeaderboard == "medals"}
	<div in:flyIn out:flyOut>
		<MedalLeaderboard {leaderboardPlayers}/>
	</div>
	{:else if $selectedLeaderboard == "archieve"}
	<div in:flyIn out:flyOut>
		<Archieve {archievedPlayers}/>
	</div>
	{/if}

	<AddPlayer buttonText="add" placeholder="New Player's Name"/>
</div>

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
