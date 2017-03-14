View binary array data stored in files, from node, the browser and the command line.

# Install
`npm install -g arrayviewer`

# Usage
Show the 4th element (`-i 3`) in an array stored in a file at `./data/a.f32`:

`arrayviewer ./data/a.f32 -i 3`

produces something like,

```
[126.48208618164062, 127.23143005371094, 136.79074096679688,
-->126.48942565917969
127.26338195800781, 136.84552001953125, 126.47312927246094, 127.27062225341797, ...]
```

Show the 10th element, with more context (`-c 5`).

`arrayviewer ./data/a.f32 -i 9 -c 5`

might produce,
```
[..., 136.84552001953125, 126.47312927246094, 127.27062225341797, 136.86407470703125, 126.44374084472656,
-->127.25633239746094
136.88494873046875, 126.36851501464844, 127.19410705566406, 136.8431396484375, 126.31245422363281, ...]
```

Show some extra information with `-v`,

`arrayviewer ./data/a.f32 -i 9 -c 5 -v`

```
Length: 150528
[..., 136.84552001953125, 126.47312927246094, 127.27062225341797, 136.86407470703125, 126.44374084472656,
-->127.25633239746094
136.88494873046875, 126.36851501464844, 127.19410705566406, 136.8431396484375, 126.31245422363281, ...]
```
# Extensions
Array type is inferred from a file's extension. An extensions is mapped to a `TypedArray` in the
following way:
```javascript
{
	".i8" : Int8Array,
	".u8" : Uint8Array,
	".i16" : Int16Array,
	".u16" : Uint16Array,
	".i32" : Int32Array,
	".u32" : Uint32Array,
	".f32" : Float32Array,
	".f64" : Float64Array
}
```
If none of these match the file extension (and no metadata file is provided), the data will be interpreted as a `Float32Array`.

# Metadata

`arrayviewer ./data/a.f32 -i 9 -c 6 -m`

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

In addition to allowing parsing of array types other than `Float32Array`,
providing a meta file allows you to index into an array using
`-i`, `-j`, `-k` to specify row, column and channel, respectively.

# Numpy

Write compatible arrays from numpy like this,
```python
# given array 'a'
f = open('./data/a.f32', 'wb')
f.write(a.astype(np.float32).tostring())
f.close
```
