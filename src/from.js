'use strict'

const is = require( '@mojule/is' )

const predicates = {
  stringSchema: value => is.object( value ) && value.type === 'string',
  numberSchema: value => is.object( value ) && value.type === 'number',
  booleanSchema: value => is.object( value ) && value.type === 'boolean',
  nullSchema: value => is.object( value ) && value.type === 'null',
  arraySchema: value => is.object( value ) && value.type === 'array',
  objectSchema: value => is.object( value ) && value.type === 'object'
}

const map = {
  stringSchema: value => value.default || '',
  numberSchema: value => value.default || 0,
  booleanSchema: value => value.default || false,
  nullSchema: () => null,
  arraySchema: ( value, options ) => {
    if( value.default ) return value.default

    const { mapper } = options

    if( value.items ) return [ mapper( value.items, options ) ]

    return []
  },
  objectSchema: ( value, options ) => {
    if( value.default ) return value.default

    if( is.object( value.properties ) && !is.empty( value.properties ) ){
      const { mapper } = options

      return Object.keys( value.properties ).reduce( ( obj, key ) => {
        obj[ key ] = mapper( value.properties[ key ], options )

        return obj
      }, {} )
    }

    return {}
  }
}

module.exports = { predicates, map }
