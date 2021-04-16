export class PseudoRandom {
  static randomize(seed) {
    this._seed = seed % 2147483647 | 0;
    if (this._seed <= 0)
      this._seed += 2147483646;
  }
  static random() {
    this._seed = this._seed * 16807 % 2147483647;
    return (this._seed - 1) / 2147483646;
  }
}
PseudoRandom._seed = 3005;
