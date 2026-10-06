export function parseTournamentEntrants(value) {
  const names = String(value ?? '').split(/\r?\n/u).map((name) => name.trim()).filter(Boolean);
  if (names.length < 2 || names.length > 64) throw new RangeError('Enter between 2 and 64 participants.');
  if (names.some((name) => name.length > 50)) throw new RangeError('Each participant name must be 50 characters or fewer.');
  const normalized = names.map((name) => name.normalize('NFKC').toLocaleLowerCase());
  if (new Set(normalized).size !== names.length) throw new TypeError('Participant names must be unique.');
  return names;
}

function match(players, ready) {
  return { players, ready, winner: null };
}

export function createTournamentBracket(entries, { shuffle = false } = {}, random = Math.random) {
  const entrants = parseTournamentEntrants(entries);
  const ordered = [...entrants];
  if (shuffle) {
    for (let i = ordered.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
    }
  }
  let size = 1;
  while (size < ordered.length) size *= 2;
  const firstRound = Array.from({ length: size / 2 }, (_, index) => {
    const players = [ordered[index * 2] ?? null, ordered[index * 2 + 1] ?? null];
    const current = match(players, [true, true]);
    if (players[0] && !players[1]) current.winner = players[0];
    if (!players[0] && players[1]) current.winner = players[1];
    return current;
  });
  const rounds = [firstRound];
  for (let count = firstRound.length / 2; count >= 1; count /= 2) {
    rounds.push(Array.from({ length: count }, () => match([null, null], [false, false])));
  }
  const bracket = { entrants: ordered, rounds };
  for (let r = 0; r < rounds.length - 1; r += 1) {
    for (let m = 0; m < rounds[r].length; m += 1) {
      const current = rounds[r][m];
      if (current.winner !== null) setFeeder(bracket, r + 1, Math.floor(m / 2), m % 2, current.winner);
    }
  }
  return bracket;
}

function setFeeder(bracket, roundIndex, matchIndex, slot, winner) {
  const next = bracket.rounds[roundIndex][matchIndex];
  next.players[slot] = winner;
  next.ready[slot] = true;
  if (!next.ready.every(Boolean)) return;
  if (next.players[0] && !next.players[1]) next.winner = next.players[0];
  else if (!next.players[0] && next.players[1]) next.winner = next.players[1];
  else if (!next.players[0] && !next.players[1]) next.winner = null;
  if (next.winner !== null && roundIndex < bracket.rounds.length - 1) {
    setFeeder(bracket, roundIndex + 1, Math.floor(matchIndex / 2), matchIndex % 2, next.winner);
  }
}

export function advanceTournamentBracketWinner(bracket, roundIndex, matchIndex, playerIndex) {
  if (!bracket || !Array.isArray(bracket.rounds)) throw new TypeError('Create a bracket first.');
  const round = bracket.rounds[roundIndex];
  const current = round?.[matchIndex];
  if (!current || !Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex > 1) throw new RangeError('Choose a valid match and participant.');
  if (!current.ready.every(Boolean) || !current.players[0] || !current.players[1]) throw new TypeError('This match is not ready to play.');
  if (current.winner !== null) throw new TypeError('This match already has a winner.');
  const rounds = bracket.rounds.map((items) => items.map((item) => ({ players: [...item.players], ready: [...item.ready], winner: item.winner })));
  const updated = { entrants: [...bracket.entrants], rounds };
  const selected = rounds[roundIndex][matchIndex];
  selected.winner = selected.players[playerIndex];
  if (roundIndex < rounds.length - 1) setFeeder(updated, roundIndex + 1, Math.floor(matchIndex / 2), matchIndex % 2, selected.winner);
  return updated;
}

export function getTournamentChampion(bracket) {
  const finalMatch = bracket?.rounds?.at(-1)?.[0];
  return finalMatch?.winner ?? null;
}
