export function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((value, index) => {
      return deepEqual(value, b[index]);
    });
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = Object.keys(a);

    if (keys.length !== Object.keys(b).length) {
      return false;
    }

    return keys.every((key) => {
      return deepEqual(a[key], b[key]);
    });
  }

  return false;
}
