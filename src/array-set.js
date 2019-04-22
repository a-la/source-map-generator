/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * A data structure which is a combination of an array and a set. Adding a new member is O(1), testing for membership is O(1), and finding the index of an element is O(1). Removing elements from the set is not supported. Only strings are supported for membership.
 */
export default class ArraySet {
  constructor() {
    /** @type {!Array<string>} */
    this._array = []
    this._set = new Map()
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   * @param {!Array<string>} array
   * @param {boolean} [allowDuplicates=false]
   */
  static fromArray(array, allowDuplicates = false) {
    const set = new ArraySet()
    for (let i = 0, len = array.length; i < len; i++) {
      set.add(array[i], allowDuplicates)
    }
    return set
  }

  /**
   * Return how many unique items are in this ArraySet. If duplicates have been added, than those do not count towards the size.
   */
  size() {
    return this._set.size
  }

  /**
   * Add the given string to this set.
   * @param {string} str
   * @param {boolean} [allowDuplicates=false]
   */
  add(str, allowDuplicates = false) {
    const isDuplicate = this.has(str)
    const idx = this._array.length
    if (!isDuplicate || allowDuplicates) {
      this._array.push(str)
    }
    if (!isDuplicate) {
      this._set.set(str, idx)
    }
  }

  /**
   * Is the given string a member of this set?
   * @param {string} aStr
   */
  has(aStr) {
    return this._set.has(aStr)
  }

  /**
   * What is the index of the given string in the array?
   * @param {string} aStr
   */
  indexOf(aStr) {
    const idx = this._set.get(aStr)
    if (idx >= 0) {
      return idx
    }
    throw new Error('"' + aStr + '" is not in the set.')
  }

  /**
   * What is the element at the given index?
   *
   * @param {number} aIdx
   */
  at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx]
    }
    throw new Error("No element indexed by " + aIdx)
  }

  /**
   * Returns the array representation of this set (which has the proper indices indicated by indexOf). Note that this is a copy of the internal array used for storing the members so that no one can mess with internal state.
   */
  toArray() {
    return this._array.slice()
  }
}