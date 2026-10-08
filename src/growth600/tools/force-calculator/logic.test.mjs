import test from "node:test";
import assert from "node:assert/strict";
import { calculateForce } from "./logic.mjs";

test("Newton second law acceptance example returns 6 N", () => {
  const result = calculateForce({
    mode: "solve-force",
    mass: 2,
    acceleration: 3,
  });
  assert.equal(result.force, 6);
  assert.equal(result.forceN, 6);
});

test("solves mass and signed acceleration from force and other values", () => {
  assert.equal(
    calculateForce({ mode: "solve-mass", force: 12, acceleration: 3 }).mass,
    4,
  );
  assert.equal(
    calculateForce({ mode: "solve-acceleration", force: -8, mass: 2 })
      .acceleration,
    -4,
  );
});

test("adds collinear forces and derives acceleration", () => {
  const result = calculateForce({
    mode: "net-forces",
    forces: "10, -4",
    netMass: 2,
  });
  assert.equal(result.netForce, 6);
  assert.equal(result.acceleration, 3);
  assert.deepEqual(result.forceValues, [10, -4]);
});

test("converts lbf, pounds and ft/s² through SI units", () => {
  const force = calculateForce({
    mode: "solve-force",
    massUnit: "lb",
    accelerationUnit: "ft/s²",
    forceUnit: "lbf",
    mass: 32.1740486,
    acceleration: 1,
  });
  assert.ok(Math.abs(force.force - 1) < 0.00001);
  const net = calculateForce({
    mode: "net-forces",
    forceUnit: "kN",
    massUnit: "kg",
    accelerationUnit: "ft/s²",
    forces: "1, -0.5",
    netMass: 1,
  });
  assert.equal(net.netForce, 0.5);
  assert.ok(Math.abs(net.acceleration - 500 / 0.3048) < 1e-9);
});

test("rejects invalid units, singular inputs, bad force lists and out-of-range values", () => {
  assert.throws(
    () => calculateForce({ forceUnit: "stone" }),
    /supported units/,
  );
  assert.throws(
    () => calculateForce({ mode: "solve-mass", force: 3, acceleration: 0 }),
    /non-zero/,
  );
  assert.throws(
    () => calculateForce({ mode: "solve-mass", force: -3, acceleration: 2 }),
    /positive mass/,
  );
  assert.throws(
    () => calculateForce({ mode: "net-forces", forces: "5", netMass: 1 }),
    /two and five/,
  );
  assert.throws(
    () =>
      calculateForce({ mode: "net-forces", forces: "1,2,3,4,5,6", netMass: 1 }),
    /two and five/,
  );
  assert.throws(
    () => calculateForce({ mode: "net-forces", forces: "5, nope", netMass: 1 }),
    /supported range/,
  );
  assert.throws(
    () => calculateForce({ mode: "unknown" }),
    /supported calculation/,
  );
});
