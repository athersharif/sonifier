import mock from 'mock-require';
import sinon from 'sinon';

export const stubs = {
  console: {
    error: sinon.stub(),
    log: sinon.stub(),
  },
  tone: {
    Transport: {
      start: sinon.stub(),
      stop: sinon.stub(),
      clear: sinon.stub(),
    },
    OmniOscillator: () => ({
      toDestination: () => ({
        dispose: stubs.tone.dispose,
        frequency: {},
        start: function () {
          return this;
        },
        stop: () => {},
        sync: () => {},
        unsync: stubs.tone.unsync,
        volume: {},
      }),
    }),
    MonoSynth: () => ({
      toDestination: () => ({
        dispose: stubs.tone.dispose,
        frequency: {},
        sync: () => {},
        triggerAttackRelease: stubs.tone.triggerAttackRelease,
        unsync: stubs.tone.unsync,
        volume: {},
      }),
    }),
    Envelope: () => ({
      toDestination: () => ({
        dispose: stubs.tone.dispose,
        frequency: {},
        sync: () => {},
        triggerAttackRelease: stubs.tone.triggerAttackRelease,
        unsync: stubs.tone.unsync,
        volume: {},
      }),
    }),
    dispose: sinon.stub(),
    triggerAttackRelease: sinon.stub(),
    unsync: sinon.stub(),
  },
};

global.console = stubs.console;

mock('tone', {
  OmniOscillator: stubs.tone.OmniOscillator,
  Transport: stubs.tone.Transport,
});
