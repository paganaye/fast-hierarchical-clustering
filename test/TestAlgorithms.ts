import { expect } from 'chai';
import { ClassicAlgorithm } from '../src/ClassicAlgorithm';
import { Cluster, Dendrogram } from '../src/Cluster';
import { App } from '../src/Main';
import { NewAlgorithm } from '../src/NewAlgorithm';
import { Point } from '../src/Point';
import { QuadTree } from '../src/QuadTree';


describe('Algorithms', function () {

  it('one trio', function () {
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
      console.log({ classicAlgorithmFirstPair, newAlgorithmFirstPair });
      expect(newAlgorithmFirstPair).to.eq(classicAlgorithmFirstPair);
    }
  });

  it('another trio', function () {
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
      console.log({ classicAlgorithmFirstPair, newAlgorithmFirstPair });
      expect(newAlgorithmFirstPair).to.eq(classicAlgorithmFirstPair);
    }
  });


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
        console.log({ classicAlgorithmFirstPair, newAlgorithmFirstPair });
        expect(newAlgorithmFirstPair).to.eq(classicAlgorithmFirstPair);
        break;
      }
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

      let classicAlgorithmFirstPair = classicAlgorithm.findNearestTwoPoints()?.toString();
      let newAlgorithmFirstPair = newAlgorithm.findNearestTwoPoints()?.toString();
      if (classicAlgorithmFirstPair == newAlgorithmFirstPair) {
        console.log("OK", classicAlgorithmFirstPair);
      } else {
        console.log({ pt1, pt2, pt3, pt4 });
        console.log({ classicAlgorithmFirstPair, newAlgorithmFirstPair });
        expect(newAlgorithmFirstPair).to.eq(classicAlgorithmFirstPair);
        break;
      }

      let classicAlgorithmSecondPair = classicAlgorithm.findNearestTwoPoints()?.toString();
      let newAlgorithmSecondPair = newAlgorithm.findNearestTwoPoints()?.toString();
      if (classicAlgorithmSecondPair == newAlgorithmSecondPair) {
        console.log("OK", classicAlgorithmSecondPair);
      } else {
        console.log({ pt1, pt2, pt3, pt4 });
        console.log({ classicAlgorithmSecondPair, newAlgorithmSecondPair });
        expect(newAlgorithmSecondPair).to.eq(classicAlgorithmSecondPair);
        break;
      }

      let classicAlgorithmThirdPair = classicAlgorithm.findNearestTwoPoints()?.toString();
      let newAlgorithmThirdPair = newAlgorithm.findNearestTwoPoints()?.toString();
      if (classicAlgorithmThirdPair == newAlgorithmThirdPair) {
        console.log("OK", classicAlgorithmThirdPair);
      } else {
        console.log({ pt1, pt2, pt3, pt4 });
        console.log({ classicAlgorithmThirdPair, newAlgorithmThirdPair });
        expect(newAlgorithmThirdPair).to.eq(classicAlgorithmThirdPair);
        break;
      }

    }
  });
});
