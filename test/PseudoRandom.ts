// https://gist.github.com/blixt/f17b47c62508be59987b
// The generation of random numbers is too important to be left to chance - Robert R. Coveyou

export class PseudoRandom {
  static _seed: number = 3005;

  static  randomize(seed: number) {
    this._seed = seed % 2147483647 | 0;
    if (this._seed <= 0) this._seed += 2147483646;
  }

  // Returns a pseudo-random value between 1 and 2^32 - 2.
  static nextSeed() {
    return this._seed = this._seed * 16807 % 2147483647;
  }

  // Returns a pseudo-random floating point number in range [0, 1).
  static next() {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this.nextSeed() - 1) / 2147483646;
  }
}