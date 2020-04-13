import { detect } from 'detect-browser';

const browser = detect();

// Get user browser information
export const getBrowser = () => {
  return {
    name: browser ? browser.name : 'unknown',
    version: browser ? browser.version : 'unknown',
    os: browser ? browser.os : 'unknown'
  };
};

// Get device type (mobile or desktop)
export const getDevice = () => {
  const deviceWidth = parseInt(
    window.innerWidth > 0 ? window.innerWidth : screen.width
  );

  return deviceWidth > 680 ? 'desktop' : 'mobile';
};

// Generates a unique ID (good, but not RFC compliant)
// https://gist.github.com/gordonbrander/2230317
export const getUuid = () => {
  return Math.random()
    .toString(36)
    .slice(2);
};

// Get user do-not-track settings
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack
export const doNotTrackEnabled = () => {
  if (typeof navigator.doNotTrack != 'undefined') {
    return navigator.doNotTrack == '1' ? true : false;
  } else {
    return false;
  }
};
