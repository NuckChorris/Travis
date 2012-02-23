var should = require('should');
var path = require('path');

describe('Travis', function () {
	describe('#Travis()', function () {
		// Load in all required files
		var Travis = require('../lib/travis.js');

		// Simple tester woo!
		var test = function (dir, tree) {
			return function (done) {
				var scanner = new Travis(dir);
				var testTree = {};
				testTree[path.normalize(dir)] = [];
				scanner.on('directory', function (dir, name) {
					testTree[path.join(dir, name)] = [];
				});
				scanner.on('file', function (dir, name) {
					if (name === '.DS_Store') return;
					testTree[dir].push(name);
				});
				scanner.on('error', function (err) {
					throw err;
					done();
				});
				scanner.on('end', function () {
					testTree.should.eql(tree);
					done();
				});
				scanner.scan();
			};
		};

		it('should fire file event', test('./test/Targets/1/', {
			'test/Targets/1/': ['Item A'],
		}));
		it('should fire directory event', test('./test/Targets/2/', {
			'test/Targets/2/': [],
			'test/Targets/2/Folder A': []
		}));
		it('should fire multiple file events', test('./test/Targets/3/', {
			'test/Targets/3/': ['Item A', 'Item B', 'Item C', 'Item D']
		}));
		it('should recurse into subdirectories', test('./test/Targets/4/', {
			'test/Targets/4/': [],
			'test/Targets/4/Folder A': ['Item A'],
		}));
		it('should recurse into subdirectories of subdirectories', test('./test/Targets/5/', {
			'test/Targets/5/': [],
			'test/Targets/5/Folder A': [],
			'test/Targets/5/Folder A/Folder A': ['Item A']
		}));
		it('should recurse into subdirectories of subdirectories and still handle multiple items', test('./test/Targets/6/', {
			'test/Targets/6/': [],
			'test/Targets/6/Folder A': [],
			'test/Targets/6/Folder A/Folder A': ['Item A', 'Item B', 'Item C', 'Item D']
		}));
		it('should recurse into multiple subdirectories', test('./test/Targets/7/', {
			'test/Targets/7/': [],
			'test/Targets/7/Folder A': ['Item A', 'Item B'],
			'test/Targets/7/Folder B': ['Item C', 'Item D']
		}));
		it('should handle a more complex structure', test('./test/Targets/8/', {
			'test/Targets/8/': ['Item E'],
			'test/Targets/8/Folder A': ['Item A', 'Item B'],
			'test/Targets/8/Folder B': ['Item C', 'Item D']
		}));
	});
});