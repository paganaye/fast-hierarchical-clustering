import { expect } from 'chai';
import { ClassicAvgAlgorithm } from '../src/classic/ClassicAvgAlgorithm';
import { Cluster } from '../src/Cluster';
import { FasterAvgAlgorithm } from '../src/faster/FasterAvgAlgorithm';
import { Point } from '../src/Point';
import { PseudoRandom } from './PseudoRandom';
import { getNormalizedDendrogram } from './Utils';


describe('Faster Avg algorithm', function () {
  PseudoRandom.randomize(1234);
  it('many trios', function () {
    for (let i = 1; i < 1000; i++) {
      let seed = PseudoRandom._seed;
      let a = Point.randomPoint("A");
      let b = Point.randomPoint("B");
      let c = Point.randomPoint("C");
      let points = [a, b, c];

      let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
      let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(3, points));

      if (classicAlgorithm != newAlgorithm) {
        console.log(`it('trio ${seed.toString(16)}', function () {`)
        console.log(`  let a = new Point(${a.x.toFixed(4)}, ${a.y.toFixed(4)}, "A");`)
        console.log(`  let b = new Point(${b.x.toFixed(4)}, ${b.y.toFixed(4)}, "B");`)
        console.log(`  let c = new Point(${c.x.toFixed(4)}, ${c.y.toFixed(4)}, "C");`)
        console.log(`  let points = [a, b, c];`)
        console.log(`  let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));`)
        console.log(`  let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(3, points));`)
        console.log(`  expect(classicAlgorithm).to.eq("${classicAlgorithm}");`);
        console.log(`  expect(newAlgorithm).to.eq("${classicAlgorithm}");`);
        console.log(`  // and not ${newAlgorithm}`);
        console.log(`});`)
        console.log({ classicAlgorithm })
      }
      expect(classicAlgorithm).to.eq(newAlgorithm);
    }
  });

  it('trio 5d42a7c9', function () {
    let a = new Point(0.5241, 0.5317, "A");
    let b = new Point(0.8546, 0.5210, "B");
    let c = new Point(0.4137, 0.2350, "C");
    let points = [a, b, c];
    let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(3, points));
    expect(classicAlgorithm).to.eq("(B-(A-C))");
    expect(newAlgorithm).to.eq("(B-(A-C))");
    // and not ((A-B)-C)
  });


  it('many quintet', function () {
    PseudoRandom.randomize(1234);

    for (let i = 1; i < 1000; i++) {
      let a = Point.randomPoint("A");
      let b = Point.randomPoint("B");
      let c = Point.randomPoint("C");
      let d = Point.randomPoint("D");
      let e = Point.randomPoint("E");

      let points = [a, b, c, d, e];

      let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
      let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(4, points));
      if (classicAlgorithm != newAlgorithm) {
        console.log(`let a = new Point(${a.x.toFixed(4)}, ${a.y.toFixed(4)}, "A");`)
        console.log(`let b = new Point(${b.x.toFixed(4)}, ${b.y.toFixed(4)}, "B");`)
        console.log(`let c = new Point(${c.x.toFixed(4)}, ${c.y.toFixed(4)}, "C");`)
        console.log(`let d = new Point(${d.x.toFixed(4)}, ${d.y.toFixed(4)}, "D");`)
        console.log(`let e = new Point(${e.x.toFixed(4)}, ${e.y.toFixed(4)}, "E");`)
        console.log({ classicAlgorithm })
        console.log({ newAlgorithm })
      }
      expect(classicAlgorithm).to.eq(newAlgorithm);
    }
  });

  it('quintet I', function () {

  });

  it('quintet II', function () {

  });

  it('quintet III', function () {

  });

  it('quintet IV', function () {

  });
});
