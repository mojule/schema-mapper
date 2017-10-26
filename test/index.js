'use strict'

const assert = require( 'assert' )
const tv4 = require( 'tv4' )
const Mapper = require( '..' )
const KitchenSink = require( './fixtures/kitchen-sink' )

const mapper = Mapper()
const { from, to } = mapper

describe( 'schema mapper', () => {
  it( 'converts to schema', () => {
    const instance = KitchenSink()
    const schema = to( instance )

    console.log( JSON.stringify( schema, null, 2 ) )

    const result = tv4.validateMultiple( instance, schema )

    assert( result.valid )
  })

  it( 'creates from schema', () => {
    const schema = to( KitchenSink() )
    const model = from( schema )
    const result = tv4.validateMultiple( model, schema )

    assert.strictEqual( model.string, '' )
    assert( result.valid )
  })
})
