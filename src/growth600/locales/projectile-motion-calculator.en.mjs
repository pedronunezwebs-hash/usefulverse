export const projectileMotionCalculatorEnglishCopy = Object.freeze({
  copyLanguage: 'en', name: 'Projectile Motion Calculator', title: 'Projectile Motion Calculator Free & Unlimited | UsefulVerse',
  description: 'Calculate projectile flight time, range and peak height, then replay its ideal path. Free, local and unlimited.',
  intro: 'Explore an ideal projectile path without air resistance. Change launch speed, angle, starting height and gravity to see how the motion changes.',
  howQuestion: 'How do you calculate projectile motion?',
  howAnswer: 'Resolve launch speed into horizontal and vertical components. Gravity changes only vertical speed in this model. The calculator solves when the projectile returns to the selected zero-height level, then reports flight time, horizontal range, peak height and impact speed.',
  privacyQuestion: 'Are my launch values uploaded?', privacyAnswer: 'No. The calculation and trajectory animation run in this browser; values are not uploaded or saved.',
  fields: {
    speed: 'Launch speed', speedUnit: 'Speed unit', metersPerSecond: 'Meters per second (m/s)', kilometersPerHour: 'Kilometers per hour (km/h)', milesPerHour: 'Miles per hour (mph)',
    angleDegrees: 'Launch angle from horizontal (degrees)', initialHeight: 'Initial height above landing level', lengthUnit: 'Height and distance unit', meters: 'Meters (m)', feet: 'Feet (ft)',
    gravity: 'Gravitational acceleration (m/s²)', accuracyNote: 'Ideal point-mass model: no air resistance, wind, lift, spin, changing gravity or obstacles. The projectile is assumed to land at height 0; input height is measured above that level. A vertical launch has zero horizontal range. This is an educational estimate, not engineering or safety advice. Runs locally; no upload.',
    plotTitle: 'Ideal trajectory', plotDescription: 'A static plot of the calculated projectile path, with height above the selected landing level on the vertical axis and horizontal distance on the horizontal axis.', motionReduced: 'Reduced motion is enabled. The plot is shown without animation.',
  },
  actions: { calculate: 'Calculate trajectory', reset: 'Reset', copy: 'Copy results', example: 'Load example', result: 'Trajectory results', playTrajectory: 'Replay trajectory', resetAnimation: 'Return to launch' },
  messages: {
    copied: 'Results copied.', copyUnavailable: 'Copy is not available in this browser.', calculated: 'Trajectory calculated.', checkInputs: 'Check the speed, angle, height, gravity and selected units.',
    time: 'Flight time', range: 'Horizontal range', maximumHeight: 'Maximum height', apexTime: 'Time to peak', impactSpeed: 'Impact speed', model: 'Model', horizontalVelocity: 'Horizontal launch speed', verticalVelocity: 'Vertical launch speed',
  },
  additionalFaqs: [
    { question: 'What is the projectile motion formula?', answer: 'With no air resistance and constant gravity, x(t)=v₀ cos(θ)t and y(t)=h₀+v₀ sin(θ)t−gt²/2. This page solves the positive time when y returns to zero.' },
    { question: 'How do launch angle and initial height affect range?', answer: 'The angle changes horizontal and vertical launch speed. A higher starting point keeps the projectile in flight longer, so the same speed and angle can travel farther before reaching the landing level.' },
    { question: 'Does a 90-degree vertical launch have a range?', answer: 'In this ideal model, a vertical launch has no horizontal velocity, so its horizontal range is zero. It still has a flight time and a maximum height.' },
    { question: 'Does this calculator include air resistance?', answer: 'No. It is the introductory constant-gravity point-mass model. Real trajectories can differ because of drag, wind, lift, spin, shape and changing conditions.' },
  ],
});
