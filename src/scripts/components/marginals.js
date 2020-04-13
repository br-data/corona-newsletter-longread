const defaults = {
  selector: '.marginal',
  breakpoint: 940
};

let state = {
  marginalElements: [],
  breakpoint: undefined,
  hasChanged: false,
  isInline: false
};

export function init(config = {}) {
  const { selector, breakpoint } = Object.assign({}, defaults, config);

  state.breakpoint = breakpoint;
  state.marginalElements = document.querySelectorAll(selector);
  state.hasChanged = document.body.clientWidth <= breakpoint;

  if (state.marginalElements) {
    update(state.marginalElements);
  }
}

export function update() {
  let marginalElement;
  let i;

  // Check if the marginals need to be updateed
  if ((state.isInline && state.breakpoint < document.body.clientWidth) || (!state.isInline && state.breakpoint >= document.body.clientWidth)) {
    state.hasChanged = true;
  }

  if (state.hasChanged) {
    if (state.isInline) {
      for (i = 0; i < state.marginalElements.length; i++) {
        marginalElement = state.marginalElements[i];
        marginalElement.parentNode.insertBefore(marginalElement, marginalElement.previousElementSibling);
        state.isInline = false;
      }
    } else {
      for (i = 0; i < state.marginalElements.length; i++) {
        marginalElement = state.marginalElements[i];
        marginalElement.parentNode.insertBefore(marginalElement.nextElementSibling, marginalElement);
        state.isInline = true;
      }
    }

    state.hasChanged = false;
  }
}
