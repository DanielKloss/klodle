<script context="module">
	export async function load({ stuff, params }){
        let player = stuff.leaderboardPlayers.find(p => p.ref['@ref'].id == params.id) != undefined ? stuff.leaderboardPlayers.find(p => p.ref['@ref'].id == params.id) : stuff.archievedPlayers.find(p => p.ref['@ref'].id == params.id);

		return {
			props: {
				player,
                todaysDate: stuff.todaysDate
			}
		};
	}
</script>

<script>
    import IoMdCreate from 'svelte-icons/io/IoMdCreate.svelte';
    import IoMdArrowRoundBack from 'svelte-icons/io/IoMdArrowRoundBack.svelte';
    import FaMedal from 'svelte-icons/fa/FaMedal.svelte';
    import IoMdTrophy from 'svelte-icons/io/IoMdTrophy.svelte';
	import GiOwl from 'svelte-icons/gi/GiOwl.svelte';
    import GiEarthWorm from 'svelte-icons/gi/GiEarthWorm.svelte';
    import GiSunglasses from 'svelte-icons/gi/GiSunglasses.svelte';
    import GiSofa from 'svelte-icons/gi/GiSofa.svelte';
    import MdFingerprint from 'svelte-icons/md/MdFingerprint.svelte';
    import GiSpy from 'svelte-icons/gi/GiSpy.svelte';
    import GiPresent from 'svelte-icons/gi/GiPresent.svelte';
    import FaGlassCheers from 'svelte-icons/fa/FaGlassCheers.svelte';
    import GiRabbit from 'svelte-icons/gi/GiRabbit.svelte';
    import WiDaySunny from 'svelte-icons/wi/WiDaySunny.svelte'
    import WiSunset from 'svelte-icons/wi/WiSunset.svelte'
    import IoIosHeart from 'svelte-icons/io/IoIosHeart.svelte'

    import AddPlayer from '$lib/components/addPlayer.svelte';
    import Modal from '$lib/components/modal.svelte';

    export let player;
    export let todaysDate;

    let scores = [1,2,3,4,5,6,7]
    let forceChangeScore = false;
    let editPlayerName = false;

    let modal;

    async function addScore(score) {
        let playerGame = { player, score }

		const resultGame = await fetch('/api/games', {method: 'POST', body: JSON.stringify(playerGame), headers: {'Content-Type': 'application/json'}});

        if (resultGame.status != 200 ) {
            console.log(500, "something wrong with the database");
            return;
        }

        if (forceChangeScore){
            if (player.data.edits == null){
                player.data.edits = 1;
            } else {
                player.data.edits++;
            }
            const resultPlayer = await fetch('/api/players', {method: 'PUT', body: JSON.stringify(player), headers: {'Content-Type': 'application/json'}});
            
            if (resultPlayer.status != 200 ) {
                console.log(500, "something wrong with the database");
                return;
            }
        }

        location.reload();
	};
</script>

<svelte:head>
	<title>Klodle - {player.data.playerName}</title>
</svelte:head>

