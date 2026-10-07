const TO_METERS = Object.freeze({ m: 1, ft: 0.3048 });

function bounded(name, value, minimum, maximum) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError(`${name} must be from ${minimum} to ${maximum}.`);
  return value;
}

function whole(value) {
  return Math.ceil(value - Math.max(1, Math.abs(value)) * 1e-12);
}

function layout({ roomLengthM, roomWidthM, rollWidthM, rooms, wastePercent, pileDirection }) {
  const options = [
    { direction: 'length', acrossM: roomWidthM, cutLengthM: roomLengthM },
    { direction: 'width', acrossM: roomLengthM, cutLengthM: roomWidthM },
  ].map((option) => {
    const cutsPerRoom = whole(option.acrossM / rollWidthM);
    const continuousLengthM = cutsPerRoom * option.cutLengthM;
    const orderedLengthM = continuousLengthM * rooms * (1 + wastePercent / 100);
    return Object.freeze({
      pileDirection: option.direction,
      cutsPerRoom,
      seamsPerRoom: Math.max(0, cutsPerRoom - 1),
      cutLengthM: option.cutLengthM,
      carpetLengthM: continuousLengthM * rooms,
      orderedLengthM,
      purchasedAreaM2: orderedLengthM * rollWidthM,
    });
  });
  const chosen = pileDirection === 'either'
    ? [...options].sort((a, b) => a.purchasedAreaM2 - b.purchasedAreaM2 || a.orderedLengthM - b.orderedLengthM)[0]
    : options.find((option) => option.pileDirection === pileDirection);
  return { options, chosen };
}

export function calculateCarpet({ roomLength, roomWidth, rollWidth, rooms = 1, wastePercent = 10, unit = 'm', pileDirection = 'either' } = {}) {
  const factor = TO_METERS[unit];
  if (!factor || !['either', 'length', 'width'].includes(pileDirection)) throw new RangeError('Choose supported units and pile direction.');
  const lengthM = bounded('Room length', roomLength, 0.01, 100_000) * factor;
  const widthM = bounded('Room width', roomWidth, 0.01, 100_000) * factor;
  const rollWidthM = bounded('Roll width', rollWidth, 0.1, 20) * factor;
  bounded('Room count', rooms, 1, 100);
  if (!Number.isInteger(rooms)) throw new RangeError('Room count must be a whole number.');
  const extra = bounded('Cutting allowance', wastePercent, 0, 50);
  const plan = layout({ roomLengthM: lengthM, roomWidthM: widthM, rollWidthM, rooms, wastePercent: extra, pileDirection });
  const convertArea = (areaM2) => unit === 'ft' ? areaM2 / 0.09290304 : areaM2;
  return Object.freeze({
    unit, rooms, roomArea: unit === 'ft' ? lengthM * widthM / 0.09290304 : lengthM * widthM,
    rollWidth: rollWidthM / factor, wastePercent: extra,
    options: Object.freeze(plan.options.map((option) => Object.freeze({
      ...option,
      cutLength: option.cutLengthM / factor,
      carpetLength: option.carpetLengthM / factor,
      orderedLength: option.orderedLengthM / factor,
      purchasedArea: convertArea(option.purchasedAreaM2),
    }))),
    chosen: Object.freeze({
      ...plan.chosen,
      cutLength: plan.chosen.cutLengthM / factor,
      carpetLength: plan.chosen.carpetLengthM / factor,
      orderedLength: plan.chosen.orderedLengthM / factor,
      purchasedArea: convertArea(plan.chosen.purchasedAreaM2),
    }),
  });
}
