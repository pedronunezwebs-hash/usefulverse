const KEYS = Object.freeze({ C:0, 'C#':1, D:2, 'D#':3, E:4, F:5, 'F#':6, G:7, 'G#':8, A:9, 'A#':10, B:11 });
const SCALES = Object.freeze({ major:[0,2,4,5,7,9,11], minor:[0,2,3,5,7,8,10] });
const CHORD_DEGREES = Object.freeze({ major:[0,3,4,5], minor:[0,3,4,5] });
const NOTE_NAMES = Object.freeze(['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']);
const randomIndex = (length) => {
  const limit = Math.floor(0x1_0000_0000 / length) * length;
  const value = new Uint32Array(1);
  do { crypto.getRandomValues(value); } while (value[0] >= limit);
  return value[0] % length;
};

export function generateLocalMelody({ key = 'C', scale = 'major', tempo = 100, bars = 4 } = {}) {
  if (!Object.hasOwn(KEYS,key) || !Object.hasOwn(SCALES,scale)) throw new RangeError('Choose a supported key and scale.');
  const bpm = Number(tempo); const barCount = Number(bars);
  if (!Number.isInteger(bpm) || bpm < 50 || bpm > 180) throw new RangeError('Tempo must be a whole number from 50 to 180 BPM.');
  if (![4,8].includes(barCount)) throw new RangeError('Choose four or eight bars.');
  const steps = SCALES[scale]; const root = 60 + KEYS[key]; const melody = []; const harmony = [];
  let priorDegree = 3;
  for (let bar = 0; bar < barCount; bar++) {
    const chordDegree = CHORD_DEGREES[scale][bar % 4];
    const chordRoot = root + steps[chordDegree];
    const third = chordRoot + (scale === 'minor' && [0,3,4].includes(chordDegree) ? 3 : 4);
    const fifth = chordRoot + 7;
    harmony.push({ startBeat:bar*4, duration:4, notes:[chordRoot-12,third-12,fifth-12] });
    let offset = 0;
    while (offset < 4) {
      const durations = [0.5,1,1,1,1.5,2].filter((duration)=>duration<=4-offset);
      const duration = durations[randomIndex(durations.length)];
      let degree;
      if (offset === 0 || randomIndex(100) < 42) degree = [chordDegree,(chordDegree+2)%7,(chordDegree+4)%7][randomIndex(3)];
      else degree = Math.max(0,Math.min(6,priorDegree + [-2,-1,0,1,2][randomIndex(5)]));
      const note = root + steps[degree] + 12 * (degree >= 5 ? 1 : 0);
      melody.push({ startBeat:bar*4+offset, duration, note, noteName:`${NOTE_NAMES[note%12]}${Math.floor(note/12)-1}`, degree });
      priorDegree = degree; offset += duration;
    }
  }
  return Object.freeze({ key, scale, tempo:bpm, bars:barCount, melody:Object.freeze(melody.map(Object.freeze)), harmony:Object.freeze(harmony.map(({startBeat,duration,notes})=>Object.freeze({startBeat,duration,notes:Object.freeze(notes)}))) });
}

function variableLength(value) {
  let buffer = value & 0x7f;
  while ((value >>= 7)) buffer = (buffer << 8) | ((value & 0x7f) | 0x80);
  const bytes=[];
  while (true) { bytes.push(buffer & 0xff); if (buffer & 0x80) buffer >>= 8; else break; }
  return bytes;
}

export function createMidiFile(song) {
  if (!song || !Array.isArray(song.melody) || !Array.isArray(song.harmony) || ![4,8].includes(song.bars) || !Number.isInteger(song.tempo) || song.tempo < 50 || song.tempo > 180 || song.melody.length < 1 || song.melody.length > 128 || song.harmony.length !== song.bars) throw new TypeError('Generate a supported melody before exporting MIDI.');
  const validEvent = (event, notes) => Number.isFinite(event.startBeat) && event.startBeat >= 0 && Number.isFinite(event.duration) && event.duration > 0 && event.startBeat + event.duration <= song.bars * 4 && Array.isArray(notes) && notes.length >= 1 && notes.length <= 3 && notes.every((note) => Number.isInteger(note) && note >= 0 && note <= 127);
  if (song.melody.some((note) => !validEvent(note, [note.note])) || song.harmony.some((chord) => !validEvent(chord, chord.notes))) throw new RangeError('MIDI notes or durations are outside supported limits.');
  const events=[{tick:0,bytes:[0xff,0x51,0x03,(60_000_000/song.tempo)>>16&255,(60_000_000/song.tempo)>>8&255,(60_000_000/song.tempo)&255]},{tick:0,bytes:[0xff,0x58,0x04,4,2,24,8]}];
  for(const note of song.melody){const start=Math.round(note.startBeat*120);const end=Math.round((note.startBeat+note.duration)*120);events.push({tick:start,bytes:[0x90,note.note,92]},{tick:end,bytes:[0x80,note.note,0]});}
  for(const chord of song.harmony)for(const note of chord.notes){const start=Math.round(chord.startBeat*120);const end=Math.round((chord.startBeat+chord.duration)*120);events.push({tick:start,bytes:[0x90,note,46]},{tick:end,bytes:[0x80,note,0]});}
  events.sort((a,b)=>a.tick-b.tick || a.bytes[0]-b.bytes[0]);
  const track=[];let prior=0;for(const event of events){track.push(...variableLength(event.tick-prior),...event.bytes);prior=event.tick;}track.push(0,0xff,0x2f,0);
  const header=[0x4d,0x54,0x68,0x64,0,0,0,6,0,0,0,1,1,0xe0];
  const chunk=[0x4d,0x54,0x72,0x6b,(track.length>>>24)&255,(track.length>>>16)&255,(track.length>>>8)&255,track.length&255,...track];
  return new Uint8Array([...header,...chunk]);
}
