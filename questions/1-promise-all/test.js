/**
 * 
 * @param {Mocha.MochaGlobals['describe']} describe 
 * @param {Mocha.MochaGlobals['it']} it 
 * @param {import('chai')['expect']} expect 
 * @param {() => any} code 
 */
export default function test(describe, it, expect, code) {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            expect([1, 2, 3].indexOf(4)).to.equal(-1);
        });
    });
    it('should take less than 500ms', function (done) {
        expect(2).to.equal(200);
    });
}