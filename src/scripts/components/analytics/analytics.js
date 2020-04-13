import * as utils from './analytics-utils';
import * as observer from './analytics-observer';
import * as client from './analytics-client';
import timer from './analytics-timer';

let config = {
  serviceUrl: 'http://localhost:3010/track',
  projectId: 'demo',
  tracker: {
    client: true,
    click: true,
    observer: true,
    timer: true,
    custom: true
  },
  respectDoNotTrack: false,
  debug: false
};
let user = {};
let request;

// Global export for browser
export const init = _config => {
  config = Object.assign(config, _config || {});

  if (client.doNotTrackEnabled() && config.respectDoNotTrack) {
    send('client-dnt-enabled');
  } else {
    const browser = client.getBrowser();
    user.device = client.getDevice();
    user.session = client.getUuid();
    user.browserName = browser.name;
    user.browserOs = browser.os;

    registerTrackers();
  }
};

const registerTrackers = () => {
  if (config.tracker.client) {
    send('client-device-' + utils.toDashCase(user.device));
    send('client-browser-' + utils.toDashCase(user.browserName));
    send('client-os-' + utils.toDashCase(user.browserOs));
  }

  if (config.tracker.click) {
    const clickables = document.querySelectorAll('[data-click]');

    Array.from(clickables).forEach(element => {
      const callback = utils.once(send);

      element.addEventListener('click', event => {
        let target = event.target;

        if (!target.getAttribute('data-click')) {
          target = target.parentNode;
        }

        callback('click-' + target.getAttribute('data-click'));
      });
    });
  }

  if (config.tracker.observer) {
    const observables = document.querySelectorAll('[data-observer]');

    observer.init(observables, send);
  }

  if (config.tracker.timer) {
    timer.init(send);
  }

  // @todo: Pass a function instead
  if (config.tracker.custom) {
    send('custom-my-event');
  }
};

const send = (string, value) => {
  const requestBody = {
    project: config.projectId,
    key: string || undefined,
    value: value || 1
  };

  // Don't track during development
  if ((config.debug && location.hostname === 'localhost') || (config.debug && location.hostname === '127.0.0.1')) {
    /*eslint no-console: ["error", { allow: ["warn"] }] */
    console.warn('Tracking requests are disabled while working on localhost:\n', requestBody);
  } else {
    // Use sendBeacon if available ...
    if (typeof navigator.sendBeacon == 'function') {
      navigator.sendBeacon(config.serviceUrl, JSON.stringify(requestBody));
      // .. else use good ol' XMLHttpRequest
    } else {
      if (request) {
        request.abort();
      }
      request = new XMLHttpRequest();
      request.open('POST', config.serviceUrl, true);
      request.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
      request.send(JSON.stringify(requestBody));
    }
  }
};
