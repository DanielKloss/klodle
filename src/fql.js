import faunadb from 'faunadb';
import query from 'faunadb';
import { now } from 'svelte/internal';

async function getConnection() {
	return await new faunadb.Client({
		secret: import.meta.env.VITE_FAUNA_SECRET,
		domain: 'db.eu.fauna.com',
		scheme: 'https'
	});
}

export async function getAllPlayers() {
    const connection = await getConnection();
    const players = await connection.query(
		query.Map(query.Paginate(query.Match(query.Index('all_players'))), query.Lambda('X', query.Get(query.Var('X'))))
	);
	return {
		body: {
			players
		}
	};
}

export async function getPlayerById(id) {
	const connection = await getConnection();
	const player = await connection.query(
		query.Map(
			query.Paginate(query.Match(query.Index('player_by_id'), query.Ref(query.Collection("Players"), id))),
			query.Lambda('X', query.Get(query.Var('X'))))
	);
	return {
		body: {
			player
		}
	};
}

export async function getPlayerByName(name) {
	const connection = await getConnection();
	const rows = await connection.query(
		query.Map(
			query.Paginate(query.Match(query.Index('player_by_playerName'), name)),
			query.Lambda('X', query.Get(query.Var('X')))
		)
	);
	const player = rows.data
	return {
		body: {
			player
		}
	};
}

export async function getGamesFromPlayerId(id) {
	const connection = await getConnection();
	const rows = await connection.query(
		query.Map(
			query.Paginate(query.Match(query.Index('games_by_playerId'), query.Ref(query.Collection('Players'), id))),
			query.Lambda('X', query.Get(query.Var('X')))
		)
	);
	const games = rows.data;
	return {
		body: {
			games
		}
	};
}

export async function insertGame(playerId, score) {
	const connection = await getConnection();
	await connection.query(
		query.Create(
			query.Collection("Games"),
			{
				data: {
					"playerId": playerId,
					"score": score,
					"gameDate": now()
				}
			}
		)
	);
}

export async function insertPlayer(playerName) {
	const connection = await getConnection();
	await connection.query(
		query.Create(query.Collection('Players'), {
			data: {
				"playerName": playerName,
				"dailyGold": 0,
				"dailySilver": 0,
				"dailyBronze": 0,
				"edits": 0,
				"changedName": 0
			}
		})
	);
}

export async function updatePlayer(player) {
	const connection = await getConnection();
	await connection.query(
		query.Update(query.Select("ref", query.Get(query.Match(query.Index("player_by_id"), query.Ref(query.Collection("Players"), player.id)))),
			{
				data:
				{
					playerName: player.playerName,
					edits: player.edits,
					changedName: player.changedName
				}
			}
		)
	);
}

export async function deleteGame(gameId) {
	const connection = await getConnection();
	await connection.query(
		query.Delete(query.Ref(query.Collection("Games"), gameId))
	);
}