export default function updateArrayIndex (list, i, updatedValue) {
  const updated = list.slice();
  updated[i] = updatedValue;
  return updated;
}
