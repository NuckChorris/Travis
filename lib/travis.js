var fs = require('fs');
var path = require('path');
var util = require("util");

var merge = require('./merge.js');

var Travis = function (dir, options) {
	this.path = dir;
	this.options = merge(this.options, options);
};

util.inherits(Travis, process.EventEmitter);

Travis.prototype.scan = function () {
	var dir = path.normalize(this.path);
	var self = this;

	fs.readdir(dir, function (err, files) {
		if (err) return self.emit('error', err);

		if (files.length === 0) {
			self.emit('end');
		}

		var n = 0;
		for (var i = 0, l = files.length; i < l; i++) {

			(function (filename, i) {
				var file = path.join(dir, filename);

				fs.stat(file, function (err, stats) {
					if (stats.isDirectory()) {
						self.emit('directory', dir, filename);

						var scan = new Travis(file);

						// Pass the events through.
						scan.on('file', function (dir, filename) {
							self.emit('file', dir, filename);
						});
						scan.on('directory', function (dir, filename) {
							self.emit('directory', dir, filename);
						});
						scan.on('error', function (err) {
							self.emit('error', err);
						});
						scan.on('end', function () {
							if (++n === l) {
								self.emit('end');
							}
						});
						scan.scan();
					} else if (stats.isFile()) {
						self.emit('file', dir, filename);
						if (++n === l) {
							self.emit('end');
						}
					} else {
						if (++n === l) {
							self.emit('end');
						}
					}
				});
			})(files[i], i);
		}
	});
};

module.exports = Travis;