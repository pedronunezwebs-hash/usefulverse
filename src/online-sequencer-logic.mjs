export const SEQUENCER_STEPS = 16;
export const SEQUENCER_NOTES = Object.freeze([
  Object.freeze({ name: 'C5', midi: 72 }), Object.freeze({ name: 'B4', midi: 71 }),
  Object.freeze({ name: 'A4', midi: 69 }), Object.freeze({ name: 'G4', midi: 67 }),
  Object.freeze({ name: 'F4', midi: 65 }), Object.freeze({ name: 'E4', midi: 64 }),
  Object.freeze({ name: 'D4', midi: 62 }), Object.freeze({ name: 'C4', midi: 60 }),
]);

export function validateSequencerTempo(value) {
  const tempo = Number(value);
  if (!Number.isInteger(tempo) || tempo < 40 || tempo > 240) throw new RangeError('Tempo must be a whole number from 40 to 240 BPM.');
  return tempo;
}

export function emptySequence() {
  return Array.from({ length: SEQUENCER_NOTES.length }, () => Array(SEQUENCER_STEPS).fill(false));
}

export function normalizeSequence(pattern) {
  if (!Array.isArray(pattern) || pattern.length !== SEQUENCER_NOTES.length
      || pattern.some((row) => !Array.isArray(row) || row.length !== SEQUENCER_STEPS || row.some((step) => typeof step !== 'boolean'))) {
    throw new TypeError('A melody must have 8 note rows and 16 on/off steps per row.');
  }
  return pattern.map((row) => [...row]);
}

export function toggleSequenceStep(pattern, noteIndex, stepIndex) {
  const next = normalizeSequence(pattern);
  if (!Number.isInteger(noteIndex) || noteIndex < 0 || noteIndex >= SEQUENCER_NOTES.length
      || !Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex >= SEQUENCER_STEPS) throw new RangeError('Choose a valid note and one of 16 steps.');
  next[noteIndex][stepIndex] = !next[noteIndex][stepIndex];
  return next;
}

export function sequenceStepSeconds(tempo) {
  return 60 / validateSequencerTempo(tempo) / 4;
}

function variableLength(value) {
  let buffer = value & 0x7f;
  while ((value >>= 7)) buffer = (buffer << 8) | ((value & 0x7f) | 0x80);
  const bytes = [];
  for (;;) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8; else break;
  }
  return bytes;
}

export function sequenceToMidi(pattern, tempo) {
  const rows = normalizeSequence(pattern);
  const bpm = validateSequencerTempo(tempo);
  const events = [];
  const ticksPerStep = 120;
  for (let row = 0; row < rows.length; row += 1) {
    for (let step = 0; step < SEQUENCER_STEPS; step += 1) {
      if (!rows[row][step]) continue;
      const tick = step * ticksPerStep;
      events.push({ tick, bytes: [0x90, SEQUENCER_NOTES[row].midi, 96] });
      events.push({ tick: tick + 84, bytes: [0x80, SEQUENCER_NOTES[row].midi, 0] });
    }
  }
  events.sort((a, b) => a.tick - b.tick || a.bytes[0] - b.bytes[0]);
  const tempoMicros = Math.round(60_000_000 / bpm);
  const track = [0x00, 0xff, 0x51, 0x03, (tempoMicros >> 16) & 0xff, (tempoMicros >> 8) & 0xff, tempoMicros & 0xff];
  let lastTick = 0;
  for (const event of events) {
    track.push(...variableLength(event.tick - lastTick), ...event.bytes);
    lastTick = event.tick;
  }
  track.push(0x00, 0xff, 0x2f, 0x00);
  const header = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 0x01, 0xe0, 0x4d, 0x54, 0x72, 0x6b,
    (track.length >>> 24) & 0xff, (track.length >>> 16) & 0xff, (track.length >>> 8) & 0xff, track.length & 0xff];
  return new Uint8Array([...header, ...track]);
}
