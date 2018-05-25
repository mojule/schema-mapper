# schema-mapper

`npm install @mojule/schema-mapper`

```javascript
const Mapper = require( '@mojule/schema-mapper' )

const { from, to } = Mapper()

let data = {
  name: 'Nik',
  age: 37,
  classes: [ 'foo', 'bar' ]
}

const schema = to( data )
```

```json
{
  "type": "object",
  "name": "object",
  "id": "",
  "properties": {
    "name": {
      "type": "string",
      "name": "name",
      "id": "/name"
    },
    "age": {
      "type": "number",
      "name": "age",
      "id": "/age"
    },
    "classes": {
      "type": "array",
      "name": "classes",
      "id": "/classes",
      "items": {
        "type": "string",
        "name": "string",
        "id": "/classes[]"
      }
    }
  }
}
```

```javascript
data = from( schema )
```

```json
{
  "name": "",
  "age": 0,
  "classes": [
    ""
  ]
}
```

```javascript
const Mapper = require( '@mojule/schema-mapper' )

const { from, to } = Mapper( { omitDefault: false } )

let data = {
  name: 'Nik',
  age: 37,
  classes: [ 'foo', 'bar' ]
}

const schema = to( data )
```

```json
{
  "type": "object",
  "name": "object",
  "id": "",
  "properties": {
    "name": {
      "type": "string",
      "name": "name",
      "id": "/name",
      "default": "Nik"
    },
    "age": {
      "type": "number",
      "name": "age",
      "id": "/age",
      "default": 37
    },
    "classes": {
      "type": "array",
      "name": "classes",
      "id": "/classes",
      "default": [
        "foo",
        "bar"
      ],
      "items": {
        "id": "/classes[]",
        "name": "any"
      }
    }
  }
}
```

```javascript
data = from( schema )
```

```json
{
  "name": "Nik",
  "age": 37,
  "classes": [
    "foo",
    "bar"
  ]
}
```
