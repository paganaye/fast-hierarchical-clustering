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
        console.log(`  // ab ${a.distanceTo(b).toFixed(3)} ac ${a.distanceTo(c).toFixed(3)} bc ${b.distanceTo(c).toFixed(3)}`);
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

  it('trio 190a991e', function () {
    let a = new Point(0.0531, 0.7191, "A");
    let b = new Point(0.2518, 0.4110, "B");
    let c = new Point(0.2416, 0.9598, "C");

    let points = [a, b, c];
    let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
    let newAlgo = new FasterAvgAlgorithm(3, points);
    newAlgo.quadTree.print();
    let newAlgorithm = getNormalizedDendrogram(newAlgo);

    expect(classicAlgorithm).to.eq("(B-(A-C))");
    expect(newAlgorithm).to.eq("(B-(A-C))");
    // and not (C-(A-B))
  });

  it('trio 33e7fb61', function () {
    let a = new Point(0.5247, 0.2989, "A");
    let b = new Point(0.1726, 0.3846, "B");
    let c = new Point(0.3572, 0.2886, "C");
    let points = [a, b, c];
    let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(3, points));
    expect(classicAlgorithm).to.eq("((A-C)-B)");
    expect(newAlgorithm).to.eq("((A-C)-B)");
    // and not (A-(B-C))
  });

  it('trio 4ab776fe', function () {
    let a = new Point(0.6476, 0.5768, "A");
    let b = new Point(0.2616, 0.3401, "B");
    let c = new Point(0.9816, 0.4764, "C");
    let points = [a, b, c];
    let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(3, points));
    expect(classicAlgorithm).to.eq("((A-C)-B)");
    expect(newAlgorithm).to.eq("((A-C)-B)");
    // and not (C-(A-B))
  });

  it('trio 1dfa636d', function () {
    let a = new Point(0.2624, 0.7836, "A");
    let b = new Point(0.3564, 0.4028, "B");
    let c = new Point(0.5161, 0.8391, "C");
    // ab 0.392 ac 0.260 bc 0.465
    let points = [a, b, c];
    let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(3, points));
  
    expect(classicAlgorithm).to.eq("((A-C)-B)");
    expect(newAlgorithm).to.eq("((A-C)-B)");
    // and not ((B-C)-A)
  });  


  it('many quintets', function () {
    for (let i = 1; i < 1000; i++) {
      let seed = PseudoRandom._seed;
      let a = Point.randomPoint("A");
      let b = Point.randomPoint("B");
      let c = Point.randomPoint("C");
      let d = Point.randomPoint("D");
      let e = Point.randomPoint("E");
      let points = [a, b, c, d, e];

      let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
      let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(4, points));

      if (classicAlgorithm != newAlgorithm) {
        console.log(`it('quintet ${seed.toString(16)}', function () {`)
        console.log(`  let a = new Point(${a.x.toFixed(4)}, ${a.y.toFixed(4)}, "A");`)
        console.log(`  let b = new Point(${b.x.toFixed(4)}, ${b.y.toFixed(4)}, "B");`)
        console.log(`  let c = new Point(${c.x.toFixed(4)}, ${c.y.toFixed(4)}, "C");`)
        console.log(`  let d = new Point(${c.x.toFixed(4)}, ${c.y.toFixed(4)}, "D");`)
        console.log(`  let e = new Point(${c.x.toFixed(4)}, ${c.y.toFixed(4)}, "E");`)
        console.log(`  // aa ${a.distanceTo(a).toFixed(3)} ab ${a.distanceTo(b).toFixed(3)} ac ${a.distanceTo(c).toFixed(3)} ad ${a.distanceTo(d).toFixed(3)} ae ${a.distanceTo(e).toFixed(3)}`);
        console.log(`  // ba ${b.distanceTo(a).toFixed(3)} bb ${b.distanceTo(b).toFixed(3)} bc ${b.distanceTo(c).toFixed(3)} bd ${b.distanceTo(d).toFixed(3)} be ${b.distanceTo(e).toFixed(3)}`);
        console.log(`  // ca ${c.distanceTo(a).toFixed(3)} cb ${c.distanceTo(b).toFixed(3)} cc ${c.distanceTo(c).toFixed(3)} cd ${c.distanceTo(d).toFixed(3)} ce ${c.distanceTo(e).toFixed(3)}`);
        console.log(`  // da ${d.distanceTo(a).toFixed(3)} db ${d.distanceTo(b).toFixed(3)} dc ${d.distanceTo(c).toFixed(3)} dd ${d.distanceTo(d).toFixed(3)} de ${d.distanceTo(e).toFixed(3)}`);
        console.log(`  // ea ${e.distanceTo(a).toFixed(3)} eb ${e.distanceTo(b).toFixed(3)} ec ${e.distanceTo(c).toFixed(3)} ed ${e.distanceTo(d).toFixed(3)} ee ${e.distanceTo(e).toFixed(3)}`);
        console.log(`  let points = [a, b, c, d, e];`)
        console.log(`  let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));`)
        console.log(`  let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(4, points));`)
        console.log(`  expect(classicAlgorithm).to.eq("${classicAlgorithm}");`);
        console.log(`  expect(newAlgorithm).to.eq("${classicAlgorithm}");`);
        console.log(`  // and not ${newAlgorithm}`);
        console.log(`});`)
        console.log({ classicAlgorithm })
      }
      expect(classicAlgorithm).to.eq(newAlgorithm);
    }
  });

  it('quintet 279c6103', function () {
    let a = new Point(0.0910, 0.0462, "A");
    let b = new Point(0.4673, 0.3398, "B");
    let c = new Point(0.6987, 0.4963, "C");
    let d = new Point(0.6987, 0.4963, "D");
    let e = new Point(0.6987, 0.4963, "E");
  
    // aa 0.000 ab 0.477 ac 0.756 ad 0.383 ae 0.462
    // ba 0.477 bb 0.000 bc 0.279 bd 0.201 be 0.264
    // ca 0.756 cb 0.279 cc 0.000 cd 0.442 ce 0.433
    // da 0.383 db 0.201 dc 0.442 dd 0.000 de 0.406
    // ea 0.462 eb 0.264 ec 0.433 ed 0.406 ee 0.000
    let points = [a, b, c, d, e];
    let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(4, points));
    expect(classicAlgorithm).to.eq("((C-(E-(B-D)))-A)");
    expect(newAlgorithm).to.eq("((C-(E-(B-D)))-A)");
    // and not (C-((E-(B-D))-A))
  });  

});
