export const cyclingPowerCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en',
  name: 'Cycling power calculator',
  title: 'Cycling Power Calculator Free | UsefulVerse',
  description: 'Estimate cycling watts from speed, rider and bike mass, gradient, wind and aerodynamic settings. Free local calculator.',
  intro: 'Estimate the steady power needed to ride at a chosen speed. Adjust total rider-and-bike mass, road gradient, headwind, rolling resistance, drag area, air density and drivetrain efficiency.',
  howQuestion: 'How is cycling power estimated?',
  howAnswer: 'The model adds aerodynamic drag, rolling resistance and climbing force at your ground speed, then adjusts for drivetrain efficiency. On level ground, a 30 km/h ride with an 85 kg system, 0.32 m² drag area and default conditions takes about 146 W at the rider. Real power varies with posture, tires, surface, gusts, drafting, acceleration and measurement location.',
  privacyQuestion: 'Are my cycling details uploaded?',
  privacyAnswer: 'No. The estimate runs in your browser. Your ride inputs are not uploaded or saved by this tool.',
  fields: {
    mass: 'Rider and bicycle mass', speed: 'Ground speed', gradientPercent: 'Road gradient (%)', headwind: 'Headwind (+) / tailwind (−)',
    rollingResistance: 'Rolling resistance coefficient (Crr)', dragArea: 'Drag area (CdA, m²)', airDensity: 'Air density (kg/m³)',
    drivetrainEfficiency: 'Drivetrain efficiency (%)', unitSystem: 'Units', metric: 'Metric (kg, km/h)', imperial: 'Imperial (lb, mph)',
    accuracyNote: 'Steady-speed estimate, not a power-meter reading or training prescription. It assumes a straight road and constant conditions. Aero posture, tires, road surface, drafting, acceleration, elevation changes and weather can change real power. Negative downhill demand is shown as zero because this model does not estimate braking or regenerative power.',
  },
  actions: { calculate: 'Estimate power', example: 'Load example', reset: 'Reset', copy: 'Copy estimate', result: 'Estimated cycling power', metricUnits: 'Metric', imperialUnits: 'Imperial' },
  messages: {
    calculated: 'Power estimate ready.', checkInputs: 'Check speed, mass, gradient and resistance settings.',
    riderPower: 'Estimated rider power', wattsPerKg: 'Power per kilogram', aerodynamicPower: 'Aerodynamic component', rollingPower: 'Rolling component', climbingPower: 'Climbing component', wheelPower: 'Power at the wheel',
    copied: 'Estimate copied.', copyUnavailable: 'Copy is not available in this browser.',
  },
  additionalFaqs: [
    { question: 'What changes cycling power the most?', answer: 'At higher speeds, aerodynamic drag often becomes a major part of the estimate. Gradient and total mass strongly affect climbing demand; wind, rider position, tires and surface also matter.' },
    { question: 'Does this predict my power-meter reading?', answer: 'No. It is a simplified physics estimate. A calibrated power meter measures power at its own location, while this calculator cannot model every rider, bike, road or weather condition.' },
  ],
});
