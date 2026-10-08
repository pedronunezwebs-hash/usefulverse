export const forceCalculatorEnglishCopy = Object.freeze({
  copyLanguage: "en",
  name: "Force Calculator",
  title: "Force Calculator Free | UsefulVerse",
  description:
    "Calculate force, mass, acceleration or net force with a free Newton’s second law calculator. No account; calculations stay in your browser.",
  intro:
    "Use Newton’s second law, F = m × a, to solve force, mass or acceleration. Or add signed forces along one line to see the net force, resulting acceleration and a simple force diagram.",
  howQuestion: "How do you calculate force?",
  howAnswer:
    "Newton’s second law is F = m × a: multiply mass in kilograms by acceleration in metres per second squared to get force in newtons. For example, 2 kg × 3 m/s² = 6 N. For several forces along the same line, add them with their direction signs first.",
  privacyQuestion: "Are my values uploaded?",
  privacyAnswer:
    "No. The calculation runs in this browser; values are not uploaded or saved.",
  fields: {
    mode: "Calculation mode",
    solveForce: "Solve force (F = m × a)",
    solveMass: "Solve mass (m = F ÷ a)",
    solveAcceleration: "Solve acceleration (a = F ÷ m)",
    netMode: "Add collinear forces",
    forceUnit: "Force unit",
    massUnit: "Mass unit",
    accelerationUnit: "Acceleration unit",
    force: "Force",
    mass: "Mass",
    acceleration: "Acceleration",
    forces: "Signed forces, separated by commas",
    forcesHint:
      "Enter 2–5 forces on one line, such as 10, -4. Positive and negative signs indicate opposite directions.",
    netMass: "Object mass",
    accuracyNote:
      "Ideal one-dimensional mechanics only. Forces in the sum must act along the same line; this does not calculate vector components, friction or torque, and it is not an engineering safety check.",
  },
  actions: {
    calculate: "Calculate force",
    reset: "Reset",
    copy: "Copy result",
    example: "Try 2 kg × 3 m/s²",
    result: "Force result",
  },
  messages: {
    calculated: "Calculation ready.",
    checkInputs: "Check the values, units and signed forces.",
    force: "Force",
    netForce: "Net force",
    mass: "Mass",
    acceleration: "Acceleration",
    diagram: "Diagram of forces acting along one line.",
  },
  additionalFaqs: [
    {
      question: "What is Newton’s second law?",
      answer:
        "It states that the net force on an object equals its mass multiplied by its acceleration: F = m × a.",
    },
    {
      question: "What is the unit of force?",
      answer:
        "The SI unit is the newton (N). One newton gives a 1 kg mass an acceleration of 1 m/s².",
    },
    {
      question: "How do I add forces in opposite directions?",
      answer:
        "Choose one direction as positive and enter forces in the other direction as negative. Add the signed values to get net force. This calculator handles collinear forces only.",
    },
  ],
});
