const COLOR_SCALE = [
  '#301760',
  '#362E76',
  '#39448E',
  '#3A71BD',
  '#FACCFA',
  '#FEA2FF',
  '#B44EB5',
  '#89278E',
  '#89278E',
  '#5F0365'
];

const MAX_SCORE = 1;

export default function zoneScoreColor (score) {
  const steps = COLOR_SCALE.length;
  const index = Math.floor((score / MAX_SCORE) * steps);
  return COLOR_SCALE[index];
}
