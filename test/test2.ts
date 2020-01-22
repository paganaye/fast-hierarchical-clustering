import { Dog } from "../src/Dog";
import { Cat } from "../src/Cat";
var assert = require('assert');

describe('#test2', function() {

  it('The cat should meow', function() {
    let cat = new Cat();
    assert.equal("meow", cat.sound());
  });
});
