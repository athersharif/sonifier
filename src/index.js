/**
 * @namespace sonifier
 */

import defaultsDeep from 'lodash/defaultsDeep';

/**
 * Default settings for the sonifier.
 * @memberOf sonifier
 */
const defaultSettings = {
  note: 'C3',
  oscillator: {
    type: 'sawtooth',
    interval: 0.5,
  },
  frequency: {
    minimum: 130,
    maximum: 650,
  },
  volume: -25,
};

/**
 * Resets the sonifier. Used when a current sonification response needs to be stopped.
 * @memberOf sonifier
 */
export const resetSonifier = (Tone, oscillations = []) => {
  Tone.Transport.stop();
  Tone.Transport.clear();

  oscillations.forEach((osc) => {
    if (!osc.disposed) osc.dispose();
  });
};

/**
 * Maps the value to a frequency.
 * @memberOf sonifier
 * @param {number} value - The data value to be mapped to a frequency.
 * @param {number} minimumDataValue - The minimum data point in the data set.
 * @param {number} maximumDataValue - The maximum data point in the data set.
 * @param {number} minimumFrequency - The minimum allowed frequency.
 * @param {number} maximumFrequency - The maximum allowed frequency.
 * @returns {number} - Calculated frequency for the data value.
 */
const toFrequency = (
  value,
  minimumDataValue,
  maximumDataValue,
  minimumFrequency,
  maximumFrequency
) =>
  ((value - minimumDataValue) * (maximumFrequency - minimumFrequency)) /
    (maximumDataValue - minimumDataValue) +
  minimumFrequency;

/**
 * Generates the sonified respoonse.
 * @memberOf sonifier
 * @param {Object} Tone - The instance from tonejs library.
 * @param {Object} data - The data from the viz.
 * @param {string[]} data.x - Values of the independent variable.
 * @param {string[]} data.y - Values of the dependent variable.
 * @returns {Object[]} - Oscillations in the sonified response.
 */
const sonifier = (Tone, data, settings = {}) => {
  const sortedData = [...data.y].sort((a, b) => a - b);
  const maxValue = sortedData[sortedData.length - 1];
  const minValue = sortedData[0];

  settings = defaultsDeep(settings, defaultSettings);

  let oscillations = [];
  let start = 0;
  let stop = start + settings.oscillator.interval;

  data.y
    .map((d) =>
      toFrequency(
        d,
        minValue,
        maxValue,
        settings.frequency.minimum,
        settings.frequency.maximum
      )
    )
    .forEach((d) => {
      const osc = new Tone.OmniOscillator(
        settings.note,
        settings.oscillator.type
      ).toDestination();
      osc.frequency.value = d;
      osc.volume.value = settings.volume;
      osc.onstop = () => osc.dispose();
      osc.sync().start(start).stop(stop);

      oscillations.push(osc);
      start = stop;
      stop = stop + settings.oscillator.interval;
    });

  console.log('[Sonifier] Playing sonification');

  Tone.Transport.start();

  return oscillations;
};

export default sonifier;
