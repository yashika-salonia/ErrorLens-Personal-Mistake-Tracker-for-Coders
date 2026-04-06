/**
 * Returns the start Date for a given named time range.
 * Defaults to "month" (30 days back) for any unknown value.
 * @param {"week"|"month"|"year"} range
 * @returns {Date}
 */
const getStartDate = (range) => {
  const MS = 24 * 60 * 60 * 1000;
  const days = { week: 7, month: 30, year: 365 };
  return new Date(Date.now() - (days[range] ?? days.month) * MS);
};

/**
 * Returns a MongoDB $project expression that calculates accuracy as a
 * rounded percentage from two numeric field references already in scope.
 * Guards against divide-by-zero.
 * @param {string} acceptedField
 * @param {string} totalField
 */
const accuracyExpr = (acceptedField, totalField) => ({
  $cond: [
    { $eq: [`$${totalField}`, 0] },
    0,
    {
      $round: [
        {
          $multiply: [
            { $divide: [`$${acceptedField}`, `$${totalField}`] },
            100,
          ],
        },
        1,
      ],
    },
  ],
});

// Mistake Personality data
const PERSONALITY_MAP = {
  logic: {
    label: "The Overthinker 🧠",
    tip: "Trace through edge cases before submitting.",
  },
  syntax: {
    label: "The Speed Coder ⚡",
    tip: "Use a linter and review code before running.",
  },
  "edge-case": {
    label: "The Optimist 🌤️",
    tip: "Test with minimum, maximum, and null inputs.",
  },
  performance: {
    label: "The Brute-Forcer 🏋️",
    tip: "Analyse time/space complexity before coding.",
  },
  runtime: {
    label: "The Risk Taker 🎲",
    tip: "Guard against null refs and divide-by-zero.",
  },
  "state-management": {
    label: "The Juggler 🤹",
    tip: "Draw state flow diagrams before writing code.",
  },
  "api-integration": {
    label: "The Bridge Builder 🌉",
    tip: "Validate contracts and handle all HTTP errors.",
  },
  "database-query": {
    label: "The Data Whisperer 🗄️",
    tip: "Review query plans and index your lookups.",
  },
  security: {
    label: "The Hacker Magnet 🔓",
    tip: "Sanitise inputs; use parameterised queries.",
  },
  validation: {
    label: "The Rusher 🏃",
    tip: "Validate input at the start of every function.",
  },
  authentication: {
    label: "The Open Door 🚪",
    tip: "Always verify tokens before granting access.",
  },
  authorization: {
    label: "The Boundary Breaker 🛑",
    tip: "Enforce role checks on every protected route.",
  },
  configuration: {
    label: "The Experimenter 🔧",
    tip: "Lock env configs before pushing to production.",
  },
  dependency: {
    label: "The Borrower 📦",
    tip: "Pin dependency versions to avoid breakage.",
  },
};

const DEFAULT_PERSONALITY = {
  label: "The Explorer 🗺️",
  tip: "Keep logging mistakes — your pattern will emerge soon!",
};

/**
 * Returns the personality object for a given top mistake type.
 * @param {string} topMistakeType
 * @returns {{ label: string, tip: string }}
 */
const resolvePersonality = (topMistakeType) =>
  PERSONALITY_MAP[topMistakeType] ?? DEFAULT_PERSONALITY;

module.exports = { getStartDate, accuracyExpr, resolvePersonality };
