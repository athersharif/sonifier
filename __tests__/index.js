import { expect } from 'chai';
import { assert } from 'sinon';
import { stubs } from './utils/helpers';

import sonifier, { resetSonifier } from '../src/index';

const data = {
  x: ['x1', 'x2'],
  y: [1, 2],
};

describe('index.js', () => {
  afterEach(() => {
    stubs.tone.dispose.reset();
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

    it('should correctly generate oscillations when settings are provided', () => {
      const settings = {
        note: 'G4',
        oscillator: {
          type: 'sine',
        },
        frequency: {
          minimum: 200,
        },
        volume: -10,
      };

      const oscillations = sonifier(stubs.tone, data, settings);

      expect(oscillations.map((osc) => osc.type)).to.deep.equal([
        'sine',
        'sine',
      ]);
      expect(oscillations[0].frequency.value).to.equal(200);
      expect(oscillations[1].frequency.value).to.equal(650);
      expect(oscillations.map((osc) => osc.volume.value)).to.deep.equal([
        -10, -10,
      ]);
    });

    it('should correctly dispose oscillations on stop', () => {
      const oscillations = sonifier(stubs.tone, data);

      oscillations.forEach((osc) => osc.onstop());

      expect(stubs.tone.dispose.callCount).to.equal(4);
    });
  });

  describe('resetSonifier', () => {
    it('should call stop and clear transport when oscillations are not provided', () => {
      resetSonifier(stubs.tone);

      expect(stubs.tone.Transport.stop.called).to.be.true;
      expect(stubs.tone.Transport.clear.called).to.be.true;
      expect(stubs.tone.dispose.callCount).to.equal(0);
    });

    it('should call stop and clear transport when oscillations are empty', () => {
      const oscillations = [];
      resetSonifier(stubs.tone, oscillations);

      expect(stubs.tone.Transport.stop.called).to.be.true;
      expect(stubs.tone.Transport.clear.called).to.be.true;
      expect(stubs.tone.dispose.callCount).to.equal(0);
    });

    it('should call stop and clear transport and dispose non-disposed oscillations when provided', () => {
      const oscillations = [
        { disposed: false, dispose: stubs.tone.dispose },
        { disposed: false, dispose: stubs.tone.dispose },
        { disposed: true, dispose: stubs.tone.dispose },
      ];

      resetSonifier(stubs.tone, oscillations);

      expect(stubs.tone.Transport.stop.called).to.be.true;
      expect(stubs.tone.Transport.clear.called).to.be.true;
      expect(stubs.tone.dispose.callCount).to.equal(2);
    });
  });
});
