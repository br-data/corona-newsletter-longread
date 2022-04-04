import { pretty } from '../utils';

export function init(config) {
  const { target, cases } = config;

  const uniqueStates = [...new Set(cases.map(d => d.bundeslandId))];

  const worstStates = uniqueStates.map(stateId => {
    const currentStateCases = cases.filter(c => c.bundeslandId === stateId);

    return currentStateCases[currentStateCases.length - 1];
  }).sort((a, b) => b.inzidenz - a.inzidenz);

  const text = `Am stärksten betroffen ist momentan das Bundesland ${worstStates[0].bundesland}. Pro 100.000 Einwohner wurden in der letzten Wochen ${pretty(worstStates[0].inzidenz)} Fälle gemeldet.

  Vergleichsweise am besten steht ${worstStates[worstStates.length-1].bundesland} da. Dort wurden bislang nur ${pretty(worstStates[worstStates.length-1].inzidenz)} Fälle pro 100.000 Einwohner in den letzten sieben Tagen gemeldet.`;

  const textElement = document.querySelector(target);
  textElement.textContent = text;
}
