// Plane environment evaluations for the Bullet Time charts, from the project's evaluation logs.
// Evaluations with more than 20% falls are left out, since falls lower every reward.
const PLANE_EVALS = {
  direct: [
    {"level": 3, "segment": 1, "steps": 16.7, "cost": 55.7, "falls": 0.8, "height": 4807, "upright": 2231},
    {"level": 3, "segment": 1, "steps": 22.3, "cost": 34.8, "falls": 1.6, "height": 4755, "upright": 2109},
    {"level": 3, "segment": 1, "steps": 27.9, "cost": 25.5, "falls": 0.0, "height": 4813, "upright": 2063},
    {"level": 3, "segment": 1, "steps": 33.4, "cost": 23.2, "falls": 1.6, "height": 4761, "upright": 1858},
    {"level": 3, "segment": 1, "steps": 39.0, "cost": 20.1, "falls": 0.8, "height": 4751, "upright": 1826},
    {"level": 3, "segment": 1, "steps": 44.6, "cost": 18.7, "falls": 3.9, "height": 4621, "upright": 1653},
    {"level": 3, "segment": 1, "steps": 50.1, "cost": 16.1, "falls": 3.1, "height": 4629, "upright": 1539},
    {"level": 3, "segment": 1, "steps": 55.7, "cost": 16.9, "falls": 0.8, "height": 4566, "upright": 1388},
    {"level": 3, "segment": 1, "steps": 61.3, "cost": 15.1, "falls": 9.4, "height": 4276, "upright": 1326},
    {"level": 3, "segment": 1, "steps": 66.8, "cost": 13.4, "falls": 8.6, "height": 4286, "upright": 1308},
    {"level": 3, "segment": 1, "steps": 72.4, "cost": 11.8, "falls": 3.1, "height": 4259, "upright": 1290},
    {"level": 3, "segment": 1, "steps": 78.0, "cost": 10.2, "falls": 0.0, "height": 4244, "upright": 1270},
    {"level": 3, "segment": 1, "steps": 83.6, "cost": 9.5, "falls": 1.6, "height": 4111, "upright": 1281},
    {"level": 3, "segment": 1, "steps": 89.1, "cost": 8.2, "falls": 1.6, "height": 4077, "upright": 1278},
    {"level": 3, "segment": 1, "steps": 94.7, "cost": 8.7, "falls": 3.1, "height": 4005, "upright": 1315},
    {"level": 3, "segment": 1, "steps": 100.3, "cost": 6.3, "falls": 1.6, "height": 4008, "upright": 1353},
    {"level": 3, "segment": 1, "steps": 105.8, "cost": 4.8, "falls": 6.2, "height": 3704, "upright": 1247},
  ],
  curriculum: [
    {"level": 2, "segment": 2, "steps": 20.0, "cost": 112.3, "falls": 0.0, "height": 4998, "upright": 3000},
    {"level": 2, "segment": 2, "steps": 25.6, "cost": 114.7, "falls": 0.0, "height": 4998, "upright": 3000},
    {"level": 2, "segment": 2, "steps": 31.1, "cost": 108.2, "falls": 0.0, "height": 4998, "upright": 3000},
    {"level": 2, "segment": 2, "steps": 36.7, "cost": 100.6, "falls": 0.0, "height": 4997, "upright": 3000},
    {"level": 2, "segment": 2, "steps": 42.3, "cost": 106.9, "falls": 0.0, "height": 4997, "upright": 3000},
    {"level": 2, "segment": 2, "steps": 47.9, "cost": 100.8, "falls": 0.8, "height": 4988, "upright": 2997},
    {"level": 2, "segment": 2, "steps": 53.4, "cost": 114.7, "falls": 0.0, "height": 4994, "upright": 2999},
    {"level": 2, "segment": 2, "steps": 59.0, "cost": 106.5, "falls": 0.0, "height": 4994, "upright": 2999},
    {"level": 3, "segment": 3, "steps": 88.0, "cost": 44.8, "falls": 18.8, "height": 4664, "upright": 2792},
    {"level": 3, "segment": 3, "steps": 91.6, "cost": 42.2, "falls": 16.4, "height": 4686, "upright": 2808},
    {"level": 3, "segment": 3, "steps": 95.2, "cost": 39.5, "falls": 12.5, "height": 4739, "upright": 2842},
    {"level": 3, "segment": 3, "steps": 98.8, "cost": 38.0, "falls": 3.1, "height": 4919, "upright": 2950},
    {"level": 3, "segment": 3, "steps": 102.4, "cost": 39.1, "falls": 5.5, "height": 4899, "upright": 2938},
  ],
};

