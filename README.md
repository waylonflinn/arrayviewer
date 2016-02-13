View binary array data stored in files, from node, the browser and the command line.

# Install
`npm install arrayviewer`

# Usage
Shows the 4th element in the array.

`node arrayviewer ./data/a.arr -i 3`

Shows the 10th element in the array with more context.

`node arrayviewer ./data/a.arr -i 9 -c 6`

# Metadata

`node arrayviewer ./data/a.arr -i 9 -c 6 -m`

If the `-m` option is specified it will also look for a file of the same name
as the array with the `.meta` extension. The `meta` file has the following format

```json
{
	"shape" : [224, 224, 3],
	"type" : "float32"
}
```

`type` is a string that maps to a `TypedArray` in the following way.

```javascript
{
	"int8" : Int8Array,
	"uint8" : Uint8Array,
	"int16" : Int16Array,
	"uint16" : Uint16Array,
	"int32" : Int32Array,
	"uint32" : Uint32Array,
	"float32" : Float32Array,
	"float64" : Float64Array
}
```

These values match the [numpy dtypes](http://docs.scipy.org/doc/numpy-1.10.1/user/basics.types.html)
