const defaults = {
  selector: '.navigation',
  debouce: 100,
  minY: 70
};

let state = {
  navbarElement: undefined,
  previousY: undefined,
  isScrolling: false
};

export function init(config = {}) {
  const { selector, debouce, minY } = Object.assign({}, defaults, config);

  state.minY = minY;
  state.navbarElement = document.querySelector(selector);
  state.previousY = window.pageYOffset;

  window.addEventListener('scroll', () => {
    update();
    state.isScrolling = true;
  });

  setInterval(() => {
    if (state.isScrolling) {
      state.isScrolling = false;
    }
  }, debouce);
}

function update() {
  const currentY = window.pageYOffset;

  if (state.previousY > currentY) {
    state.navbarElement.classList.remove('hidden');
  } else if (currentY > state.minY) {
    state.navbarElement.classList.add('hidden');
  }

  state.previousY = currentY;
}
