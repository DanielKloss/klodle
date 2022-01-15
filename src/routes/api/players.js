import { getAllPlayers } from "../../sql";

export async function get() {
	return await getAllPlayers();
}