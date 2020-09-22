export const resizeMap = map => {
  if (map) {
    setTimeout(() => {
      map.resize();
    }, 200);
  }
};
