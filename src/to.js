'use strict'

const is = require( '@mojule/is' )
const Mapper = require( '@mojule/mapper' )
const typeMap = require( './type-map' )

const clone = Mapper()

const Schema = ( type, value, options ) => {
  const { mapper } = options
  const schema = { type, default: typeMap[ type ] }

  return schema
}

const everySame = arr =>
  arr.length > 0 && arr.every( item => item === arr[ 0 ] )

const array = ( value, options ) => {
  const { mapper } = options

  const schema = Schema( 'array', value, options )

  schema.items = {}

  if( value.length === 0 )
    return schema

  if( value.length === 1 ){
    schema.items = mapper( value[ 0 ], options )

    return schema
  }

  let types = new Set()
  const jsonMap = {}

  value.forEach( current => {
    const schema = mapper( current, options )

    types.add( schema.type )
    jsonMap[ JSON.stringify( schema ) ] = schema
  })

  const jsonKeys = Object.keys( jsonMap )

  if( everySame( jsonKeys ) ){
    schema.items = jsonMap[ jsonKeys[ 0 ] ]

    return schema
  }

  types = Array.from( types )

  const { length } = types

  if( length === 1 && types[ 0 ] === 'object' ){
    return arrayObject( schema, value, options )
  }

  return schema
}

const arrayObject = ( schema, objects, options ) => {
  const propertyValues = {}
  let required = new Set()

  const head = objects[ 0 ]
  const rest = objects.slice( 1 )

  Object.keys( head ).forEach( name => {
    required.add( name )

    const values = []
    values.push( head[ name ] )
    propertyValues[ name ] = values
  })

  rest.forEach( obj => {
    const names = Object.keys( obj )

    required.forEach( name => {
      if( !( name in obj ) )
        required.delete( name )
    })

    names.forEach( name => {
      propertyValues[ name ].push( obj[ name ] )
    })
  })

  const type = 'object'

  const properties = Object.keys( propertyValues ).reduce( ( obj, key ) => {
    // leverage the array function to figure out schemas for the property
    const { items: property } = array( propertyValues[ key ], options )

    property.name = key

    obj[ key ] = property

    return obj
  }, {} )

  required = Array.from( required )

  schema.items = { type, properties, required }

  return schema
}

const map = {
  string: ( value, options ) => Schema( 'string', value, options ),
  number: ( value, options ) => Schema( 'number', value, options ),
  boolean: ( value, options ) => Schema( 'boolean', value, options ),
  null: ( value, options ) => ({ type: 'null' }),
  array,
  object: ( value, options ) => {
    const schema = Schema( 'object', value, options )
    const { mapper } = options

    const properties = Object.keys( value ).reduce( ( obj, key ) => {
      const property = mapper( value[ key ], options )

      property.name = key

      obj[ key ] = property

      return obj
    }, {})

    if( Object.keys( properties ).length )
      schema.properties = properties

    return schema
  }
}

module.exports = { map }
