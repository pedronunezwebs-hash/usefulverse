const FORCE_TO_N = Object.freeze({ N: 1, kN: 1000, lbf: 4.4482216152605 });
const MASS_TO_KG = Object.freeze({ kg: 1, lb: 0.45359237 });
const ACCEL_TO_MPS2 = Object.freeze({ "m/s²": 1, "ft/s²": 0.3048 });
const LIMIT = 1e12;

function finite(name, raw, { min = -LIMIT, max = LIMIT } = {}) {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max)
    throw new RangeError(`${name} is outside the supported range.`);
  return value;
}

function checked(value) {
  if (!Number.isFinite(value) || Math.abs(value) > 1e18)
    throw new RangeError("The result is outside the supported range.");
  return value;
}

export function calculateForce({
  mode = "solve-force",
  forceUnit = "N",
  massUnit = "kg",
  accelerationUnit = "m/s²",
  force = 0,
  mass = 0,
  acceleration = 0,
  forces = "",
  netMass = 0,
} = {}) {
  if (
    !Object.hasOwn(FORCE_TO_N, forceUnit) ||
    !Object.hasOwn(MASS_TO_KG, massUnit) ||
    !Object.hasOwn(ACCEL_TO_MPS2, accelerationUnit)
  )
    throw new TypeError("Choose supported units.");
  const forceScale = FORCE_TO_N[forceUnit];
  const massScale = MASS_TO_KG[massUnit];
  const accelerationScale = ACCEL_TO_MPS2[accelerationUnit];
  if (mode === "net-forces") {
    const parts = String(forces)
      .split(/[\s,;]+/u)
      .filter(Boolean);
    if (parts.length < 2 || parts.length > 5)
      throw new RangeError("Enter between two and five collinear forces.");
    const forceValues = parts.map((part) => finite("Force", part) * forceScale);
    const massKg =
      finite("Mass", netMass, { min: Number.MIN_VALUE }) * massScale;
    const netForceN = checked(
      forceValues.reduce((sum, value) => sum + value, 0),
    );
    const accelerationMps2 = checked(netForceN / massKg);
    return Object.freeze({
      mode,
      forceUnit,
      massUnit,
      accelerationUnit,
      forceValues: Object.freeze(
        forceValues.map((value) => value / forceScale),
      ),
      netForce: netForceN / forceScale,
      netForceN,
      mass: massKg / massScale,
      acceleration: accelerationMps2 / accelerationScale,
      accelerationMps2,
    });
  }
  if (!["solve-force", "solve-mass", "solve-acceleration"].includes(mode))
    throw new TypeError("Choose a supported calculation.");
  const forceN =
    mode === "solve-force" ? 0 : finite("Force", force) * forceScale;
  const massKgInput =
    mode === "solve-mass"
      ? 0
      : finite("Mass", mass, { min: Number.MIN_VALUE }) * massScale;
  const accelerationMps2Input =
    mode === "solve-acceleration"
      ? 0
      : finite("Acceleration", acceleration) * accelerationScale;
  let result;
  if (mode === "solve-force")
    result = {
      forceN: checked(massKgInput * accelerationMps2Input),
      massKg: massKgInput,
      accelerationMps2: accelerationMps2Input,
    };
  if (mode === "solve-mass") {
    if (accelerationMps2Input === 0)
      throw new RangeError("Acceleration must be non-zero to solve mass.");
    result = {
      forceN,
      massKg: checked(forceN / accelerationMps2Input),
      accelerationMps2: accelerationMps2Input,
    };
    if (result.massKg <= 0)
      throw new RangeError(
        "Force and acceleration must produce a positive mass.",
      );
  }
  if (mode === "solve-acceleration")
    result = {
      forceN,
      massKg: massKgInput,
      accelerationMps2: checked(forceN / massKgInput),
    };
  for (const value of Object.values(result)) checked(value);
  return Object.freeze({
    mode,
    forceUnit,
    massUnit,
    accelerationUnit,
    force: result.forceN / forceScale,
    forceN: result.forceN,
    mass: result.massKg / massScale,
    massKg: result.massKg,
    acceleration: result.accelerationMps2 / accelerationScale,
    accelerationMps2: result.accelerationMps2,
  });
}
