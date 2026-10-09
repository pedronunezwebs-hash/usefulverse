import { balanceChemicalEquation } from '../chemical-equation-balancer/logic.mjs';
import { calculateMolarMass } from '../molar-mass-calculator/logic.mjs';

const MAX_AMOUNT = 1e12;

function positiveAmount(value, name) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    throw new RangeError(`${name} must be greater than zero and within the supported range.`);
  }
  return amount;
}

export function calculateStoichiometry({ equation, inputMode = 'mass', reactantAmounts, selectedProduct, actualProductMass } = {}) {
  if (!['mass', 'moles'].includes(inputMode)) throw new TypeError('Choose grams or moles as the reactant input.');
  const balanced = balanceChemicalEquation(equation);
  if (!Array.isArray(reactantAmounts) || reactantAmounts.length !== balanced.reactants.length) {
    throw new RangeError(`Enter one amount for each of the ${balanced.reactants.length} reactants, in equation order.`);
  }

  const reactants = balanced.reactants.map(({ formula, coefficient }, index) => {
    const enteredAmount = positiveAmount(reactantAmounts[index], `Reactant ${formula}`);
    const molarMass = calculateMolarMass(formula).molarMass;
    const moles = inputMode === 'mass' ? enteredAmount / molarMass : enteredAmount;
    const reactionExtent = moles / coefficient;
    if (!Number.isFinite(reactionExtent) || reactionExtent <= 0) throw new RangeError('A reactant amount is outside the supported range.');
    return Object.freeze({ formula, coefficient, enteredAmount, molarMass, moles, reactionExtent });
  });

  const smallestExtent = Math.min(...reactants.map((reactant) => reactant.reactionExtent));
  const extentTolerance = Math.max(Math.abs(smallestExtent), Number.MIN_VALUE) * 1e-10;
  const limitingReactants = reactants.filter(({ reactionExtent }) => Math.abs(reactionExtent - smallestExtent) <= extentTolerance).map(({ formula }) => formula);
  const products = balanced.products.map(({ formula, coefficient }) => {
    const molarMass = calculateMolarMass(formula).molarMass;
    const moles = coefficient * smallestExtent;
    const mass = moles * molarMass;
    if (!Number.isFinite(moles) || !Number.isFinite(mass) || mass > MAX_AMOUNT) throw new RangeError('A theoretical product amount is outside the supported range.');
    return Object.freeze({ formula, coefficient, molarMass, moles, mass });
  });

  const product = products.find(({ formula }) => formula === (selectedProduct || products[0].formula));
  if (!product) throw new TypeError('Choose one product shown in the balanced reaction.');
  const actualMass = actualProductMass === undefined || actualProductMass === '' ? undefined : Number(actualProductMass);
  if (actualMass !== undefined && (!Number.isFinite(actualMass) || actualMass < 0 || actualMass > MAX_AMOUNT)) {
    throw new RangeError('Actual product mass must be zero or greater and within the supported range.');
  }
  const percentYield = actualMass === undefined ? undefined : (actualMass / product.mass) * 100;
  if (percentYield !== undefined && (!Number.isFinite(percentYield) || percentYield > 1e9)) throw new RangeError('The calculated percent yield is outside the supported range.');

  return Object.freeze({
    inputMode,
    balancedEquation: balanced.balancedEquation,
    reactants: Object.freeze(reactants),
    products: Object.freeze(products),
    limitingReactants: Object.freeze(limitingReactants),
    reactionExtent: smallestExtent,
    selectedProduct: product.formula,
    theoreticalProductMoles: product.moles,
    theoreticalProductMass: product.mass,
    actualProductMass: actualMass,
    percentYield,
  });
}
