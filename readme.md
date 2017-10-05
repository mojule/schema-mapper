# schema-mapper

`npm install @mojule/schema-mapper`

```javascript
const Mapper = require( '@mojule/schema-mapper' )

const { from, to } = Mapper()

const data = {
  name: 'Nik',
  age: 37,
  classes: [ 'foo', 'bar' ]
}

const schema = to( data )
```

```json
{
  "type": "object",
  "default": {
    "name": "Nik",
    "age": 37
  },
  "properties": {
    "name": {
      "type": "string",
      "default": "Nik"
    },
    "age": {
      "type": "number",
      "default": 37
    },
    "classes": {
      "type": "array",
      "default": [
        "foo",
        "bar"
      ],
      "items": {
        "type": "string"
      }
    }
  }
}
```

```javascript
const Mapper = require( '@mojule/schema-mapper' )

const { from, to } = Mapper( { omitDefault: true } )

const data = {
  name: 'Nik',
  age: 37,
  classes: [ 'foo', 'bar' ]
}

const schema = to( data )
```

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "number"
    },
    "classes": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

```javascript
const data = from( schema )
```

```json
{
  "name": "",
  "age": 0,
  "classes": [ "" ]
}
```