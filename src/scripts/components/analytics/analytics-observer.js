const options = {
  rootMargin: '0px', // browser default
  threshold: 0 // browser default
};

export const init = (observables, callback) => {
  const observer = new IntersectionObserver(observables => {
    Array.from(observables).forEach(obs => {
      if (obs.intersectionRatio > 0) {
        callback('observer-' + obs.target.getAttribute('data-observer'));
        observer.unobserve(obs.target);
      }
    });
  }, options);

  Array.from(observables).forEach(obs => {
    observer.observe(obs);
  });
};
