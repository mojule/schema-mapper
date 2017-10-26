'use strict'

const is = require( '@mojule/is' )

const typeMap = require( './type-map' )

const predicates = {
  stringSchema: value => is.object( value ) && value.type === 'string',
  numberSchema: value => is.object( value ) && value.type === 'number',
  booleanSchema: value => is.object( value ) && value.type === 'boolean',
  nullSchema: value => is.object( value ) && value.type === 'null',
  arraySchema: value => is.object( value ) && value.type === 'array',
  objectSchema: value => is.object( value ) && value.type === 'object'
}

const map = {
  stringSchema: value => typeMap.string,
  numberSchema: value => typeMap.number,
  booleanSchema: value => typeMap.boolean,
  nullSchema: () => typeMap.null,
  arraySchema: ( value, options ) => {
    const { mapper } = options

    if( value.items ) return [ mapper( value.items, options ) ]

    return typeMap.array
  },
  objectSchema: ( value, options ) => {
    if( is.object( value.properties ) && !is.empty( value.properties ) ){
      const { mapper } = options

      return Object.keys( value.properties ).reduce( ( obj, key ) => {
        obj[ key ] = mapper( value.properties[ key ], options )

        return obj
      }, {} )
    }

    return typeMap.object
  }
}

module.exports = { predicates, map }