const planeSeries = [
  { name: "Direct", color: "--series-direct", points: PLANE_EVALS.direct },
  { name: "Curriculum", color: "--series-curriculum", points: PLANE_EVALS.curriculum },
];

const planeColumns = [
  { label: "Agent", value: (p, series) => series.name },
  { label: "Level", value: (p) => p.level },
  { label: "Steps (M)", value: (p) => p.steps },
  { label: "Plane cost", value: (p) => p.cost },
  { label: "Falls %", value: (p) => p.falls },
  { label: "Height reward", value: (p) => p.height },
  { label: "Upright reward", value: (p) => p.upright },
];

window.PORTFOLIO_CHARTS = {
  "plane-tradeoff": {
    label: "Height reward against plane cost. The direct agent moves from high cost down to low cost at a lower height, while the curriculum agent stays tall with high cost.",
    title: "Standing tall earns reward, but gets it hit",
    series: planeSeries,
    columns: planeColumns,
    x: { field: "cost", label: "Cost: plane hits (log scale)", low: "fewer hits", high: "more hits", min: 3, max: 150, log: true, ticks: [5, 10, 20, 50, 100] },
    y: { field: "height", label: "Height reward", low: "low", high: "tall", min: 2800, max: 5600, ticks: [3000, 3500, 4000, 4500, 5000, 5500] },
    target: { xMax: 5 },
    lines: [
      { axis: "x", value: 5, label: "Cost budget", labelAt: 3450 },
      { axis: "y", value: 4500, label: "Torso at 1.0 m" },
    ],
    corners: [["Goal: tall,", "avoids planes"], ["Tall,", "gets hit"], ["Low,", "avoids planes"], ["Low,", "gets hit"]],
    starts: { Direct: { dx: 4, dy: 18, anchor: "start" }, Curriculum: { dx: 0, dy: 18, anchor: "middle" } },
    labels: { Direct: { dx: 12, dy: 4, anchor: "start" }, Curriculum: { dx: 0, dy: -14, anchor: "middle" } },
    tipTitle: (p, series) => `${series.name}, level ${p.level}`,
    clockLabel: (clock) => `${clock}M training steps`,
  },
  "plane-posture": {
    label: "Height reward against upright reward. The direct agent tilts its torso first and then crouches, while the curriculum agent stays straight.",
    title: "How does it get low?",
    series: planeSeries,
    columns: planeColumns,
    x: { field: "upright", label: "Upright reward", low: "torso tilted", high: "torso straight", min: 900, max: 3300, ticks: [1000, 1500, 2000, 2500, 3000] },
    y: { field: "height", label: "Height reward", low: "low", high: "tall", min: 2800, max: 5600, ticks: [3000, 3500, 4000, 4500, 5000, 5500] },
    lines: [
      { axis: "x", value: 2600, label: "30° tilt", labelAt: 3450 },
      { axis: "y", value: 4500, label: "Torso at 1.0 m" },
    ],
    corners: [["Tall, tilted", "(bends or leans)"], ["Tall, straight", "(just stands)"], ["Low, tilted", "(crouches, bends)"], ["Low, straight", "(squats)"]],
    starts: { Direct: { dx: 0, dy: 18, anchor: "middle" }, Curriculum: { dx: 10, dy: -6, anchor: "start" } },
    labels: { Direct: { dx: 12, dy: 4, anchor: "start" }, Curriculum: { dx: -6, dy: -14, anchor: "end" } },
    tipTitle: (p, series) => `${series.name}, level ${p.level}`,
    clockLabel: (clock) => `${clock}M training steps`,
  },
};
