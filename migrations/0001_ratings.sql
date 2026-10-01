-- MyShishapedia: ocjene okusa i recepata (Cloudflare D1).
-- Pokreće se jednom (vidi docs/UPUTSTVO.md, "Ocjene"). Sigurno je pokrenuti i ponovo.

-- Jedna ocjena po uređaju i stavci. "device" je hash anonimnog ID-a uređaja, ne sam ID.
CREATE TABLE IF NOT EXISTS ratings (
  kind       TEXT    NOT NULL CHECK (kind IN ('flavor', 'recipe')),
  item_id    TEXT    NOT NULL,
  device     TEXT    NOT NULL,
  stars      INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (kind, item_id, device)
);

-- Zbir i broj ocjena po stavci (osvježava se pri svakoj ocjeni), da čitanje svih
-- prosjeka ne mora prolaziti kroz sve pojedinačne ocjene.
CREATE TABLE IF NOT EXISTS rating_totals (
  kind    TEXT    NOT NULL,
  item_id TEXT    NOT NULL,
  count   INTEGER NOT NULL,
  sum     INTEGER NOT NULL,
  PRIMARY KEY (kind, item_id)
);

-- Ograničenje broja slanja: "key" je hash IP adrese (sama adresa se ne čuva).
CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT    PRIMARY KEY,
  window_start INTEGER NOT NULL,
  hits         INTEGER NOT NULL
);
