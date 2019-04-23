/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
const base64VLQ = require('./base64-vlq');
const { relative, toSetString, compareByGeneratedPositionsInflated } = require('./util');
const ArraySet = require('./array-set');
const MappingList = require('./mapping-list');

               class SourceMapGenerator {
  /**
   * An instance of the SourceMapGenerator represents a source map which is being built incrementally.
   * @param {_sourceMapGenerator.Config} conf Options for the program.
   * @param {string} [conf.file] The filename of the generated source.
   * @param {string} [conf.sourceRoot] A root for all relative URLs in this source map.
   * @param {boolean} [conf.skipValidation=false] When `true`, disables validation of mappings as they are added. This can improve performance but should be used with discretion, as a last resort. Even then, one should avoid using this flag when running tests, if possible. Default `false`.
   */
  constructor(conf = {}) {
    const { file, sourceRoot, skipValidation = false } = conf
    this._file = file
    this._sourceRoot = sourceRoot
    this._skipValidation = skipValidation
    this._sources = new ArraySet()
    this._names = new ArraySet()
    this._mappings = new MappingList()
    /** @type {?Object<string, string>} */
    this._sourcesContents = null
  }

  /**
   * Add a single mapping from original source line and column to the generated source's line and column for this source map being created. The mapping object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   *
   * @param {{generated: !_sourceMapGenerator.Position, original: (?_sourceMapGenerator.Position|undefined), source: (?string|undefined), name: (?string|undefined) }} mapping
   */
  addMapping(mapping) {
    let { generated, original = null, source = null, name = null } = mapping
    if (!generated) throw new Error('"generated" is a required argument')

    if (!this._skipValidation)
      this._validateMapping(generated, original, source, name)

    if (source) {
      source = `${source}`
      if (!this._sources.has(source)) {
        this._sources.add(source)
      }
    }

    if (name) {
      name = `${name}`
      if (!this._names.has(name)) {
        this._names.add(name)
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original ? original.line : null,
      originalColumn: original ? original.column : null,
      source,
      name,
    })
  }

  /**
   * Set the source content for a source file.
   * @param {string} sourceFile
   * @param {string} [sourcesContent]
   */
  setSourceContent(sourceFile, sourcesContent) {
    let source = sourceFile
    if (this._sourceRoot != null) {
      source = relative(this._sourceRoot, source)
    }

    if (sourcesContent) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null)
      }
      this._sourcesContents[toSetString(source)] = sourcesContent
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[toSetString(source)]
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null
      }
    }
  }

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   * @param {_sourceMapGenerator.Position} generated The position of a token.
   * @param {number} generated.line The line number.
   * @param {number} generated.column The column number.
   * @param {?_sourceMapGenerator.Position} original The position of a token.
   * @param {number} original.line The line number.
   * @param {number} original.column The column number.
   * @param {?string} source
   * @param {?string} name
   */
  _validateMapping(generated, original, source, name) {
    // When original is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (original && typeof original.line != "number" && typeof original.column != "number") {
      throw new Error(
        "original.line and original.column are not numbers -- you probably meant to omit " +
            "the original mapping entirely and only map the generated position. If so, pass " +
            "null for the original mapping instead of an object with empty or null values."
      )
    }

    if (generated && "line" in generated && "column" in generated
        && generated.line > 0 && generated.column >= 0
        && !original && !source && !name) {
      // Case 1.

    } else if (generated && "line" in generated && "column" in generated
             && original && "line" in original && "column" in original
             && generated.line > 0 && generated.column >= 0
             && original.line > 0 && original.column >= 0
             && source) {
      // Cases 2 and 3.

    } else {
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated,
        source,
        original,
        name,
      }))
    }
  }

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs specified by the source map format.
   */
  _serializeMappings() {
    let previousGeneratedColumn = 0
    let previousGeneratedLine = 1
    let previousOriginalColumn = 0
    let previousOriginalLine = 0
    let previousName = 0
    let previousSource = 0
    let result = ""
    let next
    let mapping
    let nameIdx
    let sourceIdx

    const mappings = this._mappings.toArray()
    for (let i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i]
      next = ""

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";"
          previousGeneratedLine++
        }
      } else if (i > 0) {
        if (!compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
          continue
        }
        next += ","
      }

      next += base64VLQ(mapping.generatedColumn
                                 - previousGeneratedColumn)
      previousGeneratedColumn = mapping.generatedColumn

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source)
        next += base64VLQ(sourceIdx - previousSource)
        previousSource = sourceIdx

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ(mapping.originalLine - 1
                                   - previousOriginalLine)
        previousOriginalLine = mapping.originalLine - 1

        next += base64VLQ(mapping.originalColumn
                                   - previousOriginalColumn)
        previousOriginalColumn = mapping.originalColumn

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name)
          next += base64VLQ(nameIdx - previousName)
          previousName = nameIdx
        }
      }

      result += next
    }

    return result
  }

  /**
   * @param {!Array<string>} sources
   * @param {string} [sourceRoot]
   */
  _generateSourcesContent(sources, sourceRoot) {
    return sources.map(function(source) {
      if (!this._sourcesContents) {
        return null
      }
      if (sourceRoot)
        source = relative(sourceRoot, source)
      const key = toSetString(source)
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null
    }, this)
  }

  /**
   * Externalize the source map.
   */
  toJSON() {
    const sources = this._sources.toArray()
    const map = {
      'version': this._version,
      'sources': sources,
      'names': this._names.toArray(),
      'mappings': this._serializeMappings(),
    }
    if (this._file) map['file'] = this._file
    if (this._sourceRoot) map['sourceRoot'] = this._sourceRoot
    if (this._sourcesContents) {
      map['sourcesContent'] = this._generateSourcesContent(sources, this._sourceRoot)
    }

    return map
  }

  /**
   * Render the source map being generated to a string.
   */
  toString() {
    return JSON.stringify(this.toJSON())
  }
}

SourceMapGenerator.prototype._version = 3

/* typal types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_sourceMapGenerator.Config} Config Options for the program.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _sourceMapGenerator.Config Options for the program.
 * @prop {string} [file] The filename of the generated source.
 * @prop {string} [sourceRoot] A root for all relative URLs in this source map.
 * @prop {boolean} [skipValidation=false] When `true`, disables validation of mappings as they are added. This can improve performance but should be used with discretion, as a last resort. Even then, one should avoid using this flag when running tests, if possible. Default `false`.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_sourceMapGenerator.Position} Position The position of a token.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _sourceMapGenerator.Position The position of a token.
 * @prop {number} line The line number.
 * @prop {number} column The column number.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_sourceMapGenerator.Mapping} Mapping
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _sourceMapGenerator.Mapping
 * @prop {?string} source The source file.
 * @prop {number} generatedLine The generated line number.
 * @prop {number} generatedColumn The generated column number.
 * @prop {?number} originalLine The original line number.
 * @prop {?number} originalColumn The original column number.
 * @prop {?string} name The name of the mapping.
 */


module.exports = SourceMapGenerator