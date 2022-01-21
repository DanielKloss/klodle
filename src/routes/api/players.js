import { getAllPlayers, getPlayerById, insertPlayer } from "../../sql";

export async function get(request) {
	let id = request.url.searchParams.get('id');

	if (id != null) {
		return await getPlayerById(id);
	} else {
		return await getAllPlayers();
	}
}

export async function post(request) {
	const playerName = request.body;
	await insertPlayer(playerName);

	return {
		status: 200
	};
}