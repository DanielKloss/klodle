import { getAllPlayers, getPlayerById, insertPlayer, updatePlayer, getPlayerByName } from "../../sql";

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

	if (await (await getPlayerByName(playerName)).body.player != undefined) {
		return {
			status: 500,
			message: 'Name already taken, please choose another'
		};
	}

	await insertPlayer(playerName);

	return {
		status: 200
	};
}

export async function put(request) {
	const player = request.body;
	await updatePlayer(player);

	return {
		status: 200
	}
}