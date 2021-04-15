import { expect } from 'chai';
import { Cluster } from '../src/Cluster';
import { Point } from '../src/Point';


describe('Cluster', function () {

  it('can store a set of points', function () {
    let point1 = new Point(10, 20);
    let point2 = new Point(15, 25);
    let cluster1 = new Cluster(point1, point2)
    expect(cluster1.dendrogram1).to.eq(point1);
    expect(cluster1.dendrogram2).to.eq(point2);
    expect(cluster1.x).to.eq(12.5);
    expect(cluster1.y).to.eq(22.5);
  });

  it('can store a set of clusters', function () {
    let cluster1 = new Cluster(new Point(1, 2),new Point(1.1, 2.1));
    let cluster2 = new Cluster(new Point(3, 4),new Point(3.1, 4.1));
    let cluster3 = new Cluster(cluster1, cluster2)
    expect(cluster3.dendrogram1).to.eq(cluster1);
    expect(cluster3.dendrogram2).to.eq(cluster2);
    expect(cluster3.x).to.eq(2.05);
    expect(cluster3.y).to.eq(3.05);
  });
});
