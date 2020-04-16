import { pretty } from './utils';

export function init(config) {
  const { selector, caseData } = config;

  const text = `

  `;

  const textElement = document.querySelector(selector);
  textElement.textContent = text;
}
