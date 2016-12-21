# images-upload-middleware

[![NPM](https://nodei.co/npm/images-upload-middleware.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/images-upload-middleware/)

Express middleware for images upload

## Usage

`npm i -S images-upload-middleware`

### Prams

- `savePath: string` - path where you want to save images;
- `servePath: string` - serve path;
- `multiple: boolean` - allows to upload a bunch of images;
- `rename: boolean` - if false, then do not rename image `default: true`;

### Examples

```javascript
import express from 'express';
import imagesUpload from 'images-upload-middleware';

const app = express();

app.use('/static', express.static('./static'));

app.post('/multiple', imagesUpload(
	'./static/multipleFiles',
	'http://localhost:8080/static/multipleFiles',
	true
));

app.post('/notmultiple', imagesUpload(
	'./static/files',
	'http://localhost:8080/static/files'
));

app.post('/notrename', imagesUpload(
	'./static/originalNameFiles',
	'http://localhost:8080/static/originalNameFiles',
	true,
	false
));

app.listen(8080);
```
