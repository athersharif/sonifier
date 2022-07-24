import { expect } from 'chai';
import { stubs } from './utils/helpers';

import sonifier, { resetSonifier } from '../src/index';

const data = {
  x: ['x1', 'x2'],
  y: [1, 2],
};

describe('index.js', () => {
  afterEach(() => {
    stubs.tone.dispose.reset();
    stubs.tone.unsync.reset();
    stubs.tone.triggerAttackRelease.reset();
    stubs.tone.Transport.start.reset();
    stubs.tone.Transport.stop.reset();
    stubs.tone.Transport.clear.reset();
  });

  describe('sonifier', () => {
    it('should correctly generate oscillations using default settings', () => {
      const oscillations = sonifier(stubs.tone, data);

      expect(stubs.tone.Transport.start.called).to.be.true;
      expect(oscillations.length).to.equal(2);
      expect(oscillations[0].frequency.value).to.equal(130);
      expect(oscillations[1].frequency.value).to.equal(650);
    });

    it('should correctly generate oscillations when monosynth settings are provided', () => {
      const settings = {
        soundType: 'MonoSynth',
        oscillator: {
          sourceType: 'fm',
          baseType: 'square',
          partialCount: 8,
        },
        frequency: {
          minimum: 222,
          maximum: 333,
        },
        volume: 7,
      };

      const oscillations = sonifier(stubs.tone, data, settings);

      expect(oscillations.map((osc) => osc.type)).to.deep.equal([
        'fmsquare8',
        'fmsquare8',
      ]);
      expect(oscillations[0].frequency.value).to.equal(222);
      expect(oscillations[1].frequency.value).to.equal(333);
      expect(oscillations.map((osc) => osc.volume.value)).to.deep.equal([7, 7]);
    });

    it('should correctly generate oscillations when envelope settings are provided', () => {
      const settings = {
        soundType: 'Envelope',
        oscillator: {
          sourceType: 'am',
          baseType: 'sine',
          partialCount: 4,
        },
        frequency: {
          minimum: 123,
          maximum: 456,
        },
      };

      const oscillations = sonifier(stubs.tone, data, settings);

      expect(oscillations.map((osc) => osc.type)).to.deep.equal([
        'amsine4',
        'amsine4',
      ]);
      expect(oscillations[0].frequency.value).to.equal(123);
      expect(oscillations[1].frequency.value).to.equal(456);
      expect(oscillations.map((osc) => osc.volume.value)).to.deep.equal([
        -25, -25,
      ]);
    });

    it('should correctly dispose oscillations on stop', () => {
      const oscillations = sonifier(stubs.tone, data);

      oscillations.forEach((osc) => osc.onstop());

      expect(stubs.tone.dispose.callCount).to.equal(2);
      expect(stubs.tone.unsync.callCount).to.equal(2);
    });
  });

  describe('resetSonifier', () => {
    it('should call stop and clear transport when oscillations are not provided', () => {
      resetSonifier(stubs.tone);

      expect(stubs.tone.Transport.stop.called).to.be.true;
      expect(stubs.tone.Transport.clear.called).to.be.true;
      expect(stubs.tone.dispose.callCount).to.equal(0);
      expect(stubs.tone.unsync.callCount).to.equal(0);
    });

    it('should call stop and clear transport when oscillations are empty', () => {
      const oscillations = [];
      resetSonifier(stubs.tone, oscillations);

      expect(stubs.tone.Transport.stop.called).to.be.true;
      expect(stubs.tone.Transport.clear.called).to.be.true;
      expect(stubs.tone.dispose.callCount).to.equal(0);
      expect(stubs.tone.unsync.callCount).to.equal(0);
    });

    it('should call stop and clear transport and dispose non-disposed oscillations when provided and whenever unsync present', () => {
      const oscillations = [
        { disposed: false, dispose: stubs.tone.dispose },
        {
          disposed: false,
          dispose: stubs.tone.dispose,
          unsync: stubs.tone.unsync,
        },
        { disposed: true, dispose: stubs.tone.dispose },
      ];

      resetSonifier(stubs.tone, oscillations);

      expect(stubs.tone.Transport.stop.called).to.be.true;
      expect(stubs.tone.Transport.clear.called).to.be.true;
      expect(stubs.tone.dispose.callCount).to.equal(2);
      expect(stubs.tone.unsync.callCount).to.equal(1);
    });
  });
});
