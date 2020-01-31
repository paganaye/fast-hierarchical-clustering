// I wanted Iterable but this name was taken

export interface Enumerable<T> {
  getFirst(): T | null
  getNext(): T | null
}
