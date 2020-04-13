// Does nothing
export const noop = () => {};

// Makes a function only executable once
export const once = func => {
  let executed = false;

  return function() {
    if (!executed) {
      executed = true;
      return func.apply(this, arguments);
    }
  };
};

export const toDashCase = input => {
  return input.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};
