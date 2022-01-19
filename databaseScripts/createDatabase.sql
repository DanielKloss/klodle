CREATE TABLE players(
	playerId int NOT NULL AUTO_INCREMENT,
    playerName varchar(255),
    PRIMARY KEY (playerId)
);

CREATE TABLE games(
	gameId int NOT NULL AUTO_INCREMENT,
    gameDate date,
    score int,
    playerId int NOT NULL,
    PRIMARY KEY (gameId),
    FOREIGN KEY (playerId) REFERENCES players (playerId) 
);

INSERT INTO players (playerName) VALUES ("Dan");