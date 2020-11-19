const COLOR_SCALE = [
  '#c2ffe2',
  '#9febe6',
  '#7bd7eb',
  '#58c4ef',
  '#35b0f3',
  '#1f94e3',
  '#176fc0',
  '#104a9d',
  '#08257a',
  '#000057'
];

const MAX_SCORE = 1;

export default function zoneScoreColor (score) {
  const steps = COLOR_SCALE.length;
  const index = Math.ceil((score / MAX_SCORE) * steps) - 1;
  return COLOR_SCALE[index];
}
