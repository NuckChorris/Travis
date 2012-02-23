# Travis
A recursive directory traverser that aims to make handling complex folder structures extremely easy.

## Install
	$ npm install Travis

## Test
The tests are written using [Mocha](https://github.com/visionmedia/mocha) and [Should](https://github.com/visionmedia/should.js), and can be run with `npm test`.

## Use
Usage is quite simple.  All you have to do is `new Travis(path)`, listen for various events on it, and `travis.scan()`.

*Please note that this **does not** ignore files like `.DS_Store`, `thumbs.db`, or any other system/dot/hidden files.  If you don't want them, ignore them yourself, you lazy bum.*
### Example
```javascript
var Travis = require('Travis');

var travis = new Travis('./folder/');

travis.on('directory', function (path, dir) {
	console.log('Directory!', path, dir);
});

travis.on('file', function (dir, name) {
	console.log('File!', dir, name);
});

travis.on('end', function () {
	console.log('DONE!');
});
travis.scan();
```

## Events
### directory
Emitted for each directory the traverser finds.

Recieves the path of the containing directory and the name of this directory.

### file
Emitted for each file the traverser finds.

Recieves the path of the containing directory and the name of the file.

### end
Emitted when the entire structure has been traversed.

### error
Emitted when something breaks.

Recieves the error.

## Issues?
If this isn't your issue, file a bug report.  If you're not lazy, file a pull request too.

You can also find me on Freenode IRC as Nuck, just ping me in #Node.js and I'll try to help you out.