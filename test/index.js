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
    const result = tv4.validateMultiple( instance, schema )

    assert( result.valid )
  })

  it( 'converts from schema', () => {
    const instance = KitchenSink()
    const schema = to( instance )
    const kitchenSink = from( schema )

    assert.deepEqual( kitchenSink, KitchenSink() )
  })

  it( 'creates from schema with no defaults', () => {
    const mapper = Mapper({ omitDefault: true })
    const { from, to } = mapper
    const schema = to( KitchenSink() )
    const model = from( schema )
    const result = tv4.validateMultiple( model, schema )

    assert.strictEqual( model.string, '' )
    assert( result.valid )
  })
})
