import { Dog } from "../src/Dog";

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {

    let dog = new Dog();
    it('The dog should bark', function() {
      assert.equal("woof", dog.sound());
    });
  });
});