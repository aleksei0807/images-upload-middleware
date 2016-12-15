# images-upload-middleware

Express middleware for images upload

## Usage

`npm i -S multiparty images-upload-middleware`

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

app.listen(8080);
```
