const { Bootstrap } = require('@midwayjs/bootstrap');
const path = require('path');
Bootstrap.configure({
  baseDir: path.join(__dirname, 'dist'),
  imports: [require('./dist/index')],
}).run()