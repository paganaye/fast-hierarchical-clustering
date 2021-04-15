import { expect } from 'chai';
import { Cluster } from '../src/Cluster';
import { Point } from '../src/Point';

describe('Point', function () {
  it('stores a coordinate', function () {
    let point = new Point(10, 20);
    expect(point.x).to.eq(10);
    expect(point.y).to.eq(20);
  });
});
