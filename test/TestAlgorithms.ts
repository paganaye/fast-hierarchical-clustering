import { expect } from 'chai';
import { ClassicAlgorithm } from '../src/ClassicAlgorithm';
import { Cluster, Dendrogram } from '../src/Cluster';
import { App } from '../src/Main';
import { NewAlgorithm } from '../src/NewAlgorithm';
import { Point } from '../src/Point';
import { QuadTree } from '../src/QuadTree';


describe('Algorithms', function () {


  it('can be trimmed', function () {
    let { classicAlgorithm, newAlgorithm } = runSideBySide([new Point(1, 1), new Point(2, 2)], 1);

    console.log({ classicAlgorithm, newAlgorithm });
    expect(classicAlgorithm.length).to.eq(1);
    expect(newAlgorithm.length).to.eq(1);

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
    return { classicAlgorithm: classicAlgorithm.getCurrentDendrograms(), newAlgorithm: newAlgorithm.getCurrentDendrograms() };
  }



});
