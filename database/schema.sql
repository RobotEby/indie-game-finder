
DROP DATABASE IF EXISTS indieGameFinder;
CREATE DATABASE indieGameFinder;
USE indieGameFinder;

CREATE TABLE plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE developers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(60)
) ENGINE = InnoDB;

CREATE TABLE players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    plan_id INT NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
) ENGINE = InnoDB;

CREATE TABLE games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    genre VARCHAR(60) NOT NULL,
    release_year YEAR NOT NULL,
    developer_id INT NOT NULL,
    FOREIGN KEY (developer_id) REFERENCES developers(id)
) ENGINE = InnoDB;

CREATE TABLE game_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    game_id INT NOT NULL,
    session_date DATE NOT NULL,
    minutes_played INT NOT NULL,
    UNIQUE KEY unique_player_game (player_id, game_id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
) ENGINE = InnoDB;

CREATE TABLE followers (
    player_id INT NOT NULL,
    developer_id INT NOT NULL,
    PRIMARY KEY (player_id, developer_id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (developer_id) REFERENCES developers(id)
) ENGINE = InnoDB;
