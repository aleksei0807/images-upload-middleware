/* @flow */
import multiparty from 'multiparty';
import fs from 'fs';

export default function (savePath: string, listenPath: string, multiple?: boolean) {
	const localSavePath = savePath.charAt(savePath.length - 1) === '/'
	? savePath.slice(0, -1)
	: savePath;
	const localListenPath = listenPath.charAt(listenPath.length - 1) === '/'
	? listenPath.slice(0, -1)
	: listenPath;
	return (req: Object, res: Object) => {
		const form = new multiparty.Form();
		form.parse(req, (err, fields, files) => {
			if (err) {
				console.error(err);
				res.sendStatus(400);
				return;
			}
			if (files.imageFiles && files.imageFiles.length > 0) {
				if (multiple) {
					try {
						const respFiles = files.imageFiles.map((file) => {
							const {path: tempPath, originalFilename} = file;
							const copyToPath = `${localSavePath}/${originalFilename}`;

							try {
								const data = fs.readFileSync(tempPath);
								// make copy of image to new location
								fs.writeFileSync(copyToPath, data);
								// delete temp image
								fs.unlinkSync(tempPath);
								return `${localListenPath}/${originalFilename}`;
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
					let respFile = '';
					const {path: tempPath, originalFilename} = files.imageFiles[0];
					const copyToPath = `${localSavePath}/${originalFilename}`;

					try {
						const data = fs.readFileSync(tempPath);
						// make copy of image to new location
						fs.writeFileSync(copyToPath, data);
						// delete temp image
						fs.unlinkSync(tempPath);
						respFile = `${localListenPath}/${originalFilename}`;
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
}
