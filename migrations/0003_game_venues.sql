-- MyShishapedia - Shisha Drop: lige kafića (lib/game-venues.mjs).
-- Ove tabele lib/game-api.mjs pravi i sam pri prvom pozivu; ovaj fajl je samo za ručno pokretanje.

CREATE TABLE IF NOT EXISTS game_venue_scores (
  venue      TEXT    NOT NULL,
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
  PRIMARY KEY (venue, day, device)
);
CREATE INDEX IF NOT EXISTS game_venue_scores_day ON game_venue_scores (venue, day, score DESC);
CREATE INDEX IF NOT EXISTS game_venue_scores_week ON game_venue_scores (venue, week, device);

-- WiFi kafića: samo hash mreže (IPv4 adresa ili IPv6 /64), nikad sama adresa.
CREATE TABLE IF NOT EXISTS game_venue_nets (
  venue      TEXT    NOT NULL,
  net        TEXT    NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (venue, net)
);
