/* Read a binary array file as a Float32Array, then print the value at
	the given index (with the specified amount of context)

	node arrayviewer path index context
 */
var loader = require('arrayloader');


function getArray(path, callback){

	loader.load(path, Float32Array, callback);
}

function showIndex(a, index, context){
	var result = "[",
		i;


	if(index > context){
		result += "..., ";
	}
	if(index > 0){
		for(i = Math.max(index - context, 0); i < index && i < a.length; i++ ){
			result += a[i] + ", ";
		}
	}
	result += "\n-->" + a[index] + "\n";

	for(i = index + 1; i < (index + 1 + context) && i < a.length; i++ ){
		result += a[i] + ", ";
	}

	if(i < a.length){
		result += "...]";
	} else {
		result += "]";
	}

	return result;
}

// called directly?
if(require.main === module){
	// yes, parse command line args and show something
	var argv = require('yargs')
		.usage('View binary array data\nUsage: $0 [options] <file>')
		.demand(1)
		.default('i', 0).alias('i', 'index')
		.describe('i', 'index of element in array to show')
		.default('c', 4).alias('c', 'context')
		.describe('c', 'context around element to show (on both sides)')
		.boolean('v')
		.help('h').alias('h', 'help')
		.argv

	var path = argv._[0],
		index = argv.i,
		context = argv.c;

	getArray(path, function(err, arr){

		if(!arr){
			console.log("Couldn't load array at: " + path);
			console.log('\t' + err.message);
			return;
		} else if(err) {
			console.log(err);
			return;
		}

		if(argv.v) console.log("Length: " + arr.length);

		console.log(showIndex(arr, index, context));
	});
}
else {
	// nope, just expose our functions
	module.exports = {
		"getArray" : getArray,
		"showIndex" : showIndex
	};
}
