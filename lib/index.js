'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = imagesUpload;

var _multiparty = require('multiparty');

var _multiparty2 = _interopRequireDefault(_multiparty);

var _md5File = require('md5-file');

var _md5File2 = _interopRequireDefault(_md5File);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sendError(res, error) {
	var err = new Error(error);
	console.error(err);
	res.sendStatus(400);
}


function saveFile(tempPath, savePath, servePath, fileName) {
	var copyToPath = savePath + '/' + fileName;
	try {
		if (!_fs2.default.existsSync(copyToPath)) {
			var data = _fs2.default.readFileSync(tempPath);
			// make copy of image to new location
			_fs2.default.writeFileSync(copyToPath, data);
			// delete temp image
			_fs2.default.unlinkSync(tempPath);
		}
		return {
			error: false,
			path: servePath + '/' + fileName
		};
	} catch (e) {
		return {
			error: e
		};
	}
}

function imagesUpload(savePath, servePath, multiple, notRename) {
	var localSavePath = savePath.charAt(savePath.length - 1) === '/' ? savePath.slice(0, -1) : savePath;
	var localServePath = servePath.charAt(servePath.length - 1) === '/' ? servePath.slice(0, -1) : servePath;
	return function (req, res) {
		var form = new _multiparty2.default.Form();
		form.parse(req, function (err, fields, files) {
			if (err) {
				sendError(res, err);
				return;
			}
			if (files.imageFiles && files.imageFiles.length > 0) {
				if (multiple) {
					try {
						var respFiles = files.imageFiles.map(function (file) {
							var tempPath = file.path,
							    originalFilename = file.originalFilename;

							var fileName = originalFilename;
							if (notRename !== false) {
								var fileExtNum = fileName.lastIndexOf('.');
								var fileExt = fileExtNum < 0 ? '' : fileName.substr(fileExtNum);
								fileName = '' + _md5File2.default.sync(tempPath) + fileExt;
							}

							var _saveFile = saveFile(tempPath, localSavePath, localServePath, fileName),
							    error = _saveFile.error,
							    path = _saveFile.path;

							if (error) {
								throw error;
							}
							return path;
						});

						res.send(respFiles);
					} catch (e) {
						sendError(res, e);
						return;
					}
				} else {
					var _files$imageFiles$ = files.imageFiles[0],
					    tempPath = _files$imageFiles$.path,
					    originalFilename = _files$imageFiles$.originalFilename;


					var fileName = originalFilename;
					if (notRename !== false) {
						var fileExtNum = fileName.lastIndexOf('.');
						var fileExt = fileExtNum < 0 ? '' : fileName.substr(fileExtNum);
						fileName = '' + _md5File2.default.sync(tempPath) + fileExt;
					}

					var _saveFile2 = saveFile(tempPath, localSavePath, localServePath, fileName),
					    _error = _saveFile2.error,
					    _path = _saveFile2.path;

					if (_error) {
						sendError(res, _error);
						return;
					}

					res.send(JSON.stringify(_path));
				}
			} else {
				res.sendStatus(400);
			}
		});
	};
}