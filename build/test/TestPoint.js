import {expect} from "../_snowpack/pkg/chai.js";
import {Point} from "../src/Point.js";
describe("Point", function() {
  it("stores a coordinate", function() {
    let point = new Point(10, 20);
    expect(point.x).to.eq(10);
    expect(point.y).to.eq(20);
  });
});
