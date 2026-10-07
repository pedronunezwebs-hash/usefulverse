export const growthPilotTools = Object.freeze([
  {
    id: 'stair-calculator',
    category: 'home-materials',
    type: 'calculator',
    primaryIntent: 'stair calculator',
    secondaryIntents: ['stair rise run calculator', 'staircase calculator', 'stair stringer length calculator'],
    functions: ['total rise and user-selected riser count', 'riser height, tread count, total run, pitch angle and stringer length', 'scaled side-profile SVG drawing', 'metric and imperial units'],
    acceptance: '2.8 m total rise with 16 risers gives 0.175 m per riser and 15 treads; at 0.28 m tread depth, total run is 4.2 m.',
    boundary: 'Geometry estimate only. It does not check building codes, headroom, landings, structure, guardrails or site conditions. Confirm all plans with local regulations and a qualified builder.',
    relatedExistingIds: ['unit-converter'],
    logicModule: './tools/stair-calculator/logic.mjs',
  },
  {
    id: 'tire-size-calculator',
    category: 'home-materials',
    type: 'calculator',
    primaryIntent: 'tire size calculator',
    secondaryIntents: ['tire diameter calculator', 'tire circumference calculator', 'compare tire sizes', 'speedometer tire size difference'],
    functions: ['parse metric tire sizes such as 205/55R16', 'nominal sidewall height, outer diameter, circumference and revolutions per distance', 'compare diameter and estimated speedometer difference', 'show ground-clearance change from nominal diameter difference'],
    acceptance: '205/55R16 has a nominal diameter of approximately 631.9 mm; comparing it with itself returns zero difference.',
    boundary: 'Uses nominal metric tire-size geometry only. It does not confirm wheel, suspension, brake, load, speed-rating or legal fitment; real dimensions vary by tire model and wear.',
    relatedExistingIds: ['unit-converter'],
    logicModule: './tools/tire-size-calculator/logic.mjs',
  },
  {
    id: 'gravel-calculator',
    category: 'home-materials',
    type: 'calculator',
    primaryIntent: 'gravel calculator',
    secondaryIntents: ['gravel volume calculator', 'gravel calculator by area and depth', 'gravel weight calculator', 'gravel bags calculator'],
    functions: ['area by rectangle, circle or triangle', 'volume from area and depth', 'optional waste allowance', 'optional density-to-weight estimate', 'optional bag count rounded up'],
    acceptance: '10 m² × 0.1 m = 1 m³ before waste.',
    boundary: 'Calculates granular aggregate volume/weight; it is not a concrete mix or structural specification.',
    relatedExistingIds: ['concrete-calculator'],
    logicModule: './tools/gravel-calculator/logic.mjs',
  },
  {
    id: 'molar-mass-calculator',
    category: 'science',
    type: 'calculator',
    primaryIntent: 'molecular weight calculator',
    secondaryIntents: ['molar mass calculator', 'molecular mass calculator', 'molar mass of a chemical formula'],
    functions: ['parse element symbols and integer counts', 'nested parentheses', 'hydrate separators and coefficients', 'explicitly supported isotope masses', 'clear errors for unsupported elements or notation'],
    acceptance: 'H2O ≈ 18.015 g/mol.',
    boundary: 'Uses a documented, bounded table of conventional atomic weights and selected isotope masses; it is not a chemical database or lab measurement.',
    relatedExistingIds: ['periodic-table'],
    logicModule: './tools/molar-mass-calculator/logic.mjs',
  },
  {
    id: 'auto-loan-refinance-calculator',
    category: 'finance-math',
    type: 'calculator',
    primaryIntent: 'auto loan refinance calculator',
    secondaryIntents: ['car refinance calculator', 'auto refinance payment calculator', 'car loan refinance savings calculator'],
    functions: ['remaining payoff balance and term', 'current versus new APR and term', 'upfront or financed fees', 'monthly payment and total-cost comparison', 'cumulative monthly break-even estimate'],
    acceptance: 'At 0% APR and the same term, the payment is unchanged; upfront fees lower estimated savings by their amount.',
    boundary: 'Illustrative amortization only; users enter rates/fees. No lender quotes, eligibility decision, tax treatment or financial advice.',
    relatedExistingIds: [],
    logicModule: './tools/auto-loan-refinance-calculator/logic.mjs',
  },
  {
    id: 'secret-santa-generator',
    category: 'groups-and-events',
    type: 'generator',
    primaryIntent: 'secret santa generator',
    secondaryIntents: ['secret santa name draw', 'secret santa generator with exclusions', 'wichteln generator'],
    functions: ['unique participant list', 'no self-assignment', 'pair-specific exclusions', 'detect impossible constraints', 'reveal one result at a time on this device', 'deliberate copy/download only'],
    acceptance: 'Every participant gives to exactly one different participant and receives exactly once; an impossible exclusion set returns a clear error.',
    boundary: 'No email or server is used. Anyone with access to this device or an exported list may see assignments.',
    relatedExistingIds: [],
    logicModule: './tools/secret-santa-generator/logic.mjs',
  },
  {
    id: 'mancala',
    category: 'games',
    type: 'game',
    primaryIntent: 'mancala game',
    secondaryIntents: ['play mancala online', 'Kalah rules', 'mancala vs computer'],
    functions: ['standard six-pit Kalah board', 'seed sowing and opponent-store skip', 'capture and extra-turn rules', 'end-of-game collection and score', 'local single-device play and a lightweight local opponent'],
    acceptance: 'A legal game preserves every seed; capture, extra turn and game-end sweep follow Kalah rules.',
    boundary: 'Implements Kalah, one Mancala-family ruleset; other Mancala variants may use different rules.',
    relatedExistingIds: ['backgammon'],
    logicModule: './tools/mancala/logic.mjs',
  },
]);

export function assertGrowthCatalogIsAdditive(currentTools, additions = growthPilotTools) {
  const current = new Set(currentTools.map(({ id }) => id));
  const seen = new Set();
  for (const tool of additions) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(tool.id)) throw new Error(`Invalid stable tool ID: ${tool.id}`);
    if (current.has(tool.id)) throw new Error(`New tool collides with a protected UsefulVerse ID: ${tool.id}`);
    if (seen.has(tool.id)) throw new Error(`Duplicate new tool ID: ${tool.id}`);
    seen.add(tool.id);
    if (!tool.primaryIntent || !tool.acceptance || !tool.boundary || !tool.logicModule) throw new Error(`Incomplete product contract for ${tool.id}`);
    for (const relatedId of tool.relatedExistingIds) {
      if (!current.has(relatedId)) throw new Error(`${tool.id} links to missing existing tool ${relatedId}`);
    }
  }
  return true;
}
