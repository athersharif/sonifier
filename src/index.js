/**
 * @namespace sonifier
 */

import defaultsDeep from 'lodash/defaultsDeep';
import { getSynth } from './getSynth';

/**
 * Default settings for the sonifier.
 * @memberOf sonifier
 */
const defaultSettings = {
  soundType: 'OmniOscillator',
  note: 'C4',
  oscillator: {
    // https://github.com/Tonejs/Tone.js/blob/c313bc6/Tone/source/oscillator/OscillatorInterface.ts#L439
    sourceType: 'am',
    baseType: 'square',
    partialCount: 8,
    interval: 0.5,
  },
  frequency: {
    minimum: 130,
    maximum: 650,
  },
  envelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.8,
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
    if (!osc.disposed) {
      osc.dispose();
      if (osc.unsync) osc.unsync();
    }
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
 * Constructs the oscillator type as per Tone.js library's specs
 * @memberOf sonifier
 * @param {Object} settings - The settings for the sonifier
 * @returns {string} - The oscillator type for the Tone.js oscillator
 */
const getOscillatorType = (settings) => {
  const { baseType, sourceType, partialCount } = settings.oscillator;

  return sourceType + baseType + partialCount;
};

/**
 * Generates the sonified respoonse.
 * @memberOf sonifier
 * @param {Object} Tone - The instance from tonejs library.
 * @param {Object} data - The data from the viz.
 * @param {string[]} data.x - Values of the independent variable.
 * @param {string[]} data.y - Values of the dependent variable.
 * @param {string[]} settings - Settings for the sonfiied response.
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
      const oscillatorType = getOscillatorType(settings);

      const options = {
        envelope: settings.envelope,
        frequency: d,
        note: settings.note,
        oscillatorType,
        start,
        stop,
        volume: settings.volume,
      };

      const synth = getSynth(Tone, settings.soundType, options);

      oscillations.push(synth);
      start = stop;
      stop = stop + settings.oscillator.interval;
    });

  console.log('[Sonifier] Playing sonification');

  Tone.Transport.start();

  return oscillations;
};

export default sonifier;
