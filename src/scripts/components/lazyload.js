const defaults = {
  rootMargin: '100px 0px 100px 0px',
  threshold: 0,
  loaded() {},
  load
};

export function init(selector = '.lazyload', config = {}) {
  const { root, rootMargin, threshold, load, loaded } = Object.assign({}, defaults, config);
  let observer;

  if (window.IntersectionObserver) {
    observer = new IntersectionObserver(onIntersection(load, loaded), {
      root,
      rootMargin,
      threshold
    });
  }

  return {
    observe() {
      const elements = getElements(selector, root);

      Array.from(elements).forEach(function(element) {
        if (!isLoaded(element)) {
          if (observer) {
            observer.observe(element);
          } else {
            load(element);
            markAsLoaded(element);
            loaded(element);
          }
        }
      });
    },
    triggerLoad(element) {
      if (isLoaded(element)) {
        return;
      }

      load(element);
      markAsLoaded(element);
      loaded(element);
    },
    observer
  };
}

function load(element) {
  if (element.getAttribute('data-src')) {
    element.src = element.getAttribute('data-src');
  }
  if (element.getAttribute('data-srcset')) {
    element.setAttribute('srcset', element.getAttribute('data-srcset'));
  }
  if (element.getAttribute('data-background-image')) {
    element.style.backgroundImage = `url("${element.getAttribute('data-background-image')}")`;
  }
}

function markAsLoaded(element) {
  element.setAttribute('data-loaded', true);
}

const isLoaded = element => element.getAttribute('data-loaded') === 'true';

const onIntersection = (load, loaded) => (entries, observer) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0 || entry.isIntersecting) {
      observer.unobserve(entry.target);

      if (!isLoaded(entry.target)) {
        load(entry.target);
        markAsLoaded(entry.target);
        loaded(entry.target);
      }
    }
  });
};

const getElements = (selector, root = document) => {
  if (selector instanceof Element) {
    return [selector];
  }
  if (selector instanceof NodeList) {
    return selector;
  }
  return root.querySelectorAll(selector);
};
