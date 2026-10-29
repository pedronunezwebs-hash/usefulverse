import test from 'node:test';
import assert from 'node:assert/strict';
import { createMidiFile, generateLocalMelody } from './logic.mjs';

test('local music generator creates a bounded melody and harmony filling each selected bar', () => {
  for (const bars of [4, 8]) {
    const song = generateLocalMelody({ key: 'D', scale: 'minor', tempo: 120, bars });
    assert.equal(song.melody.at(-1).startBeat + song.melody.at(-1).duration, bars * 4);
    assert.equal(song.harmony.length, bars);
    assert.ok(song.melody.every(({ note, duration }) => Number.isInteger(note) && note >= 60 && note <= 94 && duration >= 0.5 && duration <= 2));
    assert.ok(Object.isFrozen(song) && Object.isFrozen(song.melody) && Object.isFrozen(song.harmony));
  }
});

test('local music generator rejects unsupported musical settings', () => {
  for (const options of [{ key: 'Db' }, { scale: 'dorian' }, { tempo: 49 }, { tempo: 181 }, { tempo: 90.5 }, { bars: 3 }]) {
    assert.throws(() => generateLocalMelody(options), RangeError);
  }
});

test('local music generator exports a bounded format-one MIDI file', () => {
  const song = generateLocalMelody({ key: 'F#', scale: 'major', tempo: 90, bars: 4 });
  const midi = createMidiFile(song);
  assert.equal(String.fromCharCode(...midi.slice(0, 4)), 'MThd');
  assert.deepEqual([...midi.slice(8, 14)], [0, 0, 0, 1, 1, 0xe0]);
  assert.equal(String.fromCharCode(...midi.slice(14, 18)), 'MTrk');
  const trackLength = new DataView(midi.buffer, midi.byteOffset, midi.byteLength).getUint32(18, false);
  assert.equal(trackLength, midi.length - 22);
  assert.deepEqual([...midi.slice(-4)], [0, 0xff, 0x2f, 0]);
  assert.throws(() => createMidiFile(null), TypeError);
  assert.throws(() => createMidiFile({ ...song, melody: [{ startBeat: 0, duration: 33, note: 60 }] }), RangeError);
});
