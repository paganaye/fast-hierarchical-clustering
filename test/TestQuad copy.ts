import { expect } from 'chai';
import { Cluster } from '../src/Cluster';
import { Point } from '../src/Point';
import { QuadTree } from '../src/avg/QuadTree';


describe('A Quad', function () {
  it('stores points', function () {
    let quad = new QuadTree(4);
    quad.insert(new Point(0, 0));
  });

  it('has a recursive structure', function () {
    let quad = new QuadTree(3);
    quad.insert(new Point(0, 0));

    expect(quad.root.topLeft?.nodeSize).to.eq(0.5); // 1
    expect(quad.root.topLeft?.topLeft?.nodeSize).to.eq(0.25); // 0
    expect(quad.root.topLeft?.topLeft?.points![0].x).to.eq(0.0);
  });

  it('has variable precision', function () {
    let quad = new QuadTree(4);
    quad.insert(new Point(0, 0));

    expect(quad.root.topLeft?.nodeSize).to.eq(0.5);
    expect(quad.root.topLeft?.topLeft?.nodeSize).to.eq(0.25);
    expect(quad.root.topLeft?.topLeft?.topLeft?.nodeSize).to.eq(0.125);
    expect(quad.root.topLeft?.topLeft?.topLeft?.points![0].x).to.eq(0.0);
  });

  it('can be trimmed', function () {
    let quad = new QuadTree(4);
    quad.insert(new Point(0, 0));

    expect(quad.root.topLeft?.nodeSize).to.eq(0.5);
    expect(quad.root.topLeft?.topLeft?.nodeSize).to.eq(0.25);
    expect(quad.root.topLeft?.topLeft?.topLeft?.nodeSize).to.eq(0.125);
    expect(quad.root.topLeft?.topLeft?.topLeft?.points![0].x).to.eq(0.0);

    quad.trim()
    expect(quad.root.topLeft?.topLeft?.points![0].x).to.eq(0.0);

    quad.trim()
    expect(quad.root.topLeft?.points![0].x).to.eq(0.0);

    quad.trim();
    expect(quad.root.points![0].x).to.eq(0.0);

  });


  it('can get neighbours', function () {
    let quad = new QuadTree(2);

    quad.insert(new Point(0.25, 0.25, "A"));
    quad.insert(new Point(0.75, 0.25, "B"));
    quad.insert(new Point(0.25, 0.75, "C"));
    quad.insert(new Point(0.75, 0.75, "D"));
    // A B
    // C D
    let pairs = quad.getNeighbours();
    expect(pairs.length).to.eq(0);

    quad.trim();
    pairs = quad.getNeighbours();
    expect(pairs.length).to.eq(6);
    expect(pairs[0].toString()).to.eq("#A #B 0.5");
    expect(pairs[1].toString()).to.eq("#A #C 0.5");
    expect(pairs[2].toString()).to.eq("#A #D 0.7071067811865476");
    expect(pairs[3].toString()).to.eq("#B #C 0.7071067811865476");
    expect(pairs[4].toString()).to.eq("#B #D 0.5");
    expect(pairs[5].toString()).to.eq("#C #D 0.5");
  });


  it('can get a more neighbours', function () {
    let quad = new QuadTree(3);

    //  A B
    //    F
    //        L
    //    N O P
    quad.insert(new Point(0.125, 0.125, "A"));
    quad.insert(new Point(0.375, 0.125, "B"));
    quad.insert(new Point(0.375, 0.375, "F"));
    quad.insert(new Point(0.875, 0.625, "L"));
    quad.insert(new Point(0.375, 0.875, "N"));
    quad.insert(new Point(0.625, 0.875, "O"));
    quad.insert(new Point(0.875, 0.875, "P"));

    let pairs = quad.getNeighbours();
    expect(pairs.length).to.eq(0);

    quad.trim();
    pairs = quad.getNeighbours();
    expect(pairs.length).to.eq(7);
    expect(pairs[0].toString()).to.eq("#A #B 0.25");
    expect(pairs[1].toString()).to.eq("#A #F 0.3535533905932738");
    expect(pairs[2].toString()).to.eq("#B #F 0.25");
    expect(pairs[3].toString()).to.eq("#N #O 0.25");
    expect(pairs[4].toString()).to.eq("#L #O 0.3535533905932738");
    expect(pairs[5].toString()).to.eq("#L #P 0.25");
    expect(pairs[6].toString()).to.eq("#O #P 0.25");
  });

});
