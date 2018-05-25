'use strict'

const assert = require( 'assert' )
const tv4 = require( 'tv4' )
const Mapper = require( '..' )
const KitchenSink = require( './fixtures/kitchen-sink' )

describe( 'schema mapper', () => {
  describe( 'omit defaults', () => {
    const mapper = Mapper()
    const { from, to } = mapper

    it( 'to schema', () => {
      const instance = KitchenSink()
      const schema = to( instance )
      const result = tv4.validateMultiple( instance, schema )

      assert( result.valid )
    })

    it( 'from schema', () => {
      const schema = to( KitchenSink() )
      const model = from( schema )
      const result = tv4.validateMultiple( model, schema )

      assert.strictEqual( model.string, '' )
      assert( result.valid )
    })

    describe( 'from arbitrary schema', () => {
      it( 'type "array" with no "items" property', () => {
        const schema = { type: 'array' }
        const model = from( schema )

        assert.deepEqual( model, [] )
      })

      it( 'type "any" with additional fields', () => {
        const schema = { name: 'foo' }
        const model = from( schema )

        assert.deepEqual( model, {} )
      })
    })
  })

  describe( 'include defaults', () => {
    const mapper = Mapper( { omitDefault: false })
    const { from, to } = mapper

    it( 'to schema', () => {
      const instance = KitchenSink()
      const schema = to( instance )
      const result = tv4.validateMultiple( instance, schema )

      assert( result.valid )
    })

    it( 'from schema', () => {
      const schema = to( KitchenSink() )
      const model = from( schema )
      const result = tv4.validateMultiple( model, schema )

      assert( result.valid )
      assert.deepEqual( model, KitchenSink() )
    })
  })
})
