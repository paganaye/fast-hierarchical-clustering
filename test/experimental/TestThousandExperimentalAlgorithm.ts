import { expect } from 'chai';
import { ExperimentalAvgAlgorithm } from '../../src/experimental/ExperimentalAvgAlgorithm';
import { Point } from '../../src/Point';
import { AlgorithmType } from '../../src/workers/AlgorithmType';
import { getNormalizedDendrogram, runThousandQuartets, runThousandQuintets, runThousandTrios } from '../Utils';

describe('Experimental random tests', function () {
  it('thousand experimental trios', function () {
    runThousandTrios(AlgorithmType.ExperimentalAvg);
  });

  it('thousand experimental quartets', function () {
    runThousandQuartets(AlgorithmType.ExperimentalAvg);
  });


  it('thousand experimental quintets', function () {
    runThousandQuintets(AlgorithmType.ExperimentalAvg);
  });


  it('trio a9e9a3e ExperimentalAvg', function () {
    let A = new Point(0.3955, 0.4959, "A"); //          AB 0.213 AC 0.172
    let B = new Point(0.2064, 0.5934, "B"); // BA 0.213          BC 0.365
    let C = new Point(0.5650, 0.5237, "C"); // CA 0.172 CB 0.365         
    let algorithmResult = getNormalizedDendrogram(new ExperimentalAvgAlgorithm([A, B, C]), true);
    expect(algorithmResult).to.eq("((A-C 0.172)-B 0.286)"); // and not B (A-C 0.172)
  });

  it('quartet 3b1a9e75 ExperimentalAvg', function () {
    let A = new Point(0.6297, 0.9495, "A"); //          AB 0.765 AC 0.504 AD 0.507
    let B = new Point(0.6119, 0.1846, "B"); // BA 0.765          BC 0.778 BD 0.521
    let C = new Point(0.1459, 0.8079, "C"); // CA 0.504 CB 0.778          CD 0.853
    let D = new Point(0.9642, 0.5685, "D"); // DA 0.507 DB 0.521 DC 0.853         

    let algorithmResult = getNormalizedDendrogram(new ExperimentalAvgAlgorithm([A, B, C, D]), true);

    expect(algorithmResult).to.eq("((A-C 0.504)-(B-D 0.521) 0.642)"); // and not (B-(D-(A-C 0.504) 0.655) 0.592)
  });

});

