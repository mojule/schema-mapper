'use strict'

const is = require( '@mojule/is' )
const Mapper = require( '@mojule/mapper' )

const clone = Mapper()

const everySame = arr =>
  arr.length > 0 && arr.every( item => item === arr[ 0 ] )

const array = ( value, options ) => {
  const { mapper } = options

  const schema = Schema( 'array', value, options )

  let types = new Set()
  const json = []

  const schemas = value.map( current => {
    const schema = mapper( current, options )

    types.add( schema.type )
    json.push( JSON.stringify( schema ) )

    return schema
  })

  if( everySame( json ) ){
    schema.items = JSON.parse( json[ 0 ] )

    return schema
  }

  types = Array.from( types )

  const { length } = types

  if( length === 1 ){
    const type = types[ 0 ]

    if( type === 'object' )
      return arrayObject( schema, value, options )

    schema.items = { type }
  } else if( length > 1 )  {
    // nb this could/should be extended to anyOf
    schema.items = {}
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
      let values = propertyValues[ name ]

      if( !values ){
        values = []
        propertyValues[ name ] = values
      }

      values.push( obj[ name ] )
    })
  })

  const type = 'object'
  const properties = Object.keys( propertyValues ).reduce( ( obj, name ) => {
    const { items: schema } = array( propertyValues[ name ], options )

    obj[ name ] = schema

    return obj
  }, {} )
  required = Array.from( required )

  schema.items = { type, properties, required }

  return schema
}

const Schema = ( type, value, options ) => {
  const { omitDefault, mapper } = options
  const schema = { type }

  if( !omitDefault ){
    schema.default = clone( value )
  }

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
      obj[ key ] = mapper( value[ key ], options )

      return obj
    }, {})

    if( Object.keys( properties ).length )
      schema.properties = properties

    return schema
  }
}

module.exports = { map }
