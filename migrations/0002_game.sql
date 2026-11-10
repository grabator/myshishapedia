-- MyShishapedia: Shisha Drop (nadimci, dnevni rezultati, ograničenje upisa).
-- Radi evidencije: API (lib/game-api.mjs) iste tabele pravi sam pri prvom pozivu.
-- Sigurno je pokrenuti i ponovo.

-- Igrač: hash anonimnog ključa uređaja i nadimak. nick_key je nadimak bez razmaka,
-- znakova i dijakritika (za jedinstvenost). removed = 1: nadimak uklonjen, igrač bira novi.
CREATE TABLE IF NOT EXISTS game_players (
  device     TEXT    PRIMARY KEY,
  nick       TEXT    NOT NULL,
  nick_key   TEXT    NOT NULL UNIQUE,
  removed    INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Jedna partija dnevnog izazova po uređaju i danu (dan po vremenu u Sarajevu).
CREATE TABLE IF NOT EXISTS game_scores (
  day        TEXT    NOT NULL,
  device     TEXT    NOT NULL,
  week       TEXT    NOT NULL,
  score      INTEGER NOT NULL,
  drops      INTEGER NOT NULL,
  merges     INTEGER NOT NULL,
  golden     INTEGER NOT NULL,
  max_level  INTEGER NOT NULL,
  ms         INTEGER NOT NULL,
  iced       INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (day, device)
);
CREATE INDEX IF NOT EXISTS game_scores_day ON game_scores (day, score DESC);
CREATE INDEX IF NOT EXISTS game_scores_week ON game_scores (week, device);

-- Ograničenje broja upisa: "key" je hash IP adrese (sama adresa se ne čuva).
CREATE TABLE IF NOT EXISTS game_limits (
  key          TEXT    PRIMARY KEY,
  window_start INTEGER NOT NULL,
  hits         INTEGER NOT NULL
);

-- Uklanjanje ružnog nadimka (igrač pri sljedećem otvaranju igre bira novi):
--   UPDATE game_players SET removed = 1, nick_key = 'removed:' || device WHERE nick = 'NadimakZaUklanjanje';