<a class="backButton" href="/"><IoMdArrowRoundBack/></a>
<div class="section spaceBetween">
    {#if editPlayerName}
        <AddPlayer currentPlayer={player} buttonText="change" placeholder={"Change Player's Name"}/>
    {:else}
        <p class="playerName">{player.data.playerName}</p>
        <div class="editButton" on:click="{() => editPlayerName = true}"><IoMdCreate/></div>
    {/if}
</div>

{#if modal}
<Modal on:close="{() => modal = undefined}">
    {#if modal.title == "early bird"}
    <div class="trophyCount morning"><GiEarthWorm/></div>
    {:else if modal.title == "afternoon chiller"}
    <div class="trophyCount afternoon"><GiSunglasses/></div>
    {:else if modal.title == "evening relaxer"}
    <div class="trophyCount evening"><GiSofa/></div>
    {:else if modal.title == "night owl"}
    <div class="trophyCount night"><GiOwl/></div>
    {:else if modal.title == "games completed"}
    <div class="trophyCount gold"><IoMdTrophy/></div>
    {:else if modal.title == "49 undefeated"}
    <div class="cannonContainer red"><img src="/images/cannon.svg" alt="49 undefeated" class="cannon"/></div>
    {:else if modal.title == "fat fingers"}
    <div class="trophyCount finger"><MdFingerprint/></div>
    {:else if modal.title == "undercover"}
    <div class="trophyCount spy"><GiSpy/></div>
    {:else if modal.title == "deep undercover"}
    <div class="trophyCount deepSpy"><GiSpy/></div>
    {:else if modal.title == "christmas klodler"}
    <div class="trophyCount christmas"><GiPresent/></div>
    {:else if modal.title == "easter klodler"}
    <div class="trophyCount easter"><GiRabbit/></div>
    {:else if modal.title == "new year klodler"}
    <div class="trophyCount newYear"><FaGlassCheers/></div>
    {:else if modal.title == "a long days klodle"}
    <div class="trophyCount longestDay"><WiDaySunny/></div>
    {:else if modal.title == "a short days klodle"}
    <div class="trophyCount shortestDay"><WiSunset/></div>
    {:else if modal.title == "love at first klodle"}
    <div class="trophyCount valentines"><IoIosHeart/></div>
    {/if}
    <p class="subHeader capitalise">{modal.title}</p>
    <p class="">{modal.description}</p>
</Modal>
{/if}

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
    <p class="score capitalise">Player Type: {player.playerType}</p>
</div>
<div class="section">
    <p class="subHeader">Daily Medals:</p>
    <div class="row-evenly">
        <div class="trophySection gold">
            <div class="trophy">
                <FaMedal />
            </div>
            <p class="medalCount">{player.data.dailyGold}</p>
        </div>
        <div class="trophySection silver">
            <div class="trophy">
                <FaMedal />
            </div>
            <p class="medalCount">{player.data.dailySilver}</p>
        </div>
        <div class="trophySection bronze">
            <div class="trophy">
                <FaMedal />
            </div>
            <p class="medalCount">{player.data.dailyBronze}</p>
        </div>
    </div>
</div>
<div class="section">
    <p class="subHeader">Achievements:</p>
    <div class="trophySection achievementLayout">
        {#if player.earlyBird > 0}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "early bird", description: "Entered a score between 6am and 12pm"}}">
            <div class="trophyCount morning"><GiEarthWorm/></div>
            <p>Early Bird</p>
        </div>
        {/if}
        {#if player.afternoonChiller > 0}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "afternoon chiller", description: "Entered a score between 12pm and 6pm"}}">
            <div class="trophyCount afternoon"><GiSunglasses/></div>
            <p>Afternoon Chiller</p>
        </div>
        {/if}
        {#if player.eveningRelaxer > 0}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "evening relaxer", description: "Entered a score between 6pm and 12am"}}">
            <div class="trophyCount evening"><GiSofa/></div>
            <p>Evening Relaxer</p>
        </div>
        {/if}
        {#if player.nightOwl > 0}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "night owl", description: "Entered a score between 12am and 6am"}}">
            <div class="trophyCount night"><GiOwl/></div>
            <p>Night Owl</p>
        </div>
        {/if}
        {#if player.biggestStreak >= 49}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "49 undefeated", description: "Played 49 games on Klodle without losing"}}">
            <div class="cannonContainer red"><img src="/images/cannon.svg" alt="49 undefeated" class="cannon"/></div>
            <p>49 Unbeaten</p>
        </div>
        {/if}
        {#if player.edits > 2}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "fat fingers", description: "Changed your score 3 or more times"}}">
            <div class="trophyCount finger"><MdFingerprint/></div>
            <p>Fat Fingers</p>
        </div>
        {/if}
        {#if player.changedName > 0}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "undercover", description: "Changed your name"}}">
            <div class="trophyCount spy"><GiSpy/></div>
            <p>Undercover</p>
        </div>
        {/if}
        {#if player.changedName > 2}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "deep undercover", description: "Changed your name 3 or more times"}}">
            <div class="trophyCount deepSpy"><GiSpy/></div>
            <p>Deep Undercover</p>
        </div>
        {/if}
        {#if player.christmas}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "christmas klodler", description: "Entered a score on Christmas Day"}}">
            <div class="trophyCount christmas"><GiPresent/></div>
            <p>Christmas Klodler</p>
        </div>
        {/if}
        {#if player.easter}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "easter klodler", description: "Entered a score on Easter Day"}}">
            <div class="trophyCount easter"><GiRabbit/></div>
            <p>Easter Klodler</p>
        </div>
        {/if}
        {#if player.newYear}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "new year klodler", description: "Entered a score on New Years Day"}}">
            <div class="trophyCount newYear"><FaGlassCheers/></div>
            <p>New Year Klodler</p>
        </div>
        {/if}
        {#if player.longestDay}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "a long days klodle", description: "Entered a score on Summer Solstice"}}">
            <div class="trophyCount longestDay"><WiDaySunny/></div>
            <p>A Long Days Klodle</p>
        </div>
        {/if}
        {#if player.shortestDay}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "a short days klodle", description: "Entered a score on Winter Solstice"}}">
            <div class="trophyCount shortestDay"><WiSunset/></div>
            <p>A Short Days Klodle</p>
        </div>
        {/if}
        {#if player.valentinesDay}
        <div class="trophyContainer achievement" on:click="{() => modal = {title: "love at first klodle", description: "Entered a score on Valentines Day"}}">
            <div class="trophyCount valentines"><IoIosHeart/></div>
            <p>Love at First Klodle</p>
        </div>
        {/if}
        {#each player.games as game, index}
            {#if (index+1) % 50 == 0 && index != 0}
            <div class="trophyContainer achievement" on:click="{() => modal = {title: "games completed", description: "Played " + parseInt(index+1) + " games on Klodle"}}">
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
        text-align: center;
    }

    .achievementLayout {
        flex-wrap: wrap;
        align-items: flex-start;
    }

    .achievement {
        max-width: 64px;
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

    .capitalise {
        text-transform: capitalize;
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
        background-color: #FFAB9A;
    }

    .evening {
        background-color: #6F8392;
        color: #EEEEEE;
    }

    .night {
        background-color: #435158;
        color: #EEEEEE;
    }

    .finger {
        background-color: #FFDFD3;
    }

    .spy {
        background-color: darkgray;
    }

    .deepSpy {
        background-color: #222222;
        color: #EEEEEE;
    }

    .christmas {
        background-color: #aa0000;
    }

    .newYear {
        background-color: #FFF7B6;
    }

    .easter {
        background-color: #9CD5D4;
    }

    .valentines {
        background-color: #F69AB5;
    }

    .longestDay {
        background-color: #F79D39;
    }

    .shortestDay {
        background-color: #07206D;
        color: #EEEEEE;
    }

    .cannonContainer {
        width: 60px;
		height: 60px;
		border-radius: 50%;
		padding: 0.5rem;
		display:flex;
        justify-content: center;
        overflow: hidden;
    }

    .red {
		background-color: #f00000;
	}

    .cannon {
		margin: 0 auto;
  		display: block;
	}
</style>
