const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const router = express.Router();
const config = require('../config');
const path = require('path');

console.log(config.build.index);
router.get('/', (req, res, next) => { res.sendFile(config.build.index)});


/* serves all the static files */
router.get('/static/*', (req, res, next) => { 
  res.sendFile( path.posix.join( path.posix.join(config.build.assetsRoot, config.build.assetsSubDirectory), req.params[0])); 
});

app.use('/', router);

app.listen(port);
console.log('App running on port', port);