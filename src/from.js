'use strict'

const is = require( '@mojule/is' )

const typeMap = require( './type-map' )

const TypedSchemaPredicate = type =>
  value => is.object( value ) && value.type === type

const predicates = {
  stringSchema: TypedSchemaPredicate( 'string' ),
  numberSchema: TypedSchemaPredicate( 'number' ),
  booleanSchema: TypedSchemaPredicate( 'boolean' ),
  nullSchema: TypedSchemaPredicate( 'null' ),
  arraySchema: TypedSchemaPredicate( 'array' ),
  objectSchema: TypedSchemaPredicate( 'object' ),
  anySchema: value => is.object( value )
}

const map = {
  stringSchema: () => typeMap.string,
  numberSchema: () => typeMap.number,
  booleanSchema: () => typeMap.boolean,
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
  },
  anySchema: () => typeMap.object
}

module.exports = { predicates, map }
