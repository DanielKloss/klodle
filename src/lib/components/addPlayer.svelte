<script>
	export let currentPlayer;
	export let buttonText;
	export let placeholder;
	let newPlayerName;
    let error;

	const addNewPlayer = async () => {
		if (newPlayerName == "" || newPlayerName == undefined){
			error = "Please enter your name";
			newPlayerName = ""
			return;
		}

		newPlayerName = newPlayerName.trim().toLowerCase();
		let resultPlayer;

		if (currentPlayer == undefined){
			resultPlayer = await fetch(`/api/players`, {method: 'POST', body: JSON.stringify(newPlayerName), headers: {'Content-Type': 'application/json'}});
		} else if (newPlayerName == currentPlayer.playerName){
			return;
		} else {
			currentPlayer.playerName = newPlayerName;
			if (currentPlayer.changedName == null){
				currentPlayer.changedName = 1;
			} else {
				currentPlayer.changedName++;
			}
			resultPlayer = await fetch(`/api/players`, {method: 'PUT', body: JSON.stringify(currentPlayer), headers: {'Content-Type': 'application/json'}});
		}

        if (resultPlayer.status != 200 ) {
            console.log(500, "something wrong with the database");
			error = resultPlayer.message;
            return;
        }

		newPlayerName = "";
		location.reload();
	};
</script>

<div class="addPlayer">
    <input placeholder={placeholder} class="addPlayerText" bind:value={newPlayerName}/>
    <button class="addPlayerButton" on:click="{() => addNewPlayer()}">{buttonText}</button>
</div>
{#if error != undefined}
<p class="container error">
    {error}
</p>
{/if}

<style>
    .addPlayer {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.error {
		text-align: center;
		justify-content: center;
		color: hsl(var(--accent1));
	}

    .addPlayerButton {
		border-radius: var(--radiusSmall);
		border: 0px;
		text-transform: uppercase;
        font-size: var(--large);
        padding: 0.5rem 0.75rem;
        background-color: hsl(var(--accent1));
		color: white;
	}

	.addPlayerText {
		border-radius: var(--radiusLarge);
		padding-left: 1rem;
	}
</style>