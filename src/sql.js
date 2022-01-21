import mysql from 'mysql2/promise.js';

async function getConnection() {
	return await mysql.createConnection({
		host: import.meta.env.VITE_DB_HOST,
		port: import.meta.env.VITE_DB_PORT,
		user: import.meta.env.VITE_DB_USER,
		password: import.meta.env.VITE_DB_PASSWORD,
		database: import.meta.env.VITE_DB_NAME
	});
}

export async function getAllPlayers() {
    const connection = await getConnection();
	const rows = await connection.query(
		'SELECT playerId, playerName FROM players;'
    );
    const players = rows[0];
	connection.end();
	return {
		body: {
			players
		}
	};
}

export async function getPlayerById(id) {
	const connection = await getConnection();
	const rows = await connection.query('SELECT playerId, playerName FROM players WHERE playerId = ?;', [id]);
	const player = rows[0][0];
	connection.end();
	return {
		body: {
			player
		}
	};
}

export async function getGamesFromPlayerId(id) {
    const connection = await getConnection();
    const rows = await connection.query('SELECT gameId, gameDate, score FROM games WHERE games.playerId = ?;', [id]);
    const games = rows[0];
	connection.end();
	return {
		body: {
			games
		}
	};
}

export async function insertGame(playerId, score, date) {
    const connection = await getConnection();
	await connection.query('INSERT INTO games (playerId, score, gameDate) VALUES (?,?,?);', [playerId, score, date]);
	connection.end();
}

export async function insertPlayer(playerName) {
	const connection = await getConnection();
	await connection.query('INSERT INTO players (playerName) VALUES (?);', [playerName]);
	connection.end();
}