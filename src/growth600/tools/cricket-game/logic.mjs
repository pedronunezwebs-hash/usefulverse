const SHOTS = Object.freeze(['defend', 'ground', 'loft']);
const BOWLS = Object.freeze(['pace', 'spin', 'yorker']);
const RUNS = Object.freeze([0, 1, 2, 3, 4, 6]);
const RUN_WEIGHTS = Object.freeze({
  defend: [45, 38, 12, 1, 4, 0],
  ground: [24, 30, 16, 2, 25, 3],
  loft: [20, 14, 10, 2, 30, 24],
});

function secureIndex(length) {
  if (!globalThis.crypto?.getRandomValues || !Number.isInteger(length) || length < 1) throw new TypeError('Secure random selection is unavailable.');
  const limit = Math.floor(0x1_0000_0000 / length) * length;
  const value = new Uint32Array(1);
  do { crypto.getRandomValues(value); } while (value[0] >= limit);
  return value[0] % length;
}

function validateState(state) {
  if (!state || state.status !== 'playing' || !Array.isArray(state.inningsData) || state.inningsData.length !== 2 || ![1, 2].includes(state.innings)) throw new RangeError('Start a new match before playing another ball.');
  return state;
}

export function createCricketMatch({ overs = 1, firstChoice = 'bat' } = {}) {
  const count = Number(overs);
  if (!Number.isInteger(count) || count < 1 || count > 3) throw new RangeError('Choose 1 to 3 overs per innings.');
  if (!['bat', 'bowl'].includes(firstChoice)) throw new RangeError('Choose to bat or bowl first.');
  return Object.freeze({ overs: count, firstChoice, userBatsFirst: firstChoice === 'bat', innings: 1, target: null, status: 'playing', result: null, lastDelivery: null, inningsData: Object.freeze([Object.freeze({ runs: 0, wickets: 0, balls: 0 }), Object.freeze({ runs: 0, wickets: 0, balls: 0 })]) });
}

export function playCricketBall(currentState, choice) {
  const state = validateState(currentState);
  const userBatting = (state.innings === 1) === state.userBatsFirst;
  const userChoice = String(choice ?? '');
  if (!(userBatting ? SHOTS : BOWLS).includes(userChoice)) throw new RangeError(userBatting ? 'Choose a batting shot.' : 'Choose a bowling type.');
  const cpuChoice = userBatting ? BOWLS[secureIndex(BOWLS.length)] : SHOTS[secureIndex(SHOTS.length)];
  const shot = userBatting ? userChoice : cpuChoice;
  const bowl = userBatting ? cpuChoice : userChoice;
  const wicketChance = Math.min(0.4, ({ defend: 0.04, ground: 0.09, loft: 0.18 })[shot] + ({ pace: 0.03, spin: 0.02, yorker: 0.08 })[bowl]);
  const wicket = secureIndex(10_000) < Math.round(wicketChance * 10_000);
  let runs = 0;
  if (!wicket) {
    const weights = RUN_WEIGHTS[shot]; const total = weights.reduce((sum, weight) => sum + weight, 0); let selection = secureIndex(total);
    for (let index = 0; index < weights.length; index += 1) { if (selection < weights[index]) { runs = RUNS[index]; break; } selection -= weights[index]; }
  }
  const inningsData = state.inningsData.map((entry) => ({ ...entry }));
  const inning = inningsData[state.innings - 1]; inning.balls += 1; inning.runs += runs; if (wicket) inning.wickets += 1;
  const targetReached = state.innings === 2 && inning.runs >= state.target;
  const inningOver = inning.wickets >= 10 || inning.balls >= state.overs * 6 || targetReached;
  let next = { ...state, inningsData: Object.freeze(inningsData.map(Object.freeze)), lastDelivery: Object.freeze({ userBatting, userChoice, cpuChoice, runs, wicket }) };
  if (state.innings === 1 && inningOver) next = { ...next, innings: 2, target: inning.runs + 1 };
  else if (state.innings === 2 && inningOver) {
    const first = inningsData[0].runs; const second = inningsData[1].runs;
    next = { ...next, status: 'finished', result: second >= state.target ? state.userBatsFirst ? 'computer-win' : 'user-win' : first === second ? 'tie' : state.userBatsFirst ? 'user-win' : 'computer-win' };
  }
  return Object.freeze(next);
}
