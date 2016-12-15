'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (savePath, listenPath, multiple) {
	var localSavePath = savePath.charAt(savePath.length - 1) === '/' ? savePath.slice(0, -1) : savePath;
	var localListenPath = listenPath.charAt(listenPath.length - 1) === '/' ? listenPath.slice(0, -1) : listenPath;
	return function (req, res) {
		var form = new _multiparty2.default.Form();
		form.parse(req, function (err, fields, files) {
			if (err) {
				console.error(err);
				res.sendStatus(400);
				return;
			}
			if (files.imageFiles && files.imageFiles.length > 0) {
				if (multiple) {
					try {
						var respFiles = files.imageFiles.map(function (file) {
							var tempPath = file.path,
							    originalFilename = file.originalFilename;

							var copyToPath = localSavePath + '/' + originalFilename;

							try {
								var data = _fs2.default.readFileSync(tempPath);
								// make copy of image to new location
								_fs2.default.writeFileSync(copyToPath, data);
								// delete temp image
								_fs2.default.unlinkSync(tempPath);
								return localListenPath + '/' + originalFilename;
							} catch (e) {
								throw e;
							}
						});
						res.send(respFiles);
					} catch (e) {
						console.error(e);
						res.sendStatus(400);
						return;
					}
				} else {
					var respFile = '';
					var _files$imageFiles$ = files.imageFiles[0],
					    tempPath = _files$imageFiles$.path,
					    originalFilename = _files$imageFiles$.originalFilename;

					var copyToPath = localSavePath + '/' + originalFilename;

					try {
						var data = _fs2.default.readFileSync(tempPath);
						// make copy of image to new location
						_fs2.default.writeFileSync(copyToPath, data);
						// delete temp image
						_fs2.default.unlinkSync(tempPath);
						respFile = localListenPath + '/' + originalFilename;
					} catch (e) {
						console.error(e);
						res.sendStatus(400);
						return;
					}
					res.send(JSON.stringify(respFile));
				}
			} else {
				res.sendStatus(400);
			}
		});
	};
};

var _multiparty = require('multiparty');

var _multiparty2 = _interopRequireDefault(_multiparty);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }