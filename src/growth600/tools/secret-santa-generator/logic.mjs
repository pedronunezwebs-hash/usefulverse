function randomIndex(length, random) {
  const value = random(length);
  if (Number.isSafeInteger(value) && value >= 0 && value < length) return value;
  if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError('Random source must return an index in range or a fraction from 0 (inclusive) to 1 (exclusive).');
  return Math.floor(value * length);
}

function shuffle(values, random) {
  const result = values.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = randomIndex(index + 1, random);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function assignSecretSanta(names, exclusions = {}, random = Math.random) {
  if (!Array.isArray(names) || names.length < 2 || names.length > 30) throw new RangeError('Enter between 2 and 30 people.');
  if (typeof random !== 'function') throw new TypeError('Provide a random source.');
  const people = names.map((name) => String(name).trim());
  if (people.some((name) => !name || name.length > 80)) throw new RangeError('Each name must contain 1 to 80 characters.');
  const normalized = people.map((name) => name.toLocaleLowerCase());
  if (new Set(normalized).size !== people.length) throw new RangeError('Names must be unique, ignoring letter case.');
  const indexByName = new Map(normalized.map((name, index) => [name, index]));
  const forbidden = people.map((name) => new Set([indexByName.get(name.toLocaleLowerCase())]));
  for (const [giverName, excludedNames] of Object.entries(exclusions)) {
    const giver = indexByName.get(giverName.trim().toLocaleLowerCase());
    if (giver === undefined) throw new RangeError(`Unknown participant: ${giverName}.`);
    if (!Array.isArray(excludedNames)) throw new TypeError(`Exclusions for ${giverName} must be a list.`);
    for (const recipientName of excludedNames) {
      const recipient = indexByName.get(String(recipientName).trim().toLocaleLowerCase());
      if (recipient === undefined) throw new RangeError(`Unknown participant: ${recipientName}.`);
      forbidden[giver].add(recipient);
    }
  }

  const recipientToGiver = Array(people.length).fill(-1);
  function tryAssign(giver, visited) {
    for (const recipient of shuffle(people.map((_, index) => index).filter((index) => !forbidden[giver].has(index)), random)) {
      if (visited.has(recipient)) continue;
      visited.add(recipient);
      if (recipientToGiver[recipient] === -1 || tryAssign(recipientToGiver[recipient], visited)) {
        recipientToGiver[recipient] = giver;
        return true;
      }
    }
    return false;
  }
  for (const giver of shuffle(people.map((_, index) => index), random)) {
    if (!tryAssign(giver, new Set())) throw new Error('No valid Secret Santa assignment exists for these exclusions.');
  }
  const giverToRecipient = Array(people.length);
  recipientToGiver.forEach((giver, recipient) => { giverToRecipient[giver] = recipient; });
  return giverToRecipient.map((recipient, giver) => ({ giver: people[giver], recipient: people[recipient] }));
}
