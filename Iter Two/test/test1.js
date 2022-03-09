var assert = require('assert');
var main = require('../controller/main.js');

describe('test 1', function(){
    describe('#TestListAll', function(){
        it('should return all songs', async function(){
            let result = await main.list_all();
            assert.strictEqual(await result.data.length, 32833);
    });
});
});