import { expect } from 'chai';
import { ClassicAvgAlgorithm } from '../../src/classic/ClassicAvgAlgorithm';
import { Cluster } from '../../src/Cluster';
import { FasterAvgAlgorithm } from '../../src/faster/FasterAvgAlgorithm';
import { Point } from '../../src/Point';
import { getNormalizedDendrogram } from '../Utils';


describe('Faster AvgAlgorithm', function () {

  it('trio 5d42a7c9', function () {
    let a = new Point(0.5241, 0.5317, "A");
    let b = new Point(0.8546, 0.5210, "B");
    let c = new Point(0.4137, 0.2350, "C");
    let points = [a, b, c];
    let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(points));
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
    let newAlgo = new FasterAvgAlgorithm(points);
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
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(points));
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
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(points));
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
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(points));

    expect(classicAlgorithm).to.eq("((A-C)-B)");
    expect(newAlgorithm).to.eq("((A-C)-B)");
    // and not ((B-C)-A)
  });

  it('trio 2274ef1f', function () {
    let a = new Point(0.3359, 0.5524, "A");
    let b = new Point(0.8670, 0.5712, "B");
    let c = new Point(0.3250, 0.0410, "C");
  
    // ab 0.531 ac 0.511 bc 0.758
    let points = [a, b, c];
    let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));

    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(points));
    expect(classicAlgorithm).to.eq("(B-(A-C))");

    expect(newAlgorithm).to.eq("(B-(A-C))");
    // and not B (A-C)
  });
  it('quintet 279c6103', function () {
    let a = new Point(0.0910, 0.0462, "A");
    let b = new Point(0.4673, 0.3398, "B");
    let c = new Point(0.6987, 0.4963, "C");
    let d = new Point(0.2709, 0.3839, "D");
    let e = new Point(0.5507, 0.0898, "E");
    // aa 0.000 ab 0.477 ac 0.756 ad 0.383 ae 0.462
    // ba 0.477 bb 0.000 bc 0.279 bd 0.201 be 0.264
    // ca 0.756 cb 0.279 cc 0.000 cd 0.442 ce 0.433
    // da 0.383 db 0.201 dc 0.442 dd 0.000 de 0.406
    // ea 0.462 eb 0.264 ec 0.433 ed 0.406 ee 0.000
    let points = [a, b, c, d, e];
    let classicAlgorithm = getNormalizedDendrogram(new ClassicAvgAlgorithm(points));
    let newAlgorithm = getNormalizedDendrogram(new FasterAvgAlgorithm(points));
    expect(classicAlgorithm).to.eq("((C-(E-(B-D)))-A)");
    expect(newAlgorithm).to.eq("((C-(E-(B-D)))-A)");
    // classic
    // { cluster: '(B-D)', distance: '0.201' }
    // { cluster: '(E-(B-D))', distance: '0.327' }
    // { cluster: '(C-(E-(B-D)))', distance: '0.351' }
    // { cluster: '((C-(E-(B-D)))-A)', distance: '0.494' }
    // new
    // { cluster: '(B-D)', distance: '0.201' }
    // { cluster: '(E-(B-D))', distance: '0.327' }
    // { cluster: '((E-(B-D))-A)', distance: '0.407' } <= wrong
    // { cluster: '(C-((E-(B-D))-A))', distance: '0.452' }

    // and not (C-((E-(B-D))-A))
  });

});
