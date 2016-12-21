/* @flow */
import multiparty from 'multiparty';
import md5File from 'md5-file';
import fs from 'fs';

function sendError(res: Object, error: Object) {
	const err = new Error(error);
	console.error(err);
	res.sendStatus(400);
}

function saveFile(
	tempPath: string,
	savePath: string,
	servePath: string,
	fileName: string
): { error: Object|false; path?: string; } {
	const copyToPath = `${savePath}/${fileName}`;
	try {
		if (!fs.existsSync(copyToPath)) {
			const data = fs.readFileSync(tempPath);
			// make copy of image to new location
			fs.writeFileSync(copyToPath, data);
			// delete temp image
			fs.unlinkSync(tempPath);
		}
		return {
			error: false,
			path: `${servePath}/${fileName}`,
		};
	} catch (e) {
		return {
			error: e,
		};
	}
}

export default function imagesUpload(
	savePath: string,
	servePath: string,
	multiple?: boolean,
	rename?: boolean
) {
	const localSavePath = savePath.charAt(savePath.length - 1) === '/'
	? savePath.slice(0, -1)
	: savePath;
	const localServePath = servePath.charAt(servePath.length - 1) === '/'
	? servePath.slice(0, -1)
	: servePath;
	return (req: Object, res: Object) => {
		const form = new multiparty.Form();
		form.parse(req, (err, fields, files) => {
			if (err) {
				sendError(res, err);
				return;
			}
			if (files.imageFiles && files.imageFiles.length > 0) {
				if (multiple) {
					try {
						const respFiles = files.imageFiles.map((file) => {
							const {path: tempPath, originalFilename} = file;
							let fileName = originalFilename;
							if (rename !== false) {
								const fileExtNum = fileName.lastIndexOf('.');
								const fileExt = fileExtNum < 0 ? '' : fileName.substr(fileExtNum);
								fileName = `${md5File.sync(tempPath)}${fileExt}`;
							}

							const { error, path } = saveFile(
								tempPath,
								localSavePath,
								localServePath,
								fileName
							);
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
					const {path: tempPath, originalFilename} = files.imageFiles[0];

					let fileName = originalFilename;
					if (rename !== false) {
						const fileExtNum = fileName.lastIndexOf('.');
						const fileExt = fileExtNum < 0 ? '' : fileName.substr(fileExtNum);
						fileName = `${md5File.sync(tempPath)}${fileExt}`;
					}

					const { error, path } = saveFile(
						tempPath,
						localSavePath,
						localServePath,
						fileName
					);
					if (error) {
						sendError(res, error);
						return;
					}

					res.send(JSON.stringify(path));
				}
			} else {
				res.sendStatus(400);
			}
		});
	};
}
