import { expect } from 'chai';
import { PointEx } from '../../src/faster/FasterQuadNode';
import { FasterQuadTree } from '../../src/faster/FasterQuadTree';


describe('Faster QuadTree', function () {
  it('stores points', function () {
    let quad = new FasterQuadTree(4);
    quad.insert(new PointEx(0, 0));
  });

  it('has a recursive structure', function () {
    let quad = new FasterQuadTree(3);
    quad.insert(new PointEx(0, 0));

    expect(quad.root.topLeft?.nodeSize).to.eq(0.5); // 1
    expect(quad.root.topLeft?.topLeft?.nodeSize).to.eq(0.25); // 0
    expect(quad.root.topLeft?.topLeft?.points![0].x).to.eq(0.0);
  });

  it('has variable precision', function () {
    let quad = new FasterQuadTree(4);
    quad.insert(new PointEx(0, 0));

    expect(quad.root.topLeft?.nodeSize).to.eq(0.5);
    expect(quad.root.topLeft?.topLeft?.nodeSize).to.eq(0.25);
    expect(quad.root.topLeft?.topLeft?.topLeft?.nodeSize).to.eq(0.125);
    expect(quad.root.topLeft?.topLeft?.topLeft?.points![0].x).to.eq(0.0);
  });

  it('can be trimmed', function () {
    let quad = new FasterQuadTree(4);
    quad.insert(new PointEx(0, 0));

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


  it('can get pairs', function () {
    let quad = new FasterQuadTree(2);

    quad.insert(new PointEx(0.25, 0.25, "A"));
    quad.insert(new PointEx(0.70, 0.25, "B"));
    quad.insert(new PointEx(0.25, 0.75, "C"));
    quad.insert(new PointEx(0.74, 0.75, "D"));
    // A B
    // C D
    let clusters = quad.getAllClusters();
    expect(clusters.length).to.eq(2);
    expect(clusters[0].toString()).to.eq("AB (0.475,0.25)");
    expect(clusters[1].toString()).to.eq("CD (0.495,0.75)");

    quad.trim();
    clusters = quad.getAllClusters();
    expect(clusters.length).to.eq(1);
    expect(clusters[0].toString()).to.eq("ABCD (0.485,0.5)");
  });


});
