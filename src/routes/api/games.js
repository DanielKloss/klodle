import { getGamesFromPlayerId, insertGame, deleteGame } from "../../sql";

export async function get(request) {
	const id = request.url.searchParams.get('id');
    return await getGamesFromPlayerId(id);
}

export async function post(request) {
	const todaysDate = new Date().toJSON().slice(0, 10).toString();
	const player = request.body.player;
	const score = request.body.score;

	for (const game of player.games) {
		if (game.gameDate.slice(0, 10).toString() == todaysDate) {
			let gameToDelete = game;

			const resultDelete = await deleteGame(gameToDelete.gameId);

			// if (resultDelete.status != 200) {
			// 	console.log(500, 'error deleting previously entered game');
			// 	return {
			// 		status: 500
			// 	};
			// }

			break;
		}
	}

	const resultInsert = await insertGame(player.playerId, score);

	// if (resultInsert.status != 200) {
	// 	console.log(500, 'error inserting game');
	// 	return {
	// 		status: 500
	// 	};
	// }

	return {
		status: 200
	};
}

export async function del(request) {
	const gameId = request.body.gameId;
	await deleteGame(gameId);

	return {
		status: 200
	};
}