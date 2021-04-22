import { AlgorithmType } from '../../src/workers/AlgorithmType';
import { runThousandQuintets, runThousandTrios } from '../Utils';

describe('New random tests', function () {
  it('thousand new trios', function () {
    runThousandTrios(AlgorithmType.NewAvg);
  });

  it('thousand new quintets', function () {
    runThousandQuintets(AlgorithmType.NewAvg);
  });
});

