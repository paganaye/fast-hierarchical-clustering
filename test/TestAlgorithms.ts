import { expect } from 'chai';
import { ClassicAlgorithm } from '../src/ClassicAlgorithm';
import { Cluster, Dendrogram } from '../src/Cluster';
import { App } from '../src/Main';
import { NewAlgorithm } from '../src/NewAlgorithm';
import { Point } from '../src/Point';
import { QuadTree } from '../src/QuadTree';


describe('Algorithms', function () {


  it('pair', function () {
    let { classicAlgorithm, newAlgorithm } = runSideBySide([new Point(1, 1, "A"), new Point(2, 2, "B")], 1);

    console.log({ classicAlgorithm, newAlgorithm });
    expect(classicAlgorithm).to.eq("Cl(1.5,1.5) [#A,#B]");
    expect(newAlgorithm).to.eq("Cl(1.5,1.5) [#A,#B]");

  });

  it('trio', function () {
    for (let i = 1; i < 1000; i++) {
      let pt1 = Point.randomPoint();
      let pt2 = Point.randomPoint();
      let pt3 = Point.randomPoint();
      let { classicAlgorithm, newAlgorithm } = runSideBySide([pt1, pt2, pt3], 2);

      if (classicAlgorithm == newAlgorithm) {
        console.log("OK", classicAlgorithm.toString());
      } else {
        console.log("pt1", pt1.toString());
        console.log("pt2", pt2.toString());
        console.log("pt3", pt3.toString());
        console.log("classicAlgorithm:", classicAlgorithm);
        console.log("newAlgorithm    :", newAlgorithm);
        expect(newAlgorithm).to.eq(classicAlgorithm);
        break;
      }
    }
  });

  it('trio2', function () {
    let classicAlgorithm = new ClassicAlgorithm();
    let newAlgorithm = new NewAlgorithm();

    let pt1 = new Point(0.49930430783802704, 0.6145063651619018);
    let pt2 = new Point(0.22904179623612397, 0.060190517736878224);
    let pt3 = new Point(0.4008254200866377, 0.3504538760820952);
    let points = [pt1, pt2, pt3];

    classicAlgorithm.init(points);
    newAlgorithm.init(points);
    let classicAlgorithmFirstPair = classicAlgorithm.findNearestTwoPoints()?.toString();
    let newAlgorithmFirstPair = newAlgorithm.findNearestTwoPoints()?.toString();
    if (classicAlgorithmFirstPair == newAlgorithmFirstPair) {
      console.log("OK", classicAlgorithmFirstPair);
    } else {
      console.log("pt1", pt1.toString());
      console.log("pt2", pt2.toString());
      console.log("pt3", pt3.toString());
      console.log("classicAlgorithm:", classicAlgorithm);
      console.log("newAlgorithm    :", newAlgorithm);
      expect(newAlgorithm).to.eq(classicAlgorithm);
      /*
      actual   -"Cl(0.37639050805359625,0.3417169196602918) 
      [
        Cl(0.31493360816138083,0.20532219690948672) [(0.22904179623612397,0.060190517736878224),(0.4008254200866377,0.3504538760820952)]
        ,(0.49930430783802704,0.6145063651619018)]"
      expected +"Cl(0.37639050805359625,0.3417169196602918) 
      [
          (0.22904179623612397,0.060190517736878224),
          Cl(0.45006486396233236,0.4824801206219985) [(0.4008254200866377,0.3504538760820952),(0.49930430783802704,0.6145063651619018)]
      ]"
      
      */
    }
  });



  function runSideBySide(points: Point[], n: number) {
    let classicAlgorithm = new ClassicAlgorithm();
    let newAlgorithm = new NewAlgorithm();
    classicAlgorithm.init(points)
    newAlgorithm.init(points);
    for (let i = 0; i < n; i++) {
      classicAlgorithm.findNearestTwoPoints()?.merge();
      newAlgorithm.findNearestTwoPoints()?.merge();
    }
    return { classicAlgorithm: classicAlgorithm.getCurrentDendrograms().toString(), newAlgorithm: newAlgorithm.getCurrentDendrograms().toString() };
  }




});
