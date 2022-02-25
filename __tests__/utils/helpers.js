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
    OmniOscillator: (frequency, type) => ({
      toDestination: () => ({
        type,
        frequency: { value: frequency },
        volume: { value: null },
        sync: function () {
          return this;
        },
        start: function () {
          return this;
        },
        stop: function () {
          this.onstop();
          return this;
        },
        onstop: () => {},
        dispose: stubs.tone.dispose,
      }),
    }),
    dispose: sinon.stub(),
  },
};

global.console = stubs.console;

mock('tone', {
  OmniOscillator: stubs.tone.OmniOscillator,
  Transport: stubs.tone.Transport,
});
