"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSynth = void 0;

var getSynth = function getSynth(Tone, soundType, options) {
  var synth = null;

  var middleware = function middleware() {
    synth.frequency.value = options.frequency;
    synth.volume.value = options.volume;
    synth.type = options.oscillatorType;
    synth.sync();
  };

  if (soundType === 'OmniOscillator') {
    synth = new Tone.OmniOscillator(options.note, options.oscillatorType).toDestination();
    middleware();
    synth.start(options.start).stop(options.stop);
  } else if (soundType === 'MonoSynth') {
    synth = new Tone.MonoSynth({
      oscillator: {
        type: options.oscillatorType
      },
      envelope: {
        attack: 0.1
      }
    }).toDestination();
    middleware();
    synth.triggerAttackRelease(options.frequency, '8n', options.start);
  } else if (soundType === 'Envelope') {
    synth = new Tone.Envelope({
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.8
    }).toDestination();
    middleware();
    synth.triggerAttackRelease(options.frequency, '8n', options.start);
  }

  synth.onstop = function () {
    synth.dispose();
    synth.unsync();
  };

  return synth;
};

exports.getSynth = getSynth;