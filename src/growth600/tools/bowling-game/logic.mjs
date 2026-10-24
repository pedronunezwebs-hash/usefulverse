const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createBowlingGame() {
  return { frame: 1, rollsInFrame: [], rolls: [], rackRemaining: 10, complete: false, lastPins: null };
}

export function scoreBowlingRolls(rolls) {
  const values = [...rolls].map((value) => {
    if (!Number.isInteger(value) || value < 0 || value > 10) throw new RangeError('Each delivery must knock down 0 to 10 pins.');
    return value;
  });
  const frames = []; let cursor = 0;
  for (let frame = 1; frame <= 9; frame++) {
    if (cursor >= values.length) { frames.push({ frame, kind: 'pending', rolls: [], score: null }); continue; }
    const first = values[cursor];
    if (first === 10) {
      const score = cursor + 2 < values.length ? 10 + values[cursor + 1] + values[cursor + 2] : null;
      frames.push({ frame, kind: 'strike', rolls: [10], score }); cursor++;
      continue;
    }
    if (cursor + 1 >= values.length) { frames.push({ frame, kind: 'incomplete', rolls: [first], score: null }); cursor++; continue; }
    const second = values[cursor + 1];
    if (first + second > 10) throw new RangeError(`Frame ${frame}: the two deliveries cannot exceed 10 pins.`);
    frames.push({ frame, kind: first + second === 10 ? 'spare' : 'open', rolls: [first, second], score: first + second === 10 ? (cursor + 2 < values.length ? 10 + values[cursor + 2] : null) : first + second });
    cursor += 2;
  }
  if (cursor < values.length) {
    const first = values[cursor];
    if (first === undefined) frames.push({ frame: 10, kind: 'pending', rolls: [], score: null });
    else if (first === 10) {
      const second = values[cursor + 1]; const third = values[cursor + 2];
      if (second === undefined) frames.push({ frame: 10, kind: 'incomplete', rolls: [first], score: null });
      else if (third === undefined) frames.push({ frame: 10, kind: 'incomplete', rolls: [first, second], score: null });
      else if (second < 10 && second + third > 10) throw new RangeError('Frame 10: the bonus deliveries exceed the available pins.');
      else frames.push({ frame: 10, kind: 'strike', rolls: [first, second, third], score: 10 + second + third });
    } else {
      const second = values[cursor + 1];
      if (second === undefined) frames.push({ frame: 10, kind: 'incomplete', rolls: [first], score: null });
      else if (first + second > 10) throw new RangeError('Frame 10: the first two deliveries cannot exceed 10 pins.');
      else if (first + second === 10) {
        const bonus = values[cursor + 2];
        frames.push({ frame: 10, kind: 'spare', rolls: bonus === undefined ? [first, second] : [first, second, bonus], score: bonus === undefined ? null : 10 + bonus });
      } else frames.push({ frame: 10, kind: 'open', rolls: [first, second], score: first + second });
    }
  } else frames.push({ frame: 10, kind: 'pending', rolls: [], score: null });
  let cumulative = 0; let known = true;
  for (const frame of frames) {
    if (frame.score === null) known = false;
    if (known) cumulative += frame.score;
    frame.cumulative = known ? cumulative : null;
  }
  return Object.freeze({ frames: Object.freeze(frames.map((frame) => Object.freeze(frame))), total: cumulative, complete: frames[9]?.score !== null });
}

export function rollBowlingGame(game, { aim = 0, power = 70, spin = 0 } = {}, random = Math.random) {
  if (!game || game.complete) throw new RangeError('This game is complete. Start a new game.');
  const aimValue = Number(aim); const powerValue = Number(power); const spinValue = Number(spin);
  if (![aimValue, powerValue, spinValue].every(Number.isFinite) || aimValue < -100 || aimValue > 100 || powerValue < 25 || powerValue > 100 || spinValue < -100 || spinValue > 100) throw new RangeError('Check aim, power and spin settings.');
  const alignment = clamp(1 - Math.abs(aimValue + spinValue * 0.28) / 135, 0, 1);
  const powerFit = clamp(1 - Math.abs(powerValue - 74) / 100, 0.15, 1);
  const quality = alignment * (0.45 + 0.55 * powerFit);
  const spread = Math.max(1.5, game.rackRemaining * 0.28);
  const pins = clamp(Math.round(game.rackRemaining * (0.22 + 0.78 * quality) + (random() - 0.5) * spread * 2), 0, game.rackRemaining);
  const rollsInFrame = [...game.rollsInFrame, pins]; const rolls = [...game.rolls, pins];
  let frame = game.frame; let rackRemaining = game.rackRemaining; let nextFrameRolls = rollsInFrame; let complete = false;
  if (frame < 10) {
    if (rollsInFrame.length === 1 && pins < 10) rackRemaining = 10 - pins;
    else { frame++; rackRemaining = 10; nextFrameRolls = []; }
  } else if (rollsInFrame.length === 1 && pins < 10) rackRemaining = 10 - pins;
  else if (rollsInFrame.length === 2) {
    const first = rollsInFrame[0]; const second = rollsInFrame[1];
    if (first === 10 && second < 10) rackRemaining = 10 - second;
    else if (first < 10 && first + second < 10) complete = true;
    else if (first < 10 && first + second === 10) rackRemaining = 10;
    else if (first === 10 && second === 10) rackRemaining = 10;
  } else if (rollsInFrame.length === 3) complete = true;
  const next = { frame, rollsInFrame: nextFrameRolls, rolls, rackRemaining, complete, lastPins: pins };
  const score = scoreBowlingRolls(rolls);
  return Object.freeze({ game: Object.freeze(next), score, pins, quality: Math.round(quality * 100) });
}
