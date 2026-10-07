const RSI_PER_R = 0.1761101838;

function bounded(name, value, minimum, maximum, integer = false) {
  if (!Number.isFinite(value) || value < minimum || value > maximum || (integer && !Number.isInteger(value))) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateInsulation({ layers, unit = 'R' } = {}) {
  if (!Array.isArray(layers) || layers.length < 1 || layers.length > 8) throw new RangeError('Enter from one to eight layers.');
  if (!['R', 'RSI'].includes(unit)) throw new TypeError('Choose R or RSI units.');
  const cleanLayers = layers.map((layer, index) => {
    const raw = layer?.resistance;
    if (raw === null || raw === undefined || raw === '') return null;
    const resistance = bounded(`Layer ${index + 1} resistance`, raw, 0, 1000);
    const quantity = bounded(`Layer ${index + 1} quantity`, layer.quantity ?? 1, 1, 100, true);
    const name = typeof layer.name === 'string' ? layer.name.trim().slice(0, 50) : '';
    return Object.freeze({ name: name || `Layer ${index + 1}`, resistance, quantity, contribution: resistance * quantity });
  }).filter(Boolean);
  if (!cleanLayers.length || !cleanLayers.some(({ contribution }) => contribution > 0)) throw new RangeError('Enter at least one layer with a resistance above zero.');
  const total = cleanLayers.reduce((sum, layer) => sum + layer.contribution, 0);
  const rValue = unit === 'R' ? total : total / RSI_PER_R;
  const rsi = rValue * RSI_PER_R;
  return Object.freeze({
    unit, totalInEnteredUnit: total, rValue, rsi,
    uFactorUs: rValue > 0 ? 1 / rValue : null,
    uFactorSi: rsi > 0 ? 1 / rsi : null,
    layerCount: cleanLayers.length,
    layers: Object.freeze(cleanLayers),
  });
}
