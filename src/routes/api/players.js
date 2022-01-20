import { getAllPlayers, getPlayerById } from "../../sql";

export async function get(request) {
	let id = request.url.searchParams.get('id');

	if (id != null) {
		return await getPlayerById(id);
	} else {
		return await getAllPlayers();
	}
}