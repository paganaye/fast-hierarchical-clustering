import { expect } from 'chai';
import { ClassicAvgAlgorithm } from '../src/classic/ClassicAvgAlgorithm';
import { FasterAvgAlgorithm } from '../src/faster/FasterAvgAlgorithm';
import { Point } from '../src/Point';
import { PseudoRandom } from './PseudoRandom';


describe('Faster Avg algorithm', function () {
  PseudoRandom.randomize(1234);
  it('many trios', function () {
    for (let i = 1; i < 1000; i++) {
      let pt1 = Point.randomPoint();
      let pt2 = Point.randomPoint();
      let pt3 = Point.randomPoint();
      let points = [pt1, pt2, pt3];

      let classicAlgorithm = new ClassicAvgAlgorithm();
      let newAlgorithm = new FasterAvgAlgorithm();
      classicAlgorithm.init(points);
      newAlgorithm.init(points);
      let classicAlgorithmFirstPair = classicAlgorithm.findNearestTwoPoints()?.toString();
      let newAlgorithmFirstPair = newAlgorithm.findNearestTwoPoints()?.toString();
      if (classicAlgorithmFirstPair == newAlgorithmFirstPair) {
        console.log("OK", classicAlgorithmFirstPair);
      } else {
        console.log({ pt1, pt2, pt3 });
        console.warn("KO", { classicAlgorithmFirstPair, newAlgorithmFirstPair });
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

    let classicAlgorithm = new ClassicAvgAlgorithm();
    let newAlgorithm = new FasterAvgAlgorithm(3);
    classicAlgorithm.init(points);
    newAlgorithm.init(points);

    newAlgorithm.quadTree.print();

    let classicAlgorithmFirstPair = classicAlgorithm.findNearestTwoPoints()?.toString();
    let newAlgorithmFirstPair = newAlgorithm.findNearestTwoPoints()?.toString();
    if (classicAlgorithmFirstPair == newAlgorithmFirstPair) {
      console.log("OK", classicAlgorithmFirstPair);
    } else {
      console.log({ pt1, pt2, pt3 });
      console.warn("KO", { classicAlgorithmFirstPair, newAlgorithmFirstPair });
      expect(newAlgorithmFirstPair).to.eq(classicAlgorithmFirstPair);
    }
  });

  it('trio II', function () {
    let pt1 = new Point(0.5115088349935988, 0.21862340412971348, "A");
    let pt2 = new Point(0.9955296869717942, 0.031049824724005415, "B");
    let pt3 = new Point(0.05789661034187388, 0.3230548331395249, "C");
    let points = [pt1, pt2, pt3];

    let classicAlgorithm = new ClassicAvgAlgorithm();
    let newAlgorithm = new FasterAvgAlgorithm(3);
    classicAlgorithm.init(points);
    newAlgorithm.init(points);

    newAlgorithm.quadTree.print();

    let classicAlgorithmFirstPair = classicAlgorithm.findNearestTwoPoints()?.toString();
    let newAlgorithmFirstPair = newAlgorithm.findNearestTwoPoints()?.toString();
    if (classicAlgorithmFirstPair == newAlgorithmFirstPair) {
      console.log("OK", classicAlgorithmFirstPair);
    } else {
      console.log({ pt1, pt2, pt3 });
      console.warn("KO", { classicAlgorithmFirstPair, newAlgorithmFirstPair });
      expect(newAlgorithmFirstPair).to.eq(classicAlgorithmFirstPair);
    }
  });

  it('many quintet', function () {
    PseudoRandom.randomize(1234);

    for (let i = 1; i < 1000; i++) {
      let pt1 = Point.randomPoint("A");
      let pt2 = Point.randomPoint("B");
      let pt3 = Point.randomPoint("C");
      let pt4 = Point.randomPoint("D");
      let pt5 = Point.randomPoint("E");

      let points = [pt1, pt2, pt3, pt4, pt5];

      let classicAlgorithm = new ClassicAvgAlgorithm();
      let newAlgorithm = new FasterAvgAlgorithm();
      classicAlgorithm.init(points);
      newAlgorithm.init(points);

      for (let pairNo = 0; pairNo < 4; pairNo++) {
        let classicAlgorithmPair = classicAlgorithm.findNearestTwoPoints();
        let newAlgorithmPair = newAlgorithm.findNearestTwoPoints();
        if (classicAlgorithmPair?.toString() == newAlgorithmPair?.toString()) {
          classicAlgorithmPair?.merge();
          newAlgorithmPair?.merge();
        } else {
          console.warn("KO", { i, pairNo });
          console.warn("classicAlgorithmPair", classicAlgorithmPair?.toString(), classicAlgorithmPair?.distance());
          console.warn("newAlgorithmPair    ", newAlgorithmPair?.toString(), newAlgorithmPair?.distance());
          let newAlgorithmPair2 = newAlgorithm.findNearestTwoPoints();
          console.warn("newAlgorithmPair2    ", newAlgorithmPair2?.toString(), newAlgorithmPair2?.distance());
          console.log(`let pt1 = new Point(${pt1.x}, ${pt1.y}, "A");`);
          console.log(`let pt2 = new Point(${pt2.x}, ${pt2.y}, "B");`);
          console.log(`let pt3 = new Point(${pt3.x}, ${pt3.y}, "C");`);
          console.log(`let pt4 = new Point(${pt4.x}, ${pt4.y}, "D");`);
          console.log(`let pt5 = new Point(${pt5.x}, ${pt5.y}, "E");`);
          expect(newAlgorithmPair?.toString()).to.eq(classicAlgorithmPair?.toString());
        }
      }
      console.log("OK", i);
    }
  });

  it('quintet I', function () {
    let pt1 = new Point(0.3127945738963732, 0.13840885426700938, "A");
    let pt2 = new Point(0.23762040840240234, 0.6862099856941123, "B");
    let pt3 = new Point(0.13123201637643578, 0.6165060378764812, "C");
    let pt4 = new Point(0.6169815912069582, 0.6096064128071129, "D");
    let pt5 = new Point(0.654983104350961, 0.3010375265041716, "E");

    let points = [pt1, pt2, pt3, pt4, pt5];

    let classicAlgorithm = new ClassicAvgAlgorithm();
    let newAlgorithm = new FasterAvgAlgorithm(2);
    classicAlgorithm.init(points);
    newAlgorithm.init(points);

    for (let pairNo = 0; pairNo < 4; pairNo++) {
      let classicAlgorithmPair = classicAlgorithm.findNearestTwoPoints();
      let newAlgorithmPair = newAlgorithm.findNearestTwoPoints();
      if (classicAlgorithmPair?.toString() == newAlgorithmPair?.toString()) {
        console.warn("OK", classicAlgorithmPair?.toString());
        classicAlgorithmPair?.merge();
        newAlgorithmPair?.merge();
      } else {
        console.warn("KO", { pairNo });
        console.warn("classicAlgorithmPair", classicAlgorithmPair?.toString(), classicAlgorithmPair?.distance());
        console.warn("newAlgorithmPair    ", newAlgorithmPair?.toString(), newAlgorithmPair?.distance());
        let newAlgorithmPair2 = newAlgorithm.findNearestTwoPoints();
        console.warn("newAlgorithmPair2    ", newAlgorithmPair2?.toString(), newAlgorithmPair2?.distance());
        console.log(`let pt1 = new Point(${pt1.x}, ${pt1.y}, "A");`);
        console.log(`let pt2 = new Point(${pt2.x}, ${pt2.y}, "B");`);
        console.log(`let pt3 = new Point(${pt3.x}, ${pt3.y}, "C");`);
        console.log(`let pt4 = new Point(${pt4.x}, ${pt4.y}, "D");`);
        console.log(`let pt5 = new Point(${pt5.x}, ${pt5.y}, "E");`);
        expect(newAlgorithmPair?.toString()).to.eq(classicAlgorithmPair?.toString());
      }
    }
    console.log("OK");
  });

  it('quintet II', function () {
    let pt1 = new Point(0.43997626839203413, 0.6811472477215782, "A");
    let pt2 = new Point(0.041794951578411225, 0.44775867736689623, "B");
    let pt3 = new Point(0.4800948272273828, 0.9537652795703758, "C");
    let pt4 = new Point(0.9330541011253876, 0.8402781382578222, "D");
    let pt5 = new Point(0.5546709490517815, 0.35464419830091687, "E");

    let points = [pt1, pt2, pt3, pt4, pt5];

    let classicAlgorithm = new ClassicAvgAlgorithm();
    let newAlgorithm = new FasterAvgAlgorithm(2);
    classicAlgorithm.init(points);
    newAlgorithm.init(points);

    for (let pairNo = 0; pairNo < 4; pairNo++) {
      let classicAlgorithmPair = classicAlgorithm.findNearestTwoPoints();
      let newAlgorithmPair = newAlgorithm.findNearestTwoPoints();
      if (classicAlgorithmPair?.toString() == newAlgorithmPair?.toString()) {
        console.warn("OK", classicAlgorithmPair?.toString());
        classicAlgorithmPair?.merge();
        newAlgorithmPair?.merge();
      } else {
        console.warn("KO", { pairNo });
        console.warn("classicAlgorithmPair", classicAlgorithmPair?.toString(), classicAlgorithmPair?.distance());
        console.warn("newAlgorithmPair    ", newAlgorithmPair?.toString(), newAlgorithmPair?.distance());
        let newAlgorithmPair2 = newAlgorithm.findNearestTwoPoints();
        console.warn("newAlgorithmPair2    ", newAlgorithmPair2?.toString(), newAlgorithmPair2?.distance());
        console.log(`let pt1 = new Point(${pt1.x}, ${pt1.y}, "A");`);
        console.log(`let pt2 = new Point(${pt2.x}, ${pt2.y}, "B");`);
        console.log(`let pt3 = new Point(${pt3.x}, ${pt3.y}, "C");`);
        console.log(`let pt4 = new Point(${pt4.x}, ${pt4.y}, "D");`);
        console.log(`let pt5 = new Point(${pt5.x}, ${pt5.y}, "E");`);
        expect(newAlgorithmPair?.toString()).to.eq(classicAlgorithmPair?.toString());
      }
    }
    console.log("OK");
  });

  it('quintet III', function () {

    let pt1 = new Point(0.8459848308432706, 0.4670531879803661, "A");
    let pt2 = new Point(0.7629345569414409, 0.6411003699908968, "B");
    let pt3 = new Point(0.9739212458710385, 0.6943795585021186, "C");
    let pt4 = new Point(0.4372421367440765, 0.728596661918421, "D");
    let pt5 = new Point(0.5240989867822258, 0.5316745732274601, "E");


    let points = [pt1, pt2, pt3, pt4, pt5];

    let classicAlgorithm = new ClassicAvgAlgorithm();
    let newAlgorithm = new FasterAvgAlgorithm(2);
    classicAlgorithm.init(points);
    newAlgorithm.init(points);

    for (let pairNo = 0; pairNo < 4; pairNo++) {
      let classicAlgorithmPair = classicAlgorithm.findNearestTwoPoints();
      let newAlgorithmPair = newAlgorithm.findNearestTwoPoints();
      if (classicAlgorithmPair?.toString() == newAlgorithmPair?.toString()) {
        console.warn("OK", classicAlgorithmPair?.toString());
        classicAlgorithmPair?.merge();
        newAlgorithmPair?.merge();
      } else {
        console.warn("KO", { pairNo });
        console.warn("classicAlgorithmPair", classicAlgorithmPair?.toString(), classicAlgorithmPair?.distance());
        console.warn("newAlgorithmPair    ", newAlgorithmPair?.toString(), newAlgorithmPair?.distance());
        let newAlgorithmPair2 = newAlgorithm.findNearestTwoPoints();
        console.warn("newAlgorithmPair2    ", newAlgorithmPair2?.toString(), newAlgorithmPair2?.distance());
        console.log(`let pt1 = new Point(${pt1.x}, ${pt1.y}, "A");`);
        console.log(`let pt2 = new Point(${pt2.x}, ${pt2.y}, "B");`);
        console.log(`let pt3 = new Point(${pt3.x}, ${pt3.y}, "C");`);
        console.log(`let pt4 = new Point(${pt4.x}, ${pt4.y}, "D");`);
        console.log(`let pt5 = new Point(${pt5.x}, ${pt5.y}, "E");`);
        expect(newAlgorithmPair?.toString()).to.eq(classicAlgorithmPair?.toString());
      }
    }
    console.log("OK");
  });

  it('quintet IV', function () {

    let pt1 = new Point(0.2235446462626985, 0.11487581358745304, "A");
    let pt2 = new Point(0.7178058915006051, 0.16362065883690552, "B");
    let pt3 = new Point(0.9724196176719103, 0.45651442739787923, "C");
    let pt4 = new Point(0.6379855295065656, 0.6227972499307219, "D");
    let pt5 = new Point(0.3533825374705554, 0.3003123279663849, "E");

    let points = [pt1, pt2, pt3, pt4, pt5];

    let classicAlgorithm = new ClassicAvgAlgorithm();
    let newAlgorithm = new FasterAvgAlgorithm(2);
    classicAlgorithm.init(points);
    newAlgorithm.init(points);

    for (let pairNo = 0; pairNo < 4; pairNo++) {
      let classicAlgorithmPair = classicAlgorithm.findNearestTwoPoints();
      let newAlgorithmPair = newAlgorithm.findNearestTwoPoints();
      if (classicAlgorithmPair?.toString() == newAlgorithmPair?.toString()) {
        console.warn("OK", classicAlgorithmPair?.toString());
        classicAlgorithmPair?.merge();
        newAlgorithmPair?.merge();
      } else {
        console.warn("KO", { pairNo });
        console.warn("classicAlgorithmPair", classicAlgorithmPair?.toString(), classicAlgorithmPair?.distance());
        console.warn("newAlgorithmPair    ", newAlgorithmPair?.toString(), newAlgorithmPair?.distance());
        let newAlgorithmPair2 = newAlgorithm.findNearestTwoPoints();
        console.warn("newAlgorithmPair2    ", newAlgorithmPair2?.toString(), newAlgorithmPair2?.distance());
        console.log(`let pt1 = new Point(${pt1.x}, ${pt1.y}, "A");`);
        console.log(`let pt2 = new Point(${pt2.x}, ${pt2.y}, "B");`);
        console.log(`let pt3 = new Point(${pt3.x}, ${pt3.y}, "C");`);
        console.log(`let pt4 = new Point(${pt4.x}, ${pt4.y}, "D");`);
        console.log(`let pt5 = new Point(${pt5.x}, ${pt5.y}, "E");`);
        expect(newAlgorithmPair?.toString()).to.eq(classicAlgorithmPair?.toString());
      }
    }
    console.log("OK");
  });  
});
