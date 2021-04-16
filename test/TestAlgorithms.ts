import { expect } from 'chai';
import { ClassicAlgorithm } from '../src/ClassicAlgorithm';
import { Cluster, Dendrogram } from '../src/Cluster';
import { App } from '../src/Main';
import { NewAlgorithm } from '../src/NewAlgorithm';
import { Point } from '../src/Point';
import { QuadTree } from '../src/QuadTree';


describe('Algorithms', function () {
  it('many trios', function () {
    for (let i = 1; i < 1000; i++) {
      let pt1 = Point.randomPoint();
      let pt2 = Point.randomPoint();
      let pt3 = Point.randomPoint();
      let points = [pt1, pt2, pt3];

      let classicAlgorithm = new ClassicAlgorithm();
      let newAlgorithm = new NewAlgorithm();
      classicAlgorithm.init(points);
      newAlgorithm.init(points);
      let classicAlgorithmFirstPair = classicAlgorithm.findNearestTwoPoints()?.toString();
      let newAlgorithmFirstPair = newAlgorithm.findNearestTwoPoints()?.toString();
      if (classicAlgorithmFirstPair == newAlgorithmFirstPair) {
        console.log("OK", classicAlgorithmFirstPair);
      } else {
        console.log({ pt1, pt2, pt3 });
        console.warn({ classicAlgorithmFirstPair, newAlgorithmFirstPair });
        expect(newAlgorithmFirstPair).to.eq(classicAlgorithmFirstPair);
        break;
      }
    }
  });

  it('trio I', function () {
    let pt1 = new Point(0.0, 0.7, "A");
    let pt2 = new Point(0.0, 0.0, "B");
    let pt3 = new Point(0.4, 0.4, "C");
    let points = [pt1, pt2, pt3];

    let classicAlgorithm = new ClassicAlgorithm();
    let newAlgorithm = new NewAlgorithm(3);
    classicAlgorithm.init(points);
    newAlgorithm.init(points);

    newAlgorithm.quadTree.print();

    let classicAlgorithmFirstPair = classicAlgorithm.findNearestTwoPoints()?.toString();
    let newAlgorithmFirstPair = newAlgorithm.findNearestTwoPoints()?.toString();
    if (classicAlgorithmFirstPair == newAlgorithmFirstPair) {
      console.log("OK", classicAlgorithmFirstPair);
    } else {
      console.log({ pt1, pt2, pt3 });
      console.warn({ classicAlgorithmFirstPair, newAlgorithmFirstPair });
      expect(newAlgorithmFirstPair).to.eq(classicAlgorithmFirstPair);
    }
  });

  it('trio II', function () {
    let pt1 = new Point(0.5115088349935988, 0.21862340412971348, "A");
    let pt2 = new Point(0.9955296869717942, 0.031049824724005415, "B");
    let pt3 = new Point(0.05789661034187388, 0.3230548331395249, "C");
    let points = [pt1, pt2, pt3];

    let classicAlgorithm = new ClassicAlgorithm();
    let newAlgorithm = new NewAlgorithm(3);
    classicAlgorithm.init(points);
    newAlgorithm.init(points);

    newAlgorithm.quadTree.print();

    let classicAlgorithmFirstPair = classicAlgorithm.findNearestTwoPoints()?.toString();
    let newAlgorithmFirstPair = newAlgorithm.findNearestTwoPoints()?.toString();
    if (classicAlgorithmFirstPair == newAlgorithmFirstPair) {
      console.log("OK", classicAlgorithmFirstPair);
    } else {
      console.log({ pt1, pt2, pt3 });
      console.warn({ classicAlgorithmFirstPair, newAlgorithmFirstPair });
      expect(newAlgorithmFirstPair).to.eq(classicAlgorithmFirstPair);
    }
  });

  it('many quintet', function () {
    for (let i = 1; i < 1000; i++) {
      let pt1 = Point.randomPoint();
      let pt2 = Point.randomPoint();
      let pt3 = Point.randomPoint();
      let pt4 = Point.randomPoint();
      let pt5 = Point.randomPoint();
      let points = [pt1, pt2, pt3, pt4, pt5];

      let classicAlgorithm = new ClassicAlgorithm();
      let newAlgorithm = new NewAlgorithm();
      classicAlgorithm.init(points);
      newAlgorithm.init(points);

      for (let pairNo = 0; pairNo < 4; pairNo++) {
        let classicAlgorithmPair = classicAlgorithm.findNearestTwoPoints();
        let newAlgorithmPair = newAlgorithm.findNearestTwoPoints();
        if (classicAlgorithmPair?.toString() == newAlgorithmPair?.toString()) {
          classicAlgorithmPair?.merge();
          newAlgorithmPair?.merge();
        } else {
          console.warn({ pairNo, classicAlgorithmPair, newAlgorithmPair });
          console.log(`let pt1 = new Point(${pt1.x}, ${pt1.y}, "A");`);
          console.log(`let pt2 = new Point(${pt2.x}, ${pt2.y}, "B");`);
          console.log(`let pt3 = new Point(${pt3.x}, ${pt3.y}, "C");`);
          console.log(`let pt4 = new Point(${pt4.x}, ${pt4.y}, "D");`);
          console.log(`let pt5 = new Point(${pt5.x}, ${pt5.y}, "E");`);
          expect(newAlgorithmPair?.toString()).to.eq(classicAlgorithmPair?.toString());
        }
      }
    }
  });

  it('quintet I', function () {
    let pt1 = new Point(0.8767518810794577, 0.943466293666587, "A");
    let pt2 = new Point(0.10144722836722542, 0.2289250879072302, "B");
    let pt3 = new Point(0.26229529095780024, 0.15026275803528977, "C");
    let pt4 = new Point(0.972246243486139, 0.7246467355009985, "D");
    let pt5 = new Point(0.1551857473627054, 0.11305052171630381, "E");
    let points = [pt1, pt2, pt3, pt4, pt5];

    let classicAlgorithm = new ClassicAlgorithm();
    let newAlgorithm = new NewAlgorithm(1);
    classicAlgorithm.init(points);
    newAlgorithm.init(points);
    for (let pairNo = 0; pairNo < 4; pairNo++) {
      let classicAlgorithmPair = classicAlgorithm.findNearestTwoPoints();
      let newAlgorithmPair = newAlgorithm.findNearestTwoPoints();
      if (classicAlgorithmPair?.toString() == newAlgorithmPair?.toString()) {
        classicAlgorithmPair?.merge();
        newAlgorithmPair?.merge();
        console.log("OK", classicAlgorithmPair?.toString());
      } else {
        console.warn({ pairNo, classicAlgorithmPair, newAlgorithmPair });
        console.log(`let pt1 = new Point(${pt1.x}, ${pt1.y}, "A");`);
        console.log(`let pt2 = new Point(${pt2.x}, ${pt2.y}, "B");`);
        console.log(`let pt3 = new Point(${pt3.x}, ${pt3.y}, "C");`);
        console.log(`let pt4 = new Point(${pt4.x}, ${pt4.y}, "D");`);
        console.log(`let pt5 = new Point(${pt5.x}, ${pt5.y}, "E");`);
        expect(newAlgorithmPair?.toString()).to.eq(classicAlgorithmPair?.toString());
      }
    }
  });
});
