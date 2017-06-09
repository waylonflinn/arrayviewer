#! /usr/bin/env node
/* Read a binary array file as a TypedArray, then print the value at
	the given index (with the specified amount of context)

	File extension will be used to infer type of array. A metadata file
	may also be specified.

	node arrayviewer path index context
 */
var aloader = require('arrayloader'),
	path = require('path');


function showIndex(a, index, context){
	var result = "[",
		i;


	if(index > context){
		result += "..., ";
	}
	if(index > 0){
		for(i = Math.max(index - context, 0); i < index && i < a.length; i++ ){
			result += JSON.stringify(a[i]) + ", ";
		}
	}
	result += "\n-->" + JSON.stringify(a[index]) + "\n";

	for(i = index + 1; i < (index + 1 + context) && i < a.length; i++ ){
		result += JSON.stringify(a[i]) + ", ";
	}

	if(i < a.length){
		result += "...]";
	} else {
		result += "]";
	}

	return result;
}

var META_EXT = '.meta';

/* exits if there's an error or if object is null
   if object is null the message is shown
   if err is not null that's shown
 */
function handleError(err, obj, message){

	if(!obj){
		console.log(message);
		console.log('\t' + err.message);
		process.exit(1);
	} else if(err) {
		console.log(err);
		process.exit(1);
	}
}

function showHeader(arr, meta){

	console.log("Length: " + arr.length);
	if(meta){
		if(meta.shape){
			var computed_size = 1;
			for(var i = 0; i < meta.shape.length; i++){
				computed_size *= meta.shape[i];
			}
		}

		var coord_string = meta.coords ? " ("+JSON.stringify(meta.coords)+")": "";

		if(meta.shape) console.log("Shape:  " + JSON.stringify(meta.shape));
		if(meta.type) console.log("Type:   " + meta.type);
		if(meta.shape) console.log("Valid:  " + (computed_size == arr.length));
		if(meta.index) console.log("Index:  " + meta.index + coord_string);

	}
}

function toLinearIndex(shape, coords){
	var index = 0,
		subspace = 1;

	for(var i = shape.length - 1; i >= 0; i--){
		index += coords.length > i ? coords[i] * subspace : 0;
		subspace *= shape[i];
	}
	return index;

}

function fromLinearIndex(shape, index){
	var rem = index,
		subspace = 1,
		coords = new Array(shape.length);

	for(var i = shape.length - 1; i >= 0; i--){
		subspace *= shape[i];
		coords[i] = rem % subspace;
		rem -= coords[i];
		rem /= shape[i];
	}

	return coords;
}

// called directly?
if(require.main === module){
	// yes, parse command line args and show something
	var argv = require('yargs')
		.usage('View binary array data\nUsage: $0 [options] <file>')
		.demand(1)
		.default('i', 0).alias('i', 'index')
		.describe('i', 'index of element in array to show (row in shaped mode)')
		.default('c', 4).alias('c', 'context')
		.describe('c', 'context around element to show (on both sides)')
		.default('t').alias('t', 'type')
		.describe('t', "type to use for array")
		.boolean('v').describe('v', 'show array info header')
		.boolean('m').describe('m', 'look for metadata (.meta)')
		.default('j', undefined)
		.describe('j', 'column in array to show (requires meta)')
		.default('k', undefined)
		.describe('k', 'column in array to show (requires meta)')
		.help('h').alias('h', 'help')
		.argv

	var arr_path = argv._[0],
		index = argv.i,
		context = argv.c;

	// look for meta file?
	if(argv.m){

		path_obj = path.parse(arr_path);

		meta_path = path_obj.dir + "/" + path_obj.name + META_EXT;

		// look for meta file
		aloader.load(meta_path, function(err, meta){

			handleError(err, "Couldn't load meta data at: " + meta_path);

			if(argv.j != void(0) || argv.k != void(0)){
				var j = parseInt(argv.j) || 0;
				var k = parseInt(argv.k) || 0;
				meta.coords = [index, j, k];
				index = toLinearIndex(meta.shape, meta.coords);
				meta.index = index;
			} else{
				meta.index = index;
				// use shape to find row, column, channel from linear index
				meta.coords = fromLinearIndex(meta.shape, meta.index);
			}

			aloader.load(arr_path, type, function(err, arr){

				handleError(err, arr, "Couldn't load array at: " + arr_path);

				if(argv.v) showHeader(arr, meta);

				console.log(showIndex(arr, meta.index, context));
			});
		});
	} else {

		var type;
		if(argv.t) type = argv.t;

		aloader.load(arr_path, type, function(err, arr, type){

			handleError(err, arr, "Couldn't load array at: " + arr_path);

			if(argv.v) showHeader(arr, {"type" : type});

			console.log(showIndex(arr, index, context));
		});
	}
} else {
	// nope, just expose our functions
	module.exports = {
		"showIndex" : showIndex,
		"toLinearIndex" : toLinearIndex,
		"fromLinearIndex" : fromLinearIndex
	};
}
