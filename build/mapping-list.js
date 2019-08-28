/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const { compareByGeneratedPositionsInflated } = require('./util');

/**
 * Determine whether mappingB is after mappingA with respect to generated position.
 * @param {_sourceMapGenerator.Mapping} mappingA
 * @param {_sourceMapGenerator.Mapping} mappingB
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  const { generatedLine: lineA, generatedColumn: columnA } = mappingA
  const { generatedLine: lineB, generatedColumn: columnB } = mappingB
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
    compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a negligible overhead in general case for a large speedup in case of mappings being added in order.
 */
class MappingList {
  constructor() {
    /** @type {!Array<_sourceMapGenerator.Mapping>} */
    this._array = []
    this._sorted = true
    // Serves as infimum
    /** @type {_sourceMapGenerator.Mapping} */
    this._last = { generatedLine: -1, generatedColumn: 0, name: null, originalColumn: null, originalLine: null, source: null }
  }

  /**
   * Iterate through internal items. This method takes the same arguments that `Array.prototype.forEach` takes.
   *
   * NOTE: The order of the mappings is NOT guaranteed.
   * @param {function(_sourceMapGenerator.Mapping)} aCallback
   * @param {!Object} aThisArg
   */
  unsortedForEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg)
  }

  /**
   * Add the given source mapping.
   * @param {!_sourceMapGenerator.Mapping} mapping
   */
  add(mapping) {
    if (generatedPositionAfter(this._last, mapping)) {
      this._last = mapping
      this._array.push(mapping)
    } else {
      this._sorted = false
      this._array.push(mapping)
    }
  }

  /**
   * Returns the flat, sorted array of mappings. The mappings are sorted by generated position.
   *
   * WARNING: This method returns internal data without copying, for performance. The return value must NOT be mutated, and should be treated as an immutable borrow. If you want to take ownership, you must make your own copy.
   */
  toArray() {
    if (!this._sorted) {
      this._array.sort(compareByGeneratedPositionsInflated)
      this._sorted = true
    }
    return this._array
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('.').Mapping} _sourceMapGenerator.Mapping
 */

module.exports = MappingList