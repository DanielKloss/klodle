import { getGamesFromPlayerId, insertGame, deleteGame } from "../../sql";

export async function get(request) {
	const id = request.url.searchParams.get('id');
    return await getGamesFromPlayerId(id);
}

export async function post(request) {
	const playerId = request.body.playerId;
	const score = request.body.score;
	await insertGame(playerId, score);

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