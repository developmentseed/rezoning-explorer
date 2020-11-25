export const resizeMap = (map, timeout) => {
  if (map) {
    setTimeout(() => {
      map.resize();
    }, timeout || 200);
  }
};
