const assert = require('assert');
const fs = require('fs');
const path = require('path');

const createViewPath = path.join(__dirname, '..', 'src', 'views', 'garment-create.ejs');
const createView = fs.readFileSync(createViewPath, 'utf8');

assert.match(createView, /<option value="tshirts"/i, 'Create form should expose tshirts as the stored category');
console.log('garment category regression test passed');
