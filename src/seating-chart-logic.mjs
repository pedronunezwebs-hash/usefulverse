const MAX_GUESTS = 200;
const MAX_TABLES = 40;
const MAX_SEATS = 20;

export function parseGuestNames(text) {
  const names = String(text ?? '').split(/\r?\n/u).map((name) => name.trim()).filter(Boolean);
  if (!names.length) throw new TypeError('Add at least one guest name, one per line.');
  if (names.length > MAX_GUESTS) throw new RangeError(`Use no more than ${MAX_GUESTS} guests.`);
  if (names.some((name) => name.length > 100)) throw new RangeError('Guest names must be 100 characters or fewer.');
  return names.map((name, index) => ({ id: `guest-${index + 1}`, name }));
}

function integer(value, label, min, max) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new RangeError(`${label} must be a whole number from ${min} to ${max}.`);
  return parsed;
}

export function createSeatingPlan({ guests, tableCount, seatsPerTable, random = Math.random } = {}) {
  const parsedGuests = Array.isArray(guests) ? guests.map((guest, index) => ({
    id: String(guest.id ?? `guest-${index + 1}`),
    name: String(guest.name ?? '').trim(),
  })) : parseGuestNames(guests);
  if (!parsedGuests.length || parsedGuests.length > MAX_GUESTS || parsedGuests.some(({ name }) => !name || name.length > 100)) {
    throw new RangeError(`Add between 1 and ${MAX_GUESTS} guest names, up to 100 characters each.`);
  }
  const count = integer(tableCount, 'Table count', 1, MAX_TABLES);
  const seats = integer(seatsPerTable, 'Seats per table', 1, MAX_SEATS);
  if (parsedGuests.length > count * seats) throw new RangeError(`Capacity is ${count * seats}; there are ${parsedGuests.length} guests.`);
  const shuffled = [...parsedGuests];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const sample = Number(random());
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random source must return a value from 0 up to, but not including, 1.');
    const target = Math.floor(sample * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  const tables = Array.from({ length: count }, (_, index) => ({ id: index + 1, guests: [] }));
  shuffled.forEach((guest, index) => tables[index % count].guests.push(guest));
  return { version: 1, seatsPerTable: seats, tables };
}

export function moveGuestToTable(plan, guestId, destinationId) {
  if (!plan || plan.version !== 1 || !Array.isArray(plan.tables)) throw new TypeError('Choose a valid seating plan.');
  const source = plan.tables.find((table) => table.guests.some((guest) => guest.id === guestId));
  const destination = plan.tables.find((table) => table.id === Number(destinationId));
  if (!source || !destination) throw new RangeError('Choose an existing guest and table.');
  if (source.id === destination.id) return plan;
  if (destination.guests.length >= plan.seatsPerTable) throw new RangeError('That table is full.');
  return {
    ...plan,
    tables: plan.tables.map((table) => table.id === source.id
      ? { ...table, guests: table.guests.filter((guest) => guest.id !== guestId) }
      : table.id === destination.id
        ? { ...table, guests: [...table.guests, source.guests.find((guest) => guest.id === guestId)] }
        : table),
  };
}

export function validateSeatingPlan(plan) {
  if (!plan || plan.version !== 1 || !Array.isArray(plan.tables) || plan.tables.length < 1 || plan.tables.length > MAX_TABLES) throw new TypeError('This file is not a supported seating plan.');
  const seats = integer(plan.seatsPerTable, 'Seats per table', 1, MAX_SEATS);
  const ids = new Set();
  let guests = 0;
  for (const table of plan.tables) {
    if (!table || !Number.isInteger(table.id) || !Array.isArray(table.guests) || table.guests.length > seats) throw new TypeError('A table has invalid or over-capacity guest data.');
    for (const guest of table.guests) {
      if (!guest || typeof guest.id !== 'string' || typeof guest.name !== 'string' || !guest.name.trim() || guest.name.length > 100 || ids.has(guest.id)) throw new TypeError('A guest entry is invalid or duplicated.');
      ids.add(guest.id);
      guests += 1;
    }
  }
  if (guests < 1 || guests > MAX_GUESTS) throw new RangeError(`A plan must contain between 1 and ${MAX_GUESTS} guests.`);
  return { version: 1, seatsPerTable: seats, tables: plan.tables.map((table) => ({ id: table.id, guests: table.guests.map(({ id, name }) => ({ id, name })) })) };
}

export { MAX_GUESTS, MAX_TABLES, MAX_SEATS };
